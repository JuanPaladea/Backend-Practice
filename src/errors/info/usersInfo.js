import { errorCodes } from "../enums.js";

export const generateUsersErrorInfo = (code, user) => {
  switch (code) {
    case errorCodes.MISSING_DATA_ERROR:
      return `One or more fields are missing. 
      List of required fields: 
      * email      : ${user.email ? user.email : 'missing'}
      * password   : ${user.password ? user.password : 'missing'}`;

    case errorCodes.INVALID_TYPES_ERROR:
      return `One or more fields have the wrong type. 
      List of required types: 
      * email      : Needs to be a String, received: ${user.email} || ${typeof user.email},
      * password   : Needs to be a String, received: ${user.password} || ${typeof user.password}`;

    case errorCodes.DATABASE_ERROR:
      return `There was an error with the database.`;

    case errorCodes.NOT_FOUND_ERROR:
      return `The user was not found`;

    default:
      return `An error occurred.`;
  }
}