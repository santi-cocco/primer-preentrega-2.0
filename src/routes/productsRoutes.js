import { Router } from 'express';
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from '../controllers/productsControllers.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductsById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router; 