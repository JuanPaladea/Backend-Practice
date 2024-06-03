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
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'usuario',
  },
  verified: {
    type: Boolean,
    default: false
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  }
})

usersSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(usersCollection, usersSchema)

export default userModel