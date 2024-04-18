import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number
        }
      }
    ]
  }
})

cartsSchema.plugin(mongoosePaginate)

export const cartModel = mongoose.model(cartsCollection, cartsSchema);