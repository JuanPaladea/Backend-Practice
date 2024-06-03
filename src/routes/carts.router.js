import { Router } from "express";

import cartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router();

router.get('/:cid', authRedirect, isVerified, async (req, res) => {
  const cartId = req.params.cid
  try {
    const cart = await cartService.getCart(cartId)
    res.render(
      "cart",
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Carrito',
      script: 'cart.js',
      cartId: cartId,
      products: cart.products
    })
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

export default router