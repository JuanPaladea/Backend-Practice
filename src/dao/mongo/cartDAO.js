import cartModel from "./models/cartsModel.js";

export default class cartDAO {  
  async addCart(userId) {
    try {
      const cartExist = await cartModel.findOne({user: userId})
      if (cartExist) {
        return cartExist;
      } 
      const cart = await cartModel.create({user: userId})
      return cart;
    } catch (error) {
      throw error
    }
  }

  async getCart(id) {
    try {
      const cart = await cartModel.findById(id).populate('products.product').populate('user').lean();
      return cart;
    } catch (error) {
      throw error
    }
  }

  async getAllCarts() {
    try {
      const carts = await cartModel.find().populate('products.product').populate('user').lean();
      return carts;
    } catch (error) {
      throw error
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = cartModel.findByIdAndUpdate(cartId, {products: products})
      return cart;
    } catch (error) {
      throw error
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = cartModel.updateOne(
        {"_id": cartId, "products.product": productId},
        {$set: {"products.$.quantity": quantity}}
      )
      return cart;
    } catch (error) {
      throw error
    }
  }

  async addProductToCart(cartid, productId, quantity = 1) {
    try {
      const cart = await cartModel.findOne({_id: cartid});
      if (!cart) {
        throw new Error('Cart does not exist')
      }

      const existingProduct = await cartModel.findOne({"products.product": productId})

      if (existingProduct) {
        const updatedCart = cartModel.updateOne(
          {"products.product": productId},
          {$inc : {"products.$.quantity": 1}}  
        )
        return updatedCart;
      } 
    
      const updatedCart = await cartModel.updateOne(
        {_id: cartid},
        {$push: {products: [{product: productId, quantity: quantity}]}}  
      )
      return updatedCart;
    } catch (error) {
      throw error
    }
  }

  async deleteCart(id) {
    try {
      const cart = await cartModel.deleteOne({_id: id})
      if (!cart) {
        throw new Error('Cart does not exist')
      }

      return cart;
    } catch (error) {
      throw error
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartModel.findByIdAndUpdate(cartId, { products: []})
      if (!cart) {
        throw new Error('Cart does not exist')
      }

      return cart;
    } catch (error) {
      throw error
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        {_id: cartId},
        { $pull: { products: {product: productId}}},
      )
      if (!cart) {
        throw new Error('Cart does not exist')
      }
      return cart;
    } catch (error) {
      throw error
    }
  }
}