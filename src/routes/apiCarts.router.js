import { Router } from "express";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { addCart, addProductToCart, checkOutMP, deleteCart, deleteCartsWithoutUser, deleteProductFromCart, failureMP, getCart, getCarts, pendingMP, purchaseCart, successMP, updateProductQuantity } from "../controllers/cartsController.js";

const router = Router();

router.post('/', auth, addCart)
router.get('/', auth, isAdmin, getCarts)
router.get('/:cid', auth, isAdmin, getCart)
router.delete("/deleteCarts", auth, isAdmin, deleteCartsWithoutUser)
router.delete("/:cid", auth, isAdmin, deleteCart)

router.post('/:cid/products/:pid', auth, addProductToCart)
router.put('/:cid/products/:pid', auth, updateProductQuantity)
router.delete("/:cid/products/:pid", auth, deleteProductFromCart)

router.post('/:cid/purchase', auth, purchaseCart)
router.post('/mercadopago', auth, checkOutMP)
router.get('/mercadopago/success', auth, successMP)
router.get('/mercadopago/failure', auth, failureMP)
router.get('/mercadopago/pending', auth, pendingMP)

export default router