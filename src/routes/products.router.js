import { Router } from "express";
import ProductManagerDB from "../dao/utils/productManagerDB.js";

const router = Router();

const productManagerService = new ProductManagerDB()

router.get('/', async (req, res) => {
  try {
    let { limit = 8, page = 1, query = null, sort = null} = req.query;

    if (query) {
      query = JSON.parse(query);
    }

    if (sort) {
      sort = JSON.parse(sort)
    }

    const result = await productManagerService.getProducts(limit, page, query, sort);
    res.render(
      "products",
      {
      layout: "default",
      style: "index.css",
      status: 'success',
      title: 'Backend Juan Paladea | Productos',
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage ? `http://localhost:8080/products?${query ? `query=${encodeURIComponent(JSON.stringify(query))}` : ''}${limit ? `&limit=${limit}` : ''}${sort ? `&sort=${encodeURIComponent(JSON.stringify(sort))}` : ''}&page=${result.prevPage}` : null,
      nextLink: result.nextPage ? `http://localhost:8080/products?${query ? `query=${encodeURIComponent(JSON.stringify(query))}` : ''}${limit ? `&limit=${limit}` : ''}${sort ? `&sort=${encodeURIComponent(JSON.stringify(sort))}` : ''}&page=${result.nextPage}` : null,
      limit, 
      page,
      query,
      sort
    })
  } catch (error) {
    console.error(error)
  }
})

router.get('/add', async (req, res) => {
  try {
    res.render(
      "addProduct",
      {
        layout: "default",
        script: 'addProduct.js',
        title: 'Backend Juan Paladea | Agregar producto'
      }
    )
  } catch (error) {
    console.error(error)
  }
})

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid
  try {
    const product = await productManagerService.getProductById(productId)
    res.render(
      "product",
      {
        layout: "default",
        script: 'addToCart.js',
        title: 'Backend Juan Paladea | ' + product.title,
        product: product
      })
  } catch (error) {
    console.error(error)
  }
})

router.post('/add', async (req, res) => {
  const product = req.body.product
  try {
    await productManagerService.addProduct(product)
    res.send(`producto agregado`)
  } catch (error) {
    console.error(error)
  }
})

export default router