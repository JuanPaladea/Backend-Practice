import {userModel} from "../models/usersModel.js";

export default class userManagerDB {
  async registerUser(user) {
    try {
      const result = await userModel.create(user)
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async findUserEmail(email) {
    try {
      const result = await userModel.findOne({email: email})
      return result
    } catch (error) {
      console.error(error)
    }
  } 
}

