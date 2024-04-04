import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
})

export const cartModel = mongoose.model(cartsCollection, cartsSchema);