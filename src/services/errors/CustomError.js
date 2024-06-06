export default class CustomError extends Error {
  constructor(name, cause, message, code) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.code = code;
  }

  static createError({ name = "Error", cause, message = "An error occurred", code = 5 }) {
    throw new CustomError(name, cause, message, code);
  }
}