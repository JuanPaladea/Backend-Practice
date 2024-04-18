import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const usersCollection = 'users'

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  age: {
    type: Number
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: 'usuario'
  }
})

usersSchema.plugin(mongoosePaginate)

export const userModel = mongoose.model(usersCollection, usersSchema)