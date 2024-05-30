export default class userDTO {
  constructor(user) {
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
  }
}