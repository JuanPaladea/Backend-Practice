import { Router } from "express";
import productService from "../services/productService.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const limit = +req.query.limit || 10;
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

    const products = await productService.getProducts(limit, page, query, sort);
    res.render(
      "products",
      {
      layout: "default",
      status: 'success',
      title: 'Backend Juan Paladea | Productos',
      user: req.session.user,
      products: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevPage ? `/products?${query ? `query=${encodeURIComponent(JSON.stringify(query))}` : ''}${limit ? `&limit=${limit}` : ''}${sort ? `&sort=${encodeURIComponent(JSON.stringify(sort))}` : ''}&page=${products.prevPage}` : null,
      nextLink: products.nextPage ? `/products?${query ? `query=${encodeURIComponent(JSON.stringify(query))}` : ''}${limit ? `&limit=${limit}` : ''}${sort ? `&sort=${encodeURIComponent(JSON.stringify(sort))}` : ''}&page=${products.nextPage}` : null,
      limit, 
      page,
      query,
      sort
    })
  } catch (error) {
    res.status(400).send({status: 'error', error: 'ha ocurrido un error', error})
  }
})

router.get('/add', auth, isAdmin, async (req, res) => {
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
    res.status(400).send({status: 'error', error: 'ha ocurrido un error', error})
  }
})

router.get('/:pid', auth, async (req, res) => {
  const productId = req.params.pid
  try {
    const product = await productService.getProductById(productId)
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

router.post('/add', auth, isAdmin, async (req, res) => {
  const price = +req.body.product.price;
  const stock = +req.body.product.stock;
  const { title, description, code, category, thumbnails } = req.body.product;

  if (!title || !description || !code || !price || !stock || !category || thumbnails) {
    return res.status(400).send({status:'error', error:'faltan datos'})
  }
  if (typeof price !== 'number' || typeof stock !== 'number') {
    return res.status(400).send({status:'error', error:'price y stock deben ser números'})
  }
  if (price < 0 || stock < 0) {
    return res.status(400).send({status:'error', error:'price y stock deben ser mayores a 0'})
  }
  try {
    const product = await productService.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    })
    res.status(201).send({status:'success', message:'producto agregado', product})
  } catch (error){
    res.status(400).send({status:'error', error:'ha ocurrido un error', error})
  }
})

export default router