import cartModel from "./models/cartsModel.js";

class cartDAO {  
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

  async getCartWithUserId(userId) {
    try {
      const cart = await cartModel.findOne({user: userId}).populate('products.product').populate('user').lean();
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

  async addProductToCart(cartiD, productId, quantity) {
    try {
      const existingProduct = await cartModel.findOne({_id: cartiD, "products.product": productId});
      if (existingProduct) {
        const updatedCart = cartModel.updateOne(
          {_id: cartiD, "products.product": productId},
          {$inc : {"products.$.quantity": quantity}}  
        );
        return updatedCart;
      } 
    
      const updatedCart = await cartModel.updateOne(
        {_id: cartiD},
        {$push: {products: [{product: productId, quantity: quantity}]}}  
      )
      return updatedCart;
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
      return cart;
    } catch (error) {
      throw error
    }
  }
  
  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartModel.findByIdAndUpdate(cartId, { products: []})
      return cart;
    } catch (error) {
      throw error
    }
  }
  
  async deleteCart(id) {
    try {
      const cart = await cartModel.deleteOne({_id: id})
      return cart;
    } catch (error) {
      throw error
    }
  }
}

export default new cartDAO();