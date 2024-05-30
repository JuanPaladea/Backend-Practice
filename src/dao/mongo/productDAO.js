import productModel from "./models/productsModel.js";

class productDAO {
  async getProducts(limit, page, query, sort) {
    try {
      const products = await productModel.paginate(query, {limit, page, sort, lean: true})
      return products;
    } catch (error) {
      throw error
    }
  }

  async addProduct(productData) {
    try {
      const codeExist = await productModel.findOne({code: productData.code});
      if (codeExist) {
        throw new Error(`Error: Producto con código ${productData.code} ya existe.`);
      }

      const product = await productModel.create({
        ...productData,
      })
      return product;
    } catch (error) {
      throw error
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.findOne({_id: id}).lean();
      return product;
    } catch (error) {
      throw error
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const product = await productModel.findOneAndUpdate({id, updatedFields}, {new: true});
      return product;
    } catch (error) {
      throw error
    }
  }  

  async deleteProduct(id) {
    try {
      const product = await productModel.findOneAndDelete({id});
      return product;
    } catch (error) {
      throw error
    }
  }
}

export default new productDAO();