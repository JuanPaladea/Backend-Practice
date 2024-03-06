import express from 'express'
import ProductManager from './productManager.js'

const productManagerInstance = new ProductManager('../data/products.json')

const app = express();
const port = 8800;

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send("Bievenido.<br></br>Ve a /api/products para ver productos <br></br>Ve a /api/products/[id] para ir a un producto especifico<br></br>Introduce /api/products/?limit=(numero) para mostrar un máximo de productos")
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

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send({ status: 'error', message: 'Missing required fields' });
  }

  try {
    await productManagerInstance.addProduct({
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [],
    })
  } catch {
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }

  res.send({status:'success', message:'producto agregado'});  
})

app.put('/api/products/:productId', async (req, res) => {
  const productId = req.params.productId;
  const productData = req.body;

  try {
    await productManagerInstance.updateProduct(productId, productData);
  } catch {
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }

  res.send({status:'success', message:'producto editado'});
})

app.delete('/api/products/:productId', async (req, res) => {
  const productId = req.params.productId;
  
  try {
    await productManagerInstance.deleteProduct(productId);
  } catch {
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }

  res.send({status:'success', message:'producto eliminado'});
})

// CART MANAGEMENT



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})