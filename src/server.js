import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import 'dotenv/config.js'
import cookieParser from 'cookie-parser';
import morgan from "morgan";

import products from './routes/productsRoutes.js';
import carts from './routes/cartRouter.js';
import views from './routes/viewsRouter.js';
import sessionRoutes from './routes/sessionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { __dirname } from './utils.js';
import { dbConnection } from './database/config.js';
import { productModel } from './models/productsModel.js';
import { addProductService, getProductsService } from './services/productsServices.js';
import { initializePassport } from './config/passportConfig.js';


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static( __dirname + '/public'));
app.use(morgan("dev"));

app.use(session({
  store:MongoStore.create({
    mongoUrl: `${process.env.URI_MONGO_DB}/${process.env.NAME_DB}`,
    ttl: 3300
  }),
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized:true,
}))


//CONFIG PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine("handlebars", engine())
app.set('views', __dirname + '/views')
app.set("view engine","handlebars")

// Rutas
app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);
app.use('/api/session', sessionRoutes);
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);



// Conexión a la base de datos
await dbConnection();


// Iniciar servidor HTTP
const expressServer = app.listen(PORT, () => {
    try {
      console.log(`Listening to the port ${PORT}`);
      console.log(`Acceder a:`);
      console.log(`\t1. http://localhost:${PORT}/api/products`);
      console.log(`\t2. http://localhost:${PORT}/api/carts`);
    } catch (err) {
      console.error('Error al iniciar el servidor:', err);
    }
  });
  
  const io = new Server(expressServer);

    io.on('connection', async (socket) => {
        console.log('Cliente conectado');
        
        //Productos
        const limit = 50;
        const {payload} = await getProductsService({limit});
        const productos = payload;
        socket.emit('productos', payload);
        socket.on('agregarProducto', async (producto) => {
            const newProduct = await addProductService({...producto})
            if (newProduct) {
                productos.push(newProduct)
                socket.emit('productos', productos)
            }
        });

        socket.on('eliminarProducto', async (productId) => {
          try {
              await productModel.findByIdAndDelete(productId);
              const productosActualizados = await productModel.find();
              io.emit('productos', productosActualizados); 
          } catch (error) {
              console.error('Error eliminando el producto:', error);
          }
      });
    });
  