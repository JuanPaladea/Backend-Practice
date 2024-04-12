import { Router } from "express";
// import CartManager from "../dao/utils/cartManager.js";
import CartManagerDB from "../dao/utils/cartManagerDB.js";

const router = Router();

// const cartManagerInstance = new CartManager('data/carts.json')
const cartManagerService = new CartManagerDB()
router.post('/', async (req, res) => {
  try {
    await cartManagerService.addCart();
    res.send({status:'success', message:'carrito creado'});
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

router.get('/', async (req, res) => {
  try {
    const carts = await cartManagerService.getAllCarts();
    res.send({carts})
  } catch(error) {
    console.error(error)
  }
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

router.post('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity

  try {
    await cartManagerService.addProductToCart(cartId, productId, quantity);
    res.send({status:'success', message:'producto agregado al carrito'});
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid
  const products = req.body.products
  try {
    const cart = await cartManagerService.updateCart(cartId, products)
    res.send({status:'success', message:'carrito editado', cart});
  } catch (error) {
    console.error(error)
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const quantity = req.body.quantity 
  try {
    await cartManagerService.updateProductQuantity(cartId, productId, quantity)
    res.send({status:'success', message:'cantidad editada', cart});
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