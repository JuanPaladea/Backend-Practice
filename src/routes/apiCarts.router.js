import { Router } from "express";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { addCart, addProductToCart, deleteCart, deleteProductFromCart, getCart, getCarts, purchaseCart, updateProductQuantity } from "../controllers/cartsController.js";

const router = Router();

router.post('/', auth, addCart)
router.get('/', auth, isAdmin, getCarts)
router.get('/:cid', auth, isAdmin, getCart)
router.post('/:cid/products/:pid', auth, addProductToCart)
router.put('/:cid/products/:pid', auth, updateProductQuantity)
router.delete("/:cid/products/:pid", auth, deleteProductFromCart)
router.delete("/:cid", auth, deleteCart)
router.post('/:cid/purchase', auth, purchaseCart)

export default router