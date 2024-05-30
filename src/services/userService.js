import userDAO from "../dao/mongo/userDAO.js";
import userDTO from "../dao/dto/userDTO.js";

export default class userService {
  async getUsers() {
    try {
      const users = await userDAO.getUsers();
      if (!users) {
        throw new Error("No users found");
      }
      return new userDTO(users);
    } catch (error) {
      throw error;
    }
  }

  async registerUser(user) {
    try {
      const newUser = await userDAO.registerUser(user);
      if (!newUser) {
        throw new Error("Error registering user");
      }
      return new userDTO(newUser);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, cartId) {
    try {
      const user = await userDAO.updateUser(userId, cartId);
      if (!user) {
        throw new Error("Error updating user");
      }
      return new userDTO(user);
    } catch (error) {
      throw error;
    }
  }

  async findUserEmail(email) {
    try {
      const user = await userDAO.findUserEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      return new userDTO(user);
    } catch (error) {
      throw error;
    }
  }
}