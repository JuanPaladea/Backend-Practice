export default class productDTO {
  constructor({title, description, code, price, stock, category, thumbnails}) {
    this.title = title
    this.description = description
    this.code = code
    this.price = price
    this.stock = stock
    this.category = category
    this.thumbnails = thumbnails
  }
}