import { Router } from "express";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";
import { addCart, addProductToCart, deleteCart, deleteProductFromCart, getCart, getCarts, purchaseCart, updateProductQuantity } from "../controllers/cartsController.js";

const router = Router();

router.post('/', auth, isVerified, addCart)
router.get('/', auth, isVerified, isAdmin, getCarts)
router.get('/:cid', auth, isVerified, isAdmin, getCart)
router.post('/:cid/products/:pid', auth, isVerified, addProductToCart)
router.put('/:cid/products/:pid', auth, isVerified, updateProductQuantity)
router.delete("/:cid/products/:pid", auth, isVerified, deleteProductFromCart)
router.delete("/:cid", auth, isVerified, deleteCart)
router.post('/:cid/purchase', auth, isVerified, purchaseCart)

export default router