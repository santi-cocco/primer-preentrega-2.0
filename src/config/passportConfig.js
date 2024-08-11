// import passport from 'passport';
// import local from 'passport-local';
// import GitHubStrategy from 'passport-github2'
// import { getUserById, getUserEmail, registerUser } from '../services/usersService.js';
// import { createHash, comparePassword } from '../utils/bcryptPassword.js';

// const LocalStrategy = local.Strategy;

// export const initializaPassport = () => {
//     passport.use('register', new LocalStrategy(
//         {passReqToCallback: true , usernameField:'email'},
//         async (req, username, password, done) => {
//             try {
//                 const {confirmPassword} = req.body;

//                 if(password !== confirmPassword){
//                     console.log('No coinciden las contraseñas');
//                     return done(null, false)
//                 }

//                 const user= await getUserEmail(username);

//                 if(user){
//                     console.log('el usuario ya existe');
//                     return done(null, false);
//                 }

//                 req.body.password = createHash(password);

//                 const newUser = await registerUser({...req.body});

//                 if(newUser)

//                     return done(null, newUser);
                
//                 return done(null, false);

//             } catch (error) {
//                 done(error)                
//             }
//         }));

//     passport.use('login', new LocalStrategy(
//         {usernameField:'email'},
//          async (username, password, done) => {
//             try {
//                 const user = await getUserEmail(username);
//                 if(!user){
//                     console.log('El usuario no existe');
//                     done(null, false);
//                 }

//                 if(!isValidPassword(password, user.password)){
//                     console.log('Las password no coinciden');
//                     return done(null, false);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 done(error)
//             }

//          }));

//     passport.serializeUser((user, done)=>{
//         done(null, user._id);

//     });

//     passport.deserializeUser(async(id, done)=>{
//         const user = await getUserById(id);
//         done(null, user);
//     });

//     passport.use('github', new GitHubStrategy(
//         {
//             clientID: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             callbackURl: process.env.CALLBACK_URL,
//         },
//         async (accessToken, refreshToken, profile, done)=>{
//             try {
//                 const email = profile._json.email;
//                 const user = await getUserEmail(email);

//                 if(user)
//                     return done (null, user)

//                 const newUser = {
//                     first_name:profile._json.first_name, 
//                     email, 
//                     password:'.$',
//                     image:profile._json.avatar_url,
//                     github: true
//                 };

//                 const result = await registerUser({...newUser});
//                 return done(null, result)
//             } catch (error) {
//                 done(error)
            
//             }

//     }))
// };
import passport from 'passport';
import local from 'passport-local';
import jwt from 'jsonwebtoken';
import jwtStrategy from 'passport-jwt';
import { userModel } from '../models/usersModel.js';
import { comparePassword } from '../utils/bcryptPassword.js';
import GitHubStrategy from 'passport-github2'


const LocalStrategy = local.Strategy;
const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
  // Estrategia de Registro
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        const { confirmPassword } = req.body;

        if (password !== confirmPassword) {
          return done(null, false, { message: 'Las contraseñas no coinciden' });
        }

        const user = await userModel.findOne({ email: username });

        if (user) {
          return done(null, false, { message: 'El usuario ya existe' });
        }

        req.body.password = createHash(password); 

        const newUser = await userModel.create(req.body); 

        if (newUser) {
          return done(null, newUser);
        }

        return done(null, false, { message: 'Error al registrar el usuario' });

      } catch (error) {
        return done(error);
      }
    }
  ));

  // Estrategia de Inicio de Sesión
  passport.use('login', new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await userModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        if (!(await comparePassword(password, user.password))) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  //Estrategia de github 
  passport.use('github', new GitHubStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURl: process.env.CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done)=>{
                try {
                    const email = profile._json.email;
                    const user = await getUserEmail(email);
    
                    if(user)
                        return done (null, user)
    
                    const newUser = {
                        first_name:profile._json.first_name, 
                        email, 
                        password:'.$',
                        image:profile._json.avatar_url,
                        github: true
                    };
    
                    const result = await registerUser({...newUser});
                    return done(null, result)
                } catch (error) {
                    done(error)
                
                }
    
        }))

  // Serialización del Usuario
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialización del Usuario
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Estrategia JWT
  passport.use('jwt', new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET || 's3cr3t', 
    },
    async (payload, done) => {
      try {
        return done(null, payload);
      } catch (error) {
        return done(error);
      }
    }
  ));
};

// Función para extraer el token del cookie
function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
}

export { initializePassport };
