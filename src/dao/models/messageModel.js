import mongoose from "mongoose";

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
  user: {
    type: String
  },
  message: {
    type: String
  }
})

const messageModel = mongoose.model(messagesCollection, messagesSchema);

export default messageModel