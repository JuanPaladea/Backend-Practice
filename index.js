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
      // If the file doesn't exist or there is an error, return an empty array
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

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Error: Todos los campos son obligatorios.");
      return;
    }

    const product = {
      id: this.incrementId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    this.saveProducts();
  }

  getProducts() {
    console.log(this.products);
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("Error: Producto no encontrado.");
      return;
    }

    console.log(product);
    return product;
  }

  updateProduct(id, title, description, price, thumbnail, code, stock) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error("Error: Producto no encontrado.");
      return;
    }

    this.products[index] = { ...this.products[index], title, description, price, thumbnail, code, stock };
    this.saveProducts();
  }

  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    this.saveProducts();
  }
}

const productManager = new ProductManager('products.json')

productManager.getProducts();
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.getProducts();
productManager.getProductById(2);
productManager.deleteProduct(3);
productManager.getProducts();
productManager.addProduct('producto prueba', 'este es un producto de prueba', 200, 'sin imagen', 'abc123', 25);
productManager.getProducts();
productManager.updateProduct(4, 'Nuevo título', 'Nueva descripción', 300, 'nueva imagen', 'xyz789', 50);
productManager.deleteProduct(5);
productManager.getProducts();