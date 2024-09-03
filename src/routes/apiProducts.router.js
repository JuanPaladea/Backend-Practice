import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addProduct, deleteProduct, getMockProducts, getProduct, getProducts, updateProduct } from "../controllers/productsController.js";
import isPremium from "../middlewares/isPremium.js";

const router = Router();

router.get('/', getProducts)
router.post('/', auth, isPremium, addProduct)
router.get('/:productId', getProduct)
router.put('/:productId', auth, isPremium, updateProduct)
router.delete('/:productId', auth, isPremium, deleteProduct)

router.get('/mock/mockingproducts', getMockProducts)

export default router