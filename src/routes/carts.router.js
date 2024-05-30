import { Router } from "express";

import cartService from "../services/cartService.js";
import auth from "../middlewares/auth.js";

const router = Router();


router.get('/:cid', auth, async (req, res) => {
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
    res.status(400).send({status: 'error', error: 'Error al obtener el carrito', error})
  }
})

export default router