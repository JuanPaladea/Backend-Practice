import productModel from "../models/productsModel.js";

export default class ProductManagerDB {
  getProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return productModel.find().lean()
  }

  addProduct(productData) {
    if (!productData.title || !productData.description || !productData.price || !productData.status || !productData.code || !productData.stock) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    const codeExist = this.products.some((product) => product.code === productData.code);

    if (codeExist) {
      console.error(`Error: Producto con código ${productData.code} ya existe.`);
      return    
    }

    const product = {
      id: this.incrementId++,
      ...productData,
      thumbnails: productData.thumbnails ?? []
    };

    this.products.push(product);
    this.saveProducts();
  }


  getProductById(id) {
    const product = this.products.find((product) => product.id == id);

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
  
    const index = this.products.findIndex((product) => product.id === id);
  
    if (index === -1) {
      console.error(`Error: Producto con ID ${id} no encontrado.`);
      return;
    }

    if (updatedFields.code && this.products.some((product) => product.code === updatedFields.code)) {
      console.error(`Error: Producto con código ${updatedFields.code} ya existe.`);
      return
    }
      
    this.products[index] = { ...this.products[index], ...updatedFields };

    this.saveProducts();
    this.getProductById(id);
  }  

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return
    }
    this.products = this.products.filter((product) => product.id !== id);
    this.saveProducts();
  }
}