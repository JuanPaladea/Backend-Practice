import { Router } from "express";
import CartManagerDB from "../dao/utils/cartManagerDB.js";

const router = Router();

const cartManagerService = new CartManagerDB()

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid
  try {
    const cart = await cartManagerService.getCart(cartId)
    res.render(
      "cart",
    {
      layout: 'default',
      style: 'index.css',
      products: cart.products
    })
  } catch (error) {
    console.error(error)
  }
})

export default router