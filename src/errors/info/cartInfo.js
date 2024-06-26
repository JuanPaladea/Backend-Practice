import { errorCodes } from "../enums.js"

export const generateCartErrorInfo = (code, cart) => {
  switch (code) {
    case errorCodes.MISSING_DATA_ERROR:
      return `One or more fields are missing. 
      List of required fields: 
      * userId      : ${cart.userId ? cart.userId : 'missing'}
      * products    : ${cart.products ? cart.products : 'missing'}`;

    case errorCodes.INVALID_TYPES_ERROR:
      return `One or more fields have the wrong type. 
      List of required types: 
      * userId      : Needs to be a String, received: ${cart.userId} || ${typeof cart.userId},
      * products    : Needs to be an Array, received: ${cart.products} || ${typeof cart.products}`;

    case errorCodes.DATABASE_ERROR:
      return `There was an error with the database.`;

    case errorCodes.NOT_FOUND_ERROR:
      return `The cart was not found`;

    default:
      return `An error occurred.`;
  }
}