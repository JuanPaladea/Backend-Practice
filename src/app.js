import express from 'express'
import ProductManager from './productManager.js'

const productManagerInstance = new ProductManager('./src/products.json')

const app = express();
const port = 8800;

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send("Bievenido.<br></br>Ve a /products para ver productos <br></br>Ve a /products/[id] para ir a un producto especifico<br></br>Introduce /products/?limit=(numero) para mostrar un máximo de productos")
})

app.get('/products', async (req, res) => {
  let limit = req.query.limit;
  const products = await productManagerInstance.getProducts(limit);
  res.send({products})
})

app.get('/products/:productId', async (req, res) => {
  let productId = req.params.productId;
  let product = await productManagerInstance.getProductById(productId);
  if (!product) {
    return res.send({error: 'Producto no encontrado'});
  }
  res.send({product})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})