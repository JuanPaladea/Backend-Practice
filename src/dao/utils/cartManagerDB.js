import {cartModel} from "../models/cartsModel.js";

export default class CartManagerDB {  
  
  async addCart() {
    try {
      const cart = await cartModel.create({})
      return cart
    } catch (error) {
      console.error(error)
    }
  }

  async getCart(id) {
    try {
      const cart = await cartModel.findById(id);
      if (!cart) {
        console.error('Carrito no encontrado')
        return
      }
      return cart;
    } catch (error) {
      console.error(error)
    }
  }

  // NO FUNCIONA
  async updateCart(cartId, products) {
    console.log(products)
    try {
      return await cartModel.findByIdAndUpdate(cartId, {$set: {products: products}})
    } catch (error) {
      console.error(error)
    }
  }

  // NO FUNCIONA
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return cartModel.updateOne(
        {"_id": cartId, products: {product: productId}},
        {$set: { products : {quantity: quantity} }}
      )
    } catch (error) {
      console.error(error)
    }
  }

  async addProductToCart(cartid, productId, quantity = 1) {
    try {
      const cart = await cartModel.findOne({_id: cartid});
      if (!cart) {
        return console.error(error)
      }

      const existingProduct = await cartModel.findOne({"products.product": productId})
      if (existingProduct) {
        await cartModel.updateOne(
          {"products.product": productId},
          {$inc : {"products.$.quantity": 1}}  
        )
      } else {
        await cartModel.updateOne(
          {_id: cartid},
          {$push: {products: [{product: productId, quantity: quantity}]}}  
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  async deleteCart(id) {
    try {
      return await cartModel.deleteOne({_id: id})
    } catch (error) {
      console.error(error)
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      await cartModel.findByIdAndUpdate(cartId, { products: []})
    } catch (error) {
      console.error(error)
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await cartModel.findOneAndUpdate(
        {_id: cartId},
        { $pull: { products: {product: productId}}},
      )
    } catch (error) {
      console.error(error)
    }
  }
}