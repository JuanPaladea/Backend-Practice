import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const usersCollection = 'users'

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'usuario',
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  }
})

usersSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(usersCollection, usersSchema)

export default userModel