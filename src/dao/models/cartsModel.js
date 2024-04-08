import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
  products: {
    product: {
      type: String
    },
    quantity: {
      type: String
    }
  }
})

export const cartModel = mongoose.model(cartsCollection, cartsSchema);