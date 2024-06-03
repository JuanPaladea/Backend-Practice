import { Router } from "express";
import cartService from "../services/cartService.js";
import productService from "../services/productService.js";
import ticketService from "../services/ticketService.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";
const router = Router();

router.post('/', auth, isVerified, async (req, res) => {
  const userId = req.session.user._id

  try {
    const cart = await cartService.addCart(userId);
    res.status(201).send({status:'success', message:'carrito creado', cart});
  } catch (error){
    res.status(400).send({status:'error', message: error.message})
  }
})

router.get('/:cid', auth, isVerified, isAdmin, async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartService.getCart(cartId);
    res.status(200).send({status:'success', message:'carrito encontrado', cart});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.get('/', auth, isVerified, isAdmin, async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.status(200).send({status:'success', message:'carritos encontrados', carts});
  } catch(error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.post('/:cid/products/:pid', auth, isVerified, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const userId = req.session.user._id;

  try {
    const cart = await cartService.getCart(cartId);

    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para agregar productos a este carrito'})
    }

    const quantity = +req.body.quantity || 1;
    if (quantity) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).send({ status: 'error', error: 'Invalid quantity' });
      }
    }

    const response = await cartService.addProductToCart(cartId, productId, quantity);
    res.status(201).send({status:'success', message:`producto ${productId} agregado al carrito`, response});
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', message: error.message})
  }
})

router.put('/:cid/products/:pid', auth, isVerified, async (req, res) => {
  const cartId = req.params.cid
  const productId = req.params.pid
  const quantity = +req.body.quantity;
  const userId = req.session.user._id;
  
  try {
    const cart = await cartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para modificar este carrito'})
    }
    
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).send({ status: 'error', error: 'Invalid quantity' });
    }

    const response = await cartService.updateProductQuantity(cartId, productId, quantity)
    res.status(200).send({status:'success', message:'cantidad de producto actualizada', response});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete("/:cid", auth, isVerified, async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.session.user._id;

  try {
    const cart = await cartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para eliminar este carrito'})
    }

    const response = await cartService.deleteAllProductsFromCart(cartId);
    res.status(200).send({status:'success', message:'carrito eliminado', response});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete("/:cid/products/:pid", auth, isVerified, async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid
  const userId = req.session.user._id;

  try {
    const cart = await cartService.getCart(cartId);
    if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para eliminar productos de este carrito'})
    }
    
    const deletedCart = await cartService.deleteProductFromCart(cartId, productId)
    res.status(200).send({status:'success', message:`producto eliminado del carrito`});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message})
  }
})

router.post('/:cid/purchase', auth, isVerified, async (req, res) => {
  const cartId = req.params.cid;
  const userId = req.session.user._id;

  try {
    // Check if cart belong to the user
    const cart = await cartService.getCart(cartId);
      if (cart.user._id.toString() !== userId) {
      return res.status(401).send({status:'error', message:'No tienes permisos para comprar este carrito'})
    }
    // Check if cart has products
    if (!cart.products.length) {
      return res.status(400).send({status:'error', message:'No hay productos en el carrito'})
    }
    // Check if products have enough stock and remove them from the cart if they don't and add them to a variable
    let itemsRemoved = [];
    for (let item of cart.products) {
      const product = await productService.getProductById(item.product._id);
      if (product.stock < item.quantity) {
        itemsRemoved.push(item);
        await cartService.deleteProductFromCart(cartId, item.product._id);
      }
    }
    const currentCart = await cartService.getCart(cartId);
    // Calculate the total amount of the current cart
    let totalAmount = 0;
    for (let item of currentCart.products) {
      totalAmount += item.product.price * item.quantity;
    }

    //Update new products stock
    for (let item of currentCart.products) {
      await productService.updateProduct(item.product._id, { stock: item.product.stock - item.quantity });
    }
    
    //Auto-generate code and autoincrement
    let code = 0;
    let tickets = await ticketService.getTickets();
    if (tickets.length) {
      code = tickets[tickets.length - 1].code + 1;
    }

    // Generate ticket with the currentCart and delete all products from the cart
    const ticket = await ticketService.createTicket({ code, amount: totalAmount, products: currentCart.products, purchaser: userId });
    await cartService.deleteAllProductsFromCart(cartId);

    // If there were products with no stock add them again to the cart after the purchase is done
    if (itemsRemoved.length > 0) {
      for (let item of itemsRemoved) {
        await cartService.addProductToCart(cartId, item.product._id, item.quantity);
      }
    }
    // Display the ticket and if there were products with no stock, display them too
    res.status(200).send({status:'success', message:'compra realizada', ticket, itemsRemoved});
  } catch (error) {
    res.status(400).send({status:'error', message: error.message, error: error})
  }
})

export default router