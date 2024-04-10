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

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManagerService.getCart(cartId);
    res.send({cart});
  } catch (error) {
    return res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
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

router.put('/:cid', async (req, res) => {
  const cartId = req.query.cid
  const products = req.body.products

  try {
    await cartManagerService.updateCart(cartId)
  } catch (error) {
    console.error(error)
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.query.cid
  const productId= req.query.pid

  try {
    await cartManagerService.updateProductQuantity(cartId, productId, quantity)
  } catch (error) {
    console.error(error)
  }
})

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    await cartManagerService.deleteAllProductsFromCart(cartId);
    res.send("Carrito eliminado")
  } catch (error) {
    return res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid
  try {
    await cartManagerService.deleteProductFromCart(cartId, productId)
    res.send('Producto ' + productId + ' eliminado del carrito')
  } catch (error) {
    console.error(error)
  }
})

export default router