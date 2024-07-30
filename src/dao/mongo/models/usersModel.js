import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const usersCollection = 'users'

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'usuario',
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  },
  documents: {
    type: [
      {
        name: {
          type: String
        },
        reference: {
          type: String
        }
      }
    ]
  },
  lastConnection: {
    type: Date,
  }
})

usersSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(usersCollection, usersSchema)

export default userModel