export default class productDTO {
  constructor(product) {
    this.name = product.name;
    this.price = product.price;
    this.description = product.description;
    this.stock = product.stock;
    this.image = product.image;
  }
}