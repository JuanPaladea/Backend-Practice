import messageModel from "./models/messageModel.js";

class messageDAO {
  async getMessages() {
    try {
      const messages = await messageModel.find({}).sort({ date: -1 }).lean();
      return messages;
    } catch (error) {
      throw error
    }
  }

  async addMessage(messageData) {
    try {
      const message = await messageModel.create({
        ...messageData,
      })
      return message;
    } catch (error) {
      throw error
    }
  }

  async deleteMessage(id) {
    try {
      const message = await messageModel.findOneAndDelete({id});
      return message;
    } catch (error) {
      throw error
    }
  }
}

export default new messageDAO();