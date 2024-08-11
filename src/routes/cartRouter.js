import { Router } from 'express';
import { 
  getCartById, 
  createCart, 
  addProductInCart, 
  deleteCart, 
  updateProductsInCart, 
  deleteProductsInCart, 
//   deleteAllProductsInCart 
} from '../controllers/cartsControllers.js';

const router = Router();

router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductInCart);

router.put('/:cid/products/:pid', updateProductsInCart);
router.delete('/:cid', deleteCart);
router.delete('/:cid/products/:pid', deleteProductsInCart);




// router.delete('/:cid', deleteAllProductsInCart);

export default router;