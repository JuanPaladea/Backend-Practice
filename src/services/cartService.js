import cartDAO from '../dao/mongo/cartDAO.js';
import cartDTO from '../dao/dto/cartDTO.js';

class cartService {
  async addCart(userId) {
    try {
      const cart = await cartDAO.getCartWithUserId(userId);
      if (cart) {
        throw new Error('Cart already exists for this user');
      }
      const newCart = await cartDAO.addCart(userId);
      if (newCart) {
        throw new Error('Error creating cart');
      }
      return newCart
    } catch (error) {
      throw error;
    }
  }

  async getCart(id) {
    try {
      const cart = await cartDAO.getCart(id);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  async getCartWithUserId(userId) {
    try {
      const cart = await cartDAO.getCartWithUserId(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const carts = await cartDAO.getAllCarts();
      if (!carts) {
        throw new Error('No carts found');
      }
      return carts.map((cart) => new cartDTO(cart));
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
      if (!cart) {
        throw new Error('Error updating product quantity');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await cartDAO.addProductToCart(cartId, productId, quantity);
      if (!cart) {
        throw new Error('Error adding product to cart');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = cartDAO.deleteProductFromCart(cartId, productId);
      if (!cart) {
        throw new Error('Error deleting product from cart');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }
  
  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = cartDAO.deleteAllProductsFromCart(cartId);
      if (!cart) {
        throw new Error('Error deleting products from cart');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }
  
  async deleteCart(id) {
    try {
      const cart = await cartDAO.deleteCart(id);
      if (!cart) {
        throw new Error('Error deleting cart');
      }
      return new cartDTO(cart);
    } catch (error) {
      throw error;
    }
  }
}

export default new cartService();