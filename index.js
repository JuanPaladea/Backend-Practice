const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
    this.incrementId = this.calculateIncrementId();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  calculateIncrementId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  addProduct(productData) {
    if (!productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    const codeExist = this.products.some((product) => product.code === productData.code);

    if (codeExist) {
      throw new Error(`Error: Producto con código ${productData.code} ya existe.`);
    }

    const product = {
      id: this.incrementId++,
      ...productData,
    };

    console.log(`Añadiendo producto...`)
    this.products.push(product);
    this.saveProducts();
    console.log(`${product.title} agregado.`)
  }

  getProducts() {
    console.log(`Buscando productos...`)
    console.log(this.products);
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return;
    }
    console.log(`Buscando producto con id ${id}...`)
    console.log(product);
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
  
    console.log(`Actualizando producto con ID ${id}`);
    
    this.products[index] = { ...this.products[index], ...updatedFields };

    this.saveProducts();
    console.log(`Producto con ID ${id} actualizado...`);
    this.getProductById(id);
  }  

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      console.error(`Error: Producto con id ${id} no encontrado.`);
      return
    }
    console.log(`Eliminando producto con id ${id}...`)
    this.products = this.products.filter((product) => product.id !== id);
    this.saveProducts();
    console.log(`Producto ${id} eliminado.`)
  }
}

const productManager = new ProductManager('products.json')

productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc1234',
  stock: 25,
})
productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc12345',
  stock: 25,
})
productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123456',
  stock: 25,
})
productManager.getProducts();
productManager.getProductById(3);
productManager.deleteProduct(2);
productManager.updateProduct(1, {title: 'Producto modificado', propiedadNueva: 'propiedadNueva'});
productManager.getProducts();