import { Router } from "express";
import productService from "../services/productService.js";
import cartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";

const router = Router();

router.get('/', authRedirect, async (req, res) => {
  try {
    const limit = +req.query.limit || 8;
    const page = +req.query.page || 1;
    let { query = null, sort = null } = req.query;

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
      products: products.products,
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
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.get('/add', authRedirect, async (req, res) => {
  if (req.session.user.role !== 'admin' && req.session.user.role !== 'premium') {
    return res.status(403).send({status: 'error', message: 'no tiene permisos para agregar productos'})
  }
  
  try {
    res.render(
      "addProduct",
      {
        layout: "default",
        title: 'Backend Juan Paladea | Agregar producto'
      }
    )
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.get('/:pid', authRedirect, async (req, res) => {
  const productId = req.params.pid
  const userId = req.session.user._id
  
  try {
    const product = await productService.getProductById(productId)
    const cart = await cartService.getCartWithUserId(userId)

    res.render(
      "product",
      {
        layout: "default",
        title: 'Backend Juan Paladea | ' + product.title,
        product: product,
        userId: userId,
        cart: cart
      })
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

export default router