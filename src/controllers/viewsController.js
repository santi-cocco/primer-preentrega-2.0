import { request, response } from "express"
import { getProductsService } from "../services/productsServices.js";
import { getCartByIdService } from "../services/cartsServices.js";


export const homeView = async (req = request, res = response) => {
    const limit = 50;
    const {payload} = await getProductsService({limit});

    const user  = req.session.user ;


    return res.render('home', { title:'Home', productos: payload, user });
};

export const realTimeProductsView  = async (req = request, res = response) => {
    const user  = req.session.user ;

    return res.render('realTimeProducts' , {title:'Real time ', user}) 
};

export const productsView  = async (req = request, res = response) => {
    const result = await getProductsService({...req.query});
    const user  = req.session.user ;
    return res.render('products', { title: 'productos', result , user});
};

export const cartIdView  = async (req = request, res = response) => {
    const {cid} = req.params;
    const carrito = await getCartByIdService(cid);
    const user  = req.session.user ;
    return res.render('cart',{title:'carrito', carrito, user});
};

export const loginGet = async (req = request, res = response) =>{

    if(req.session.user)
        return res.redirect('/')
    return res.render('login', {title: 'Login'})
}
 
export const registerGet = async (req = request, res = response) =>{

    if(req.session.user)
        return res.redirect('/');

    return res.render('register', {title: 'Register'})
}

export const registerPost = async (req = request, res = response) =>{

    if(!req.user)
        return res.redirect('/register');

    return res.redirect('/login');
}

export const login = async (req = request, res = response) =>{
    
    if(!req.user)
        return res.redirect('/login');
    
    req.session.user={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        rol:req.user.rol,
        image:req.user.image

    }
    return res.redirect('/')
}

export const logOut = async (req = request, res = response) => {
    req.session.destroy(err => {
    if (err) 
        return res.send({ status: false, body:err });
    else
        return res.redirect('/login');
    });
};
  




