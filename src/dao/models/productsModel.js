import mongoose from "mongoose";

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
})

export const productModel = mongoose.model(productsCollection, productsSchema);