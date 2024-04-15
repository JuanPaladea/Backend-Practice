import { Router } from "express";
import ProductManagerDB from "../dao/utils/productManagerDB.js";

const router = Router();

const productManagerService = new ProductManagerDB()

router.get('/', async (req, res) => {
  try {
    let { limit = 8, page = 1, query = null, sort = null} = req.query;
    const result = await productManagerService.getProducts(limit, page, query, sort);
    res.render(
      "products",
      {
      layout: "default",
      style: "index.css",
      status: 'success',
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage ? `http://localhost:8080/products?page=${result.prevPage}` : null,
      nextLink: result.nextPage ? `http://localhost:8080/products?page=${result.nextPage}` : null,
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
        layout: "default"
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
        style: "index.css",
        product: product
      })
  } catch (error) {
    console.error(error)
  }
})

router.post('/add', async (req, res) => {
  const product = req.body.product
  try {
    productManagerService.addProduct(product)
  } catch (error) {
    console.error(error)
  }
  res.send(`producto agregado`)
})

export default router