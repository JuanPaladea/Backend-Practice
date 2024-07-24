import productService from "../services/productService.js";
import transport from "../utils/mailer.js";
import {generateProducts} from "../utils/faker.js";
import { EMAIL } from "../utils/config.js";

export const getProducts = async (req, res) => {
  const limit = +req.query.limit || 8;
  const page = +req.query.page || 1;
  let query = req.query.query || null;
  let sort = req.query.sort || null;
  
  if (typeof limit !== 'number' || typeof page !== 'number') {
    req.logger.warning(`${req.method} ${req.path} - limit and page must be numbers`)
    return res.status(400).send({status: 'error', message: 'limit and page must be numbers'})
  }
  if (limit < 1 || page < 1) {
    req.logger.warning(`${req.method} ${req.path} - limit and page must be greater than 0`)
    return res.status(400).send({status: 'error', message: 'limit and page must be greater than 0'})
  }
  
  try {
    if (query) {
      query = JSON.parse(query);
    }
    if (sort) {
      sort = JSON.parse(sort)
    }

    const products = await productService.getProducts(limit, page, query, sort);
    res.status(200).send({status: 'success', message: 'productos encontrados', products})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
}

export const getProduct = async (req, res) => {
  let productId = req.params.productId;

  try {
    const product = await productService.getProductById(productId);
    res.status(200).send({status: 'success', message: 'producto encontrado', product})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
}

export const addProduct = async (req, res) => {
  const product = {
    title: req.body.product.title,
    description: req.body.product.description,
    code: req.body.product.code,
    price: parseInt(req.body.product.price),
    stock: parseInt(req.body.product.stock),
    category: req.body.product.category,
    thumbnails: req.body.product.thumbnails,
  }
  
  try {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
      req.logger.warning(`${req.method} ${req.path} - One or more fields are missing`)
      return res.status(400).send({status: 'error', message: 'One or more fields are missing'})
    }

    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0 || typeof product.category !== 'string') {
      req.logger.warning(`${req.method} ${req.path} - One or more fields have the wrong type`)
      return res.status(400).send({status: 'error', message: 'One or more fields have the wrong type'})
    }

    const newProduct = await productService.addProduct({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails,
      owner: req.session.user._id
    })

    res.status(201).send({status:'success', message:'producto agregado', newProduct})
  } catch (error){
    req.logger.error(`${req.method} ${req.path} - ${error}`)
    res.status(400).send({status:'error', error: error})
  }
}

export const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const product = req.body.product;
  try {
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnails) {
      req.logger.warning(`${req.method} ${req.path} - One or more fields are missing`)
      return res.status(400).send({status: 'error', message: 'One or more fields are missing'})
    }

    if (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0 || typeof product.category !== 'string') {
      req.logger.warning(`${req.method} ${req.path} - One or more fields have the wrong type`)
      return res.status(400).send({status: 'error', message: 'One or more fields have the wrong type'})
    }

    if (req.session.user.role === 'admin') {
      const updatedProduct = await productService.updateProduct(productId, product);
      return res.status(200).send({status:'success', message:'producto actualizado', updatedProduct})
    }

    const productToUpdate = await productService.getProductById(productId);
    if (productToUpdate.owner.toString() !== req.session.user._id.toString()) {
      req.logger.warning(`${req.method} ${req.path} - no tiene permisos para actualizar este producto`)
      return res.status(403).send({status: 'error', message: 'no tiene permisos para actualizar este producto'})
    }
    
    const updatedProduct = await productService.updateProduct(productId, product);
    res.status(200).send({status:'success', message:'producto actualizado', updatedProduct})
  } catch (error){
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status:'error', message: error.message})
  }
}

export const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  
  try {
    const product = await productService.getProductById(productId)

    if (!product) {
      req.logger.warning(`${req.method} ${req.path} - producto no encontrado`)
      return res.status(404).send({status: 'error', message: 'producto no encontrado'})
    }

    if (req.session.user.role === 'admin') {
      await productService.deleteProduct(productId);
      if (product.owner.role === 'premium') {
        transport.sendMail({
          from: `BackEnd JP <${EMAIL}>`,
          to: product.owner.email,
          subject: 'Producto eliminado',
          html: 
          `
            <h1>Producto eliminado</h1>
            <p>El producto ${product.title} ha sido eliminado por un administrador</p>
          `
        })
      return res.status(200).send({status:'success', message:'producto eliminado'})
      }
    }

    if (product.owner.toString() !== req.session.user._id.toString()) {
      req.logger.warning(`${req.method} ${req.path} - no tiene permisos para eliminar este producto`)
      return res.status(403).send({status: 'error', message: 'no tiene permisos para eliminar este producto'})
    }

    await productService.deleteProduct(productId);
    if (product.owner.role === 'premium') {
      transport.sendMail({
        from: `BackEnd JP <${EMAIL}>`,
        to: product.owner.email,
        subject: 'Producto eliminado',
        html: 
        `
          <h1>Producto eliminado</h1>
          <p>El producto ${product.title} ha sido eliminado</p>
        `
      })
    }
    res.status(200).send({status:'success', message:'producto eliminado'})
  } catch (error){
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status:'error', message: error.message})
  }
}

export const getMockProducts = async (req, res) => {
  const quantity = req.query.quantity || 100;
  const products = generateProducts(quantity);
  res.status(200).send({status: 'success', message: 'productos generados', products})
}
