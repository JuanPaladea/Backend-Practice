import productModel from "../models/productsModel.js";

export default class ProductManagerDB {
  getProducts(limit) {
    if (limit) {
      return productModel.find().lean().limit(limit)
    }
    return productModel.find().lean()
  }

  addProduct(productData) {
    if (!productData.title || !productData.description || !productData.price || !productData.status || !productData.code || !productData.stock) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    const codeExist = productModel.find({code: productData.code});
    if (codeExist) {
      console.error(`Error: Producto con código ${productData.code} ya existe.`);
      return    
    }

    return productModel.create({
      ...productData,
      thumbnails: productData.thumbnails ?? []
    })
  }


  getProductById(id) {
    const product = productModel.find({_id: id});

    if (!product) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return;
    }

    return product;
  }

  updateProduct(id, updatedFields) {
    if (!id || !updatedFields) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }
  
    const product = productModel.find({_id: id});
  
    if (!product) {
      console.error(`Error: Producto con ID ${id} no encontrado.`);
      return;
    }

    if (updatedFields.code && productModel.find({code: updatedFields.code})) {
      console.error(`Error: Producto con código ${updatedFields.code} ya existe.`);
      return
    }
    
    productModel.findOneAndUpdate({_id: id}, updatedFields)
    
  }  

  deleteProduct(id) {
    const product = productModel.find({_id: id});

    if (!product) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return;
    }

    productModel.deleteOne({_id: id})
  }
}