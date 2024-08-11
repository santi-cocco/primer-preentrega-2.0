import { Router } from 'express';
import { 
    cartIdView,
    homeView,
    loginGet,
    login,
    logOut,
    productsView,
    realTimeProductsView, 
    registerGet,
    registerPost} from '../controllers/viewsController.js';
import passport from 'passport';

const router = Router();

router.get("/" ,  homeView);
router.get("/realtimeproducts" ,  realTimeProductsView);
router.get("/products",  productsView);
router.get("/cart/:cid", cartIdView);
router.get("/login", loginGet);
router.get("/register", registerGet);
router.get('/logout', logOut);

router.post("/register", passport.authenticate('register',{failureRedirect:'/register'}) ,registerPost);
router.post("/login", passport.authenticate('login',{failureRedirect:'/login'}) ,login);

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{ });
router.get('/login-github-callback', passport.authenticate('github',{failureRedirect:'/register'}), login)


export default router;