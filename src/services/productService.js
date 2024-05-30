import productDAO from "../dao/mongo/productDAO.js";
import productDTO from "../dao/dto/productDTO.js";

class productService {
  async getProducts(limit, page, query, sort) {
    try {
      const products = await productDAO.getProducts(limit, page, query, sort);
      if (!products) {
        throw new Error("No products found");
      }
      return products
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await productDAO.getProductById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return new productDTO(product);
    } catch (error) {
      throw error;
    }
  }

  async addProduct(productData) {
    try {
      const product = await productDAO.addProduct(productData);
      if (!product) {
        throw new Error("Error adding product");
      }
      return new productDTO(product);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const product = await productDAO.updateProduct(id, updatedFields);
      if (!product) {
        throw new Error("Error updating product");
      }
      return new productDTO(product);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productDAO.deleteProduct(id);
      if (!product) {
        throw new Error("Error deleting product");
      }
      return new productDTO(product);
    } catch (error) {
      throw error;
    }
  }
}

export default new productService();