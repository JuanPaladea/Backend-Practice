import { Router } from "express";
// import CartManager from "../dao/utils/cartManager.js";
import CartManagerDB from "../dao/utils/cartManagerDB.js";

const router = Router();

// const cartManagerInstance = new CartManager('data/carts.json')
const cartManagerService = new CartManagerDB()

router.post('/', async (req, res) => {
  try {
    await cartManagerService.addCart();
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }

  res.send({status:'success', message:'carrito creado'});
})

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  
  try {
    await cartManagerService.addProductToCart(cartId, productId);
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
  res.send({status:'success', message:'producto agregado al carrito'});
})

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManagerService.getCart(cartId);
    res.send({cart});
  } catch (error) {
    return res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    await cartManagerService.deleteCart(cartId);
    res.send("Carrito eliminado")
  } catch (error) {
    return res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

export default router