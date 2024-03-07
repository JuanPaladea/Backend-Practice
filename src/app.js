import express from 'express'
import { ProductManager } from './productManager.js'
import CartManager from './cartManager.js'

const productManagerInstance = new ProductManager('../data/products.json')
const cartManagerInstance = new CartManager('../data/carts.json')

const app = express();
const port = 8800;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send("Bievenido")
})

// PRODUCTS MANAGEMENT

app.get('/api/products', async (req, res) => {
  let limit = req.query.limit;
  const products = await productManagerInstance.getProducts(limit);
  res.send({products})
})

app.get('/api/products/:productId', async (req, res) => {
  let productId = req.params.productId;
  let product = await productManagerInstance.getProductById(productId);

  if (!product) {
    return res.send({error: 'Producto no encontrado'});
  }
  res.send({product})
})

app.post('/api/products', async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  try {
    await productManagerInstance.addProduct({
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
    })
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
  res.send({status:'success', message:'producto agregado'});  
})

app.put('/api/products/:productId', async (req, res) => {
  const productId = +req.params.productId;
  const productData = req.body;
  console.log(req.body)
  try {
    await productManagerInstance.updateProduct(productId, productData);
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
  res.send({status:'success', message:'producto editado'});
})

app.delete('/api/products/:productId', async (req, res) => {
  const productId = +req.params.productId;
  
  try {
    await productManagerInstance.deleteProduct(productId);
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }

  res.send({status:'success', message:'producto eliminado'});
})

// CART MANAGEMENT
app.post('/api/carts/', async (req, res) => {
  try {
    await cartManagerInstance.addCart();
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }

  res.send({status:'success', message:'carrito creado'});
})

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;
  
  try {
    await cartManagerInstance.addProductToCart(cartId, productId);
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
  res.send({status:'success', message:'producto agregado al carrito'});
})

app.get('/api/carts/:cid', async (req, res) => {
  const cartId = +req.params.cid;
  const cart = await cartManagerInstance.getCart(cartId);
  if (!cart) {
    return res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
  res.send({cart});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})