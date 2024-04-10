import {cartModel} from "../models/cartsModel.js";

export default class CartManagerDB {  
  
  async addCart() {
    try {
      await cartModel.create({})
    } catch (error) {
      console.error(error)
    }
  }

  async getCart(id) {
    try {
      const cart = await cartModel.findOne({_id: id});
      if (!cart) {
        console.error('Carrito no encontrado')
        return
      }
      return cart;
    } catch (error) {
      console.error(error)
    }
  }

  async updateCart(cartId, products) {
    try {
      await cartModel.findByIdAndUpdate(cartId, { products: products})
    } catch (error) {
      console.error(error)
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      cartModel.updateOne(
        {"_id": cartId, "products._id": productId},
        {$inc: {"products.$.quantity": quantity}}
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
          {$inc : {"products.$.quantity": quantity++}}  
        )
      } else {
        await cartModel.updateOne(
          {_id: cartid},
          {products: [{product: productId, quantity: quantity}]}  
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  async deleteCart(id) {
    try {
      const cart = await cartModel.deleteOne({_id: id})
      if (!cart) {
        console.error('Carrito no encontrado')
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      await cartModel.findByIdAndUpdate(cartId, { products : []})
    } catch (error) {
      console.error(error)
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      await cartModel.findOneAndUpdate(
        {_id: cartId},
        { $pull: {products: productId}},
      )
    } catch (error) {
      console.error(error)
    }
  }
}