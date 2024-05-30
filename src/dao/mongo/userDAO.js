import { isValidPassword } from "../../utils/bcrypt.js";
import userModel from "./models/usersModel.js";

export default class userDAO {
  async getUsers() {
    try {
      const users = await userModel.find({}).populate('cart').populate('cart.products.product')
      return users
    } catch (error) {
      throw error
    }
  }

  async getUserById(userId) {
    try {
      const user = await userModel.findById(userId).populate('cart').populate('cart.products.product')
      return user
    } catch (error) {
      throw error
    }
  }

  async registerUser(user) {
    try {
      if (user.email == "adminCoder@coder.com" && isValidPassword(user, 'adminCod3r123')) {
        const newUser = await userModel.create(user)
        newUser.role = "admin"
        newUser.save()
        return newUser
      }
      const newUser = await userModel.create(user)
      return newUser
    } catch (error) {
      throw error
    }
  }

  async updateUser(userId, cartId) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {cart: cartId})
      return user
    } catch (error) {
      throw error
    }
  } 

  async findUserEmail(email) {
    try {
      const user = await userModel.findOne({email: email})
      return user
    } catch (error) {
      throw error
    }
  } 
}
