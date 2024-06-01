import messageDAO from "../dao/mongo/messageDAO.js";
import messageDTO from "../dao/dto/messageDTO.js";

class messageService {
  async getMessages() {
    try {
      const messages = await messageDAO.getMessages().sort({ date: -1 }).lean();
      if (!messages) {
        throw new Error("No messages found");
      }
      return messages.map((message) => new messageDTO(message));
    } catch (error) {
      throw error;
    }
  }

  async addMessage(messageData) {
    try {
      const message = await messageDAO.addMessage(messageData);
      if (!message) {
        throw new Error("Error adding message");
      }
      return new messageDTO(message);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      const message = await messageDAO.deleteMessage(id);
      if (!message) {
        throw new Error("Message not found");
      }
      return new messageDTO(message);
    } catch (error) {
      throw error;
    }
  }
}

export default new messageService();