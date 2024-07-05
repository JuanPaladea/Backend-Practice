import { Router } from "express";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";
import { addProduct, deleteProduct, getMockProducts, getProduct, getProducts, updateProduct } from "../controllers/productsController.js";

const router = Router();

router.get('/', auth, isVerified, getProducts)
router.get('/:productId', auth, isVerified, getProduct)
router.post('/', auth, isVerified, addProduct)
router.put('/:productId', auth, isVerified, updateProduct)
router.delete('/:productId', auth, isVerified, deleteProduct)
router.get('/mock/mockingproducts', getMockProducts)

export default router