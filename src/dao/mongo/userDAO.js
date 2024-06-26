import { isValidPassword } from "../../utils/bcrypt.js";
import userModel from "./models/usersModel.js";

class userDAO {
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
      if (user.email == "adminCoder@coder.com" && isValidPassword(user, ' ')) {
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
      const user = await userModel.findByIdAndUpdate(userId, {cart: cartId}, {new: true})
      return user
    } catch (error) {
      throw error
    }
  } 

  async updatePassword(userId, password) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {password: password}, {new: true})
      return user
    } catch (error) {
      throw error
    }
  }

  async updateRole(userId, role) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {role: role}, {new: true})
      return user
    } catch (error) {
      throw error
    }
  }

  async verifyUser(userId) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {verified: true}, {new: true})
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

export default new userDAO();