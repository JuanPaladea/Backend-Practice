export default class messageDTO {
  constructor(message) {
    this._id = message._id
    this.email = message.email
    this.firstName = message.firstName
    this.lastName = message.lastName
    this.message = message.message
    this.date = message.date
  }
}