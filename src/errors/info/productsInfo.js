import { errorCodes } from "../enums.js"

export const generateProductsErrorInfo = (code, product) => {
  switch (code) {
    case errorCodes.MISSING_DATA_ERROR:
      return `One or more fields are missing. 
      List of required fields: 
      * title       : ${product.title ? product.title : 'missing'}
      * description : ${product.description ? product.description : 'missing'}
      * code        : ${product.code ? product.code : 'missing'}
      * price       : ${product.price ? product.price : 'missing'}
      * stock       : ${product.stock ? product.stock : 'missing'}
      * category    : ${product.category ? product.category : 'missing'}
      * thumbnails  : ${product.thumbnails ? product.thumbnails : 'missing'}`;

    case errorCodes.INVALID_TYPES_ERROR:
      return `One or more fields have the wrong type. 
      List of required types: 
      * title       : Needs to be a String, received: ${product.title} || ${typeof product.title},
      * description : Needs to be a String, received: ${product.description} || ${typeof product.description},
      * code        : Needs to be a Number, received: ${product.code} || ${typeof product.code},
      * price       : Needs to be a Number greater than 0 , received: ${product.price} || ${typeof product.price},
      * stock       : Needs to be a Number, greater than or equal to 0 received: ${product.stock} || ${typeof product.stock},
      * category    : Needs to be a String, received: ${product.category} || ${typeof product.category},
      * thumbnails  : Needs to be an Array, received: ${product.thumbnails} || ${typeof product.thumbnails}`;
    
    case errorCodes.DATABASE_ERROR:
      return `There was an error with the database.`;
    
    case errorCodes.NOT_FOUND_ERROR:
      return `The product was not found`;

    default:
      return `An error occurred.`;
  }
}