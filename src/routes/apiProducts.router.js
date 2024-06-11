import { Router } from "express";
import productService from "../services/productService.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";
import { generateProducts } from "../utils/faker.js";
import CustomError from "../services/errors/customError.js";
import { generateProductsErrorInfo } from "../services/errors/info/productsInfo.js";
import { errorCodes } from "../services/errors/enums.js";

const router = Router();

router.get('/', auth, isVerified, async (req, res) => {
  const limit = +req.query.limit || 8;
  const page = +req.query.page || 1;
  const { query = null, sort = null } = req.query;
  
  if (typeof limit !== 'number' || typeof page !== 'number') {
    return res.status(400).send({error: 'limit and page must be numbers'})
  }
  if (limit < 1 || page < 1) {
    return res.status(400).send({error: 'limit and page must be greater than 0'})
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
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.get('/:productId', auth, isVerified, async (req, res) => {
  let productId = req.params.productId;

  try {
    const product = await productService.getProductById(productId);
    res.status(200).send({status: 'success', message: 'producto encontrado', product})
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.post('/', auth, isVerified, isAdmin, async (req, res) => {
  const product = req.body.product;
  
  try {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
      CustomError.createError({
        name: "Product Error",
        cause: generateProductsErrorInfo(errorCodes.MISSING_DATA_ERROR, req.body.product),
        message: "One or more fields are missing",
        code: errorCodes.MISSING_DATA_ERROR,
      });
    }
    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.code !== 'number' || typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0 || typeof product.category !== 'string' || !Array.isArray(product.thumbnails)) {
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
    console.error(error?.cause)
    res.status(400).send({status:'error', message: error.message})
  }
})

router.put('/:productId', auth, isVerified, isAdmin, async (req, res) => {
  const productId = req.params.productId;
  const product = req.body.product;
  try {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
      CustomError.createError({
        name: "Product Error",
        cause: generateProductsErrorInfo(errorCodes.MISSING_DATA_ERROR, req.body.product),
        message: "One or more fields are missing",
        code: errorCodes.MISSING_DATA_ERROR,
      });
    }
    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.code !== 'number' || typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0 || typeof product.category !== 'string' || !Array.isArray(product.thumbnails)) {
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
    res.status(400).send({status:'error', message: error.message})
  }
})

router.delete('/:productId', auth, isVerified, isAdmin, async (req, res) => {
  const productId = req.params.productId;
  
  try {
    const product = await productService.deleteProduct(productId);
    res.status(200).send({status:'success', message:'producto eliminado', product})
  } catch (error){
    res.status(400).send({status:'error', message: error.message})
  }
})

router.get('/mock/mockingproducts', (req, res) => {
  const quantity = req.query.quantity || 100;
  const products = generateProducts(quantity);
  res.status(200).send({status: 'success', message: 'productos generados', products})
})

export default router