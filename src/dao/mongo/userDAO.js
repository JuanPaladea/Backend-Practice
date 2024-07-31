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

  async findUserEmail(email) {
    try {
      const user = await userModel.findOne({email: email})
      return user
    } catch (error) {
      throw error
    }
  } 

  async updateLastConnection(userId) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {lastConnection: Date.now()}, {new: true})
      return user
    } catch (error) {
      throw error
    }
  }

  async uploadDocuments(userId, documents) {
    try {
      const user = await userModel.findByIdAndUpdate(userId, {documents: documents}, {new: true})
      return user
    } catch (error) {
      throw error
    }
  }

  async getUnactiveUsers() {
    try {
      const users = await userModel.find({lastConnection: {$lt: Date.now() - 172800000}})
      return users
    } catch (error) {
      throw error
    }
  }

  async deleteUnactiveUsers() {
    try {
      const users = await userModel.deleteMany({lastConnection: {$lt: Date.now() - 172800000}, role: {$ne: "admin"}})
      return users
    } catch (error) {
      throw error
    }
  } 

  async deleteUser(userId) {
    try {
      const user = await userModel.findByIdAndDelete(userId)
      return user
    } catch (error) {
      throw error
    }
  }
}

export default new userDAO();