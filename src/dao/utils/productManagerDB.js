import productModel from "../models/productsModel.js";

export default class ProductManagerDB {
  async getProducts(limit) {
    try {
      if (limit) {
        return await productModel.find().lean().limit(limit)
      }
      return await productModel.find().lean()
    } catch (error) {
      console.error(error)
    }
  }

  async addProduct(productData) {
    try {
      if (!productData.title || !productData.description || !productData.price || !productData.code || !productData.stock) {
        console.error("Error: Todos los campos son obligatorios.");
        return;
      }
      
      const codeExist = await productModel.find({code: productData.code});
      if (codeExist > 0) {
        console.error(`Error: Producto con código ${productData.code} ya existe.`);
        return    
      }
      return await productModel.create({
        ...productData,
        thumbnails: productData.thumbnails ?? []
      })
    } catch (error) {
      console.error(error)
    }
  }

  async getProductById(id) {
    try {
      const product = await productModel.find({_id: id});
  
      if (!product) {
        console.error(`Error: Producto con id ${id} no encontrado.`);
        return;
      }
  
      return product;
    } catch (error) {
      console.error(error)
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      if (!id || !updatedFields) {
        console.error("Error: Todos los campos son obligatorios.");
        return;
      }
    
      const product = await productModel.find({_id: id});
    
      if (!product) {
        console.error(`Error: Producto con ID ${id} no encontrado.`);
        return;
      }
  
      if (updatedFields.code && productModel.find({code: updatedFields.code})) {
        console.error(`Error: Producto con código ${updatedFields.code} ya existe.`);
        return
      }
      
      await productModel.findOneAndUpdate({_id: id}, updatedFields)
    } catch (error) {
      console.error(error)
    }
  }  

  async deleteProduct(id) {
    try {
      const product = await productModel.find({_id: id});
  
      if (!product) {
        console.error(`Error: Producto con id ${id} no encontrado.`);
        return;
      }
  
      await productModel.deleteOne({_id: id})
    } catch (error) {
      console.error(error)
    }
  }
}