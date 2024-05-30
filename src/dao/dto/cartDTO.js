export default class cartsDTO {
  constructor(cart) {
    this._id = cart._id
    this.user = cart.user || null;
    this.products = cart.products || [];
  }
}