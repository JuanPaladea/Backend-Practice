import { Router } from "express";

import cartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";

const router = Router();

router.get('/:cid', authRedirect, async (req, res) => {
  const cartId = req.params.cid
  try {
    const cart = await cartService.getCart(cartId)
    res.render(
      "cart",
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Carrito',
      cartId: cart._id,
      products: cart.products,
      script: 'deleteProductFromCart.js',
    })
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

export default router