import { Router } from "express";
// import ProductManager from "../dao/utils/productManager.js";
import ProductManagerDB from "../dao/utils/productManagerDB.js";

const router = Router();

// const productManagerInstance = new ProductManager('data/products.json');
const productManagerService = new ProductManagerDB()

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, query = {}, sort = {price: -1}} = req.query;
    const result = await productManagerService.getProducts(limit, page, query, sort);
    res.send({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : null,
      nextLink: result.nextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : null
    })
  } catch (error) {
    console.error(error)
  }
})

router.get('/:productId', async (req, res) => {
  let productId = req.params.productId;
  try {
    const product = await productManagerService.getProductById(productId);
    if (!product) {
      return res.send({error: 'Producto no encontrado'});
    }
    res.send({product})
  } catch (error) {
    console.error(error)
  }
})

router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  try {
    await productManagerService.addProduct({
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
    })
    res.send({status:'success', message:'producto agregado'});  
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

router.put('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const productData = req.body;

  try {
    await productManagerService.updateProduct(productId, productData);
    res.send({status:'success', message:'producto editado'});
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

router.delete('/:productId', async (req, res) => {
  const productId = req.params.productId;
  
  try {
    await productManagerService.deleteProduct(productId);
    res.send({status:'success', message:'producto eliminado ' + productId});
  } catch (error){
    console.error(error)
    res.status(400).send({status:'error', error:'ha ocurrido un error'})
  }
})

export default router