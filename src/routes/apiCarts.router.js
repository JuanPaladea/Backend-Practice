import { Router } from "express";
import cartService from "../services/cartService.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = Router();

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.session.user._id
    const cart = await cartService.addCart(userId);
    res.status(201).send({status:'success', message:'carrito creado', cart});
  } catch (error){
    res.status(400).send({status:'error', message: error.message})
  }
})

router.get('/:cid', auth, isAdmin, async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartService.getCart(cartId);
    res.status(200).send({status:'success', message:'carrito encontrado', cart});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.status(200).send({status:'success', message:'carritos encontrados', carts});
  } catch(error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.post('/:cid/products/:pid', auth, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const userId = req.session.user._id;

  const cart = await cartService.getCart(cartId);
  if (cart.user !== userId) {
    return res.status(401).send({status:'error', message:'No tienes permisos para agregar productos a este carrito'})
  }

  const quantity = +req.body.quantity;
  if (quantity) {
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).send({ status: 'error', error: 'Invalid quantity' });
    }
  }

  try {
    const cart = await cartService.addProductToCart(cartId, productId, quantity = 1);
    res.status(201).send({status:'success', message:`producto ${productId} agregado al carrito`, cart});
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', message: error.message})
  }
})

router.put('/:cid/products/:pid', auth, async (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const quantity = +req.body.quantity;
  const userId = req.session.user._id;

  const cart = await cartService.getCart(cartId);
  if (cart.user !== userId) {
    return res.status(401).send({status:'error', message:'No tienes permisos para modificar este carrito'})
  }
  
  if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).send({ status: 'error', error: 'Invalid quantity' });
  }

  try {
    const cart = await cartService.updateProductQuantity(cartId, productId, quantity)
    res.status(200).send({status:'success', message:'cantidad de producto actualizada', cart});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete("/:cid", auth, async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.session.user._id;

  const cart = await cartService.getCart(cartId);
  if (cart.user !== userId) {
    return res.status(401).send({status:'error', message:'No tienes permisos para eliminar este carrito'})
  }

  try {
    const cart = await cartService.deleteAllProductsFromCart(cartId);
    res.status(200).send({status:'success', message:'carrito eliminado', cart});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete("/:cid/products/:pid", auth, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid
  const userId = req.session.user._id;

  const cart = await cartService.getCart(cartId);
  if (cart.user !== userId) {
    return res.status(401).send({status:'error', message:'No tienes permisos para eliminar productos de este carrito'})
  }
  
  try {
    const cart = await cartService.deleteProductFromCart(cartId, productId)
    res.status(200).send({status:'success', message:`producto ${productId} eliminado del carrito`, cart});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

export default router