import { Router } from "express";
import CartManagerDB from "../dao/utils/cartManagerDB.js";
import auth from "../middlewares/auth.js";

const router = Router();

const cartManagerService = new CartManagerDB()

router.get('/:cid', auth, async (req, res) => {
  const cartId = req.params.cid
  try {
    const cart = await cartManagerService.getCart(cartId)
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
    console.error(error)
  }
})

export default router