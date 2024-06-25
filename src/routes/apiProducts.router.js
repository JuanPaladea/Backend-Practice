import { Router } from "express";
import productService from "../services/productService.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";
import { generateProducts } from "../utils/faker.js";
import CustomError from "../errors/CustomError.js";
import { generateProductsErrorInfo } from "../errors/info/productsInfo.js";
import { errorCodes } from "../errors/enums.js";

const router = Router();

router.get('/', auth, isVerified, async (req, res) => {
  const limit = +req.query.limit || 8;
  const page = +req.query.page || 1;
  const { query = null, sort = null } = req.query;
  
  if (typeof limit !== 'number' || typeof page !== 'number') {
    req.logger.warning(`${req.method} ${req.path} - limit and page must be numbers`)
    return res.status(400).send({status: 'error', message: 'limit and page must be numbers'})
  }
  if (limit < 1 || page < 1) {
    req.logger.warning(`${req.method} ${req.path} - limit and page must be greater than 0`)
    return res.status(400).send({status: 'error', message: 'limit and page must be greater than 0'})
  }
  if (query) {
    query = JSON.parse(query);
  }
  if (sort) {
    sort = JSON.parse(sort)
  }

  try {
    const products = await productService.getProducts(limit, page, query, sort);
    res.status(200).send({status: 'success', message: 'productos encontrados', products})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.get('/:productId', auth, isVerified, async (req, res) => {
  let productId = req.params.productId;

  try {
    const product = await productService.getProductById(productId);
    res.status(200).send({status: 'success', message: 'producto encontrado', product})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.post('/', auth, isVerified, isAdmin, async (req, res) => {
  const product = req.body.product;
  
  try {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
      req.logger.warning(`${req.method} ${req.path} - One or more fields are missing`)
      CustomError.createError({
        name: "Product Error",
        cause: generateProductsErrorInfo(errorCodes.MISSING_DATA_ERROR, req.body.product),
        message: "One or more fields are missing",
        code: errorCodes.MISSING_DATA_ERROR,
      });
    }

    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.code !== 'number' || typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0 || typeof product.category !== 'string' || !Array.isArray(product.thumbnails)) {
      req.logger.warning(`${req.method} ${req.path} - One or more fields have the wrong type`)
      CustomError.createError({
        name: "Product Error",
        cause: generateProductsErrorInfo(errorCodes.INVALID_TYPES_ERROR, req.body.product),
        message: "One or more fields have the wrong type",
        code: errorCodes.INVALID_TYPES_ERROR,
      });
    }

    const newProduct = await productService.addProduct(product)
    res.status(201).send({status:'success', message:'producto agregado', newProduct})
  } catch (error){
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status:'error', error: error})
  }
})

router.put('/:productId', auth, isVerified, isAdmin, async (req, res) => {
  const productId = req.params.productId;
  const product = req.body.product;
  try {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
      req.logger.warning(`${req.method} ${req.path} - One or more fields are missing`)
      CustomError.createError({
        name: "Product Error",
        cause: generateProductsErrorInfo(errorCodes.MISSING_DATA_ERROR, req.body.product),
        message: "One or more fields are missing",
        code: errorCodes.MISSING_DATA_ERROR,
      });
    }
    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.code !== 'number' || typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0 || typeof product.category !== 'string' || !Array.isArray(product.thumbnails)) {
      req.logger.warning(`${req.method} ${req.path} - One or more fields have the wrong type`)
      CustomError.createError({
        name: "Product Error",
        cause: generateProductsErrorInfo(errorCodes.INVALID_TYPES_ERROR, req.body.product),
        message: "One or more fields have the wrong type",
        code: errorCodes.INVALID_TYPES_ERROR,
      });
    }

    const updatedProduct = await productService.updateProduct(productId, updatedProduct);
    res.status(200).send({status:'success', message:'producto actualizado', product})
  } catch (error){
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete('/:productId', auth, isVerified, isAdmin, async (req, res) => {
  const productId = req.params.productId;
  
  try {
    const product = await productService.deleteProduct(productId);
    res.status(200).send({status:'success', message:'producto eliminado', product})
  } catch (error){
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status:'error', message: error.message})
  }
})

router.get('/mock/mockingproducts', (req, res) => {
  const quantity = req.query.quantity || 100;
  const products = generateProducts(quantity);
  res.status(200).send({status: 'success', message: 'productos generados', products})
})

export default router