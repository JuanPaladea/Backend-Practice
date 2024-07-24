import userDAO from "../dao/mongo/userDAO.js";
import userDTO from "../dao/dto/userDTO.js";

class userService {
  async getUsers() {
    try {
      const users = await userDAO.getUsers();
      if (!users) {
        throw new Error("No users found");
      }
      return users.map((user) => new userDTO(user));
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await userDAO.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
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
      return newUser;
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
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(userId, password) {
    try {
      const user = await userDAO.updatePassword(userId, password);
      if (!user) {
        throw new Error("Error updating password");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(userId, role) {
    try {
      const user = await userDAO.updateRole(userId, role);
      if (!user) {
        throw new Error("Error updating role");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserEmail(email) {
    try {
      const user = await userDAO.findUserEmail(email);
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateLastConnection(userId) {
    try {
      const user = await userDAO.updateLastConnection(userId);
      if (!user) {
        throw new Error("Error updating last connection");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async uploadDocuments(userId, documents) {
    try {
      const user = await userDAO.uploadDocuments(userId, documents);
      if (!user) {
        throw new Error("Error uploading documents");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUnactiveUsers() {
    try {
      const users = await userDAO.getUnactiveUsers();
      if (!users) {
        throw new Error("No unactive users found");
      }
      return users.map((user) => new userDTO(user));
    } catch (error) {
      throw error;
    }
  }

  async deleteUnactiveUsers() {
    try {
      const result = await userDAO.deleteUnactiveUsers();
      if (!result) {
        throw new Error("No unactive users found");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const result = await userDAO.deleteUser(userId);
      if (!result) {
        throw new Error("Error deleting user");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new userService();