import mongoose from "mongoose";

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
  title: {
    type: String
  }, 
  description: {
    type: String
  },
  code: {
    type: String
  },
  price: {
    type: Number
  },
  status: {
    type: String,
    require: true,
    default: true
  },
  stock : {
    type: Number,
  },
  category: {
    type: String
  },
  thumbnails: {
    type: String,
    default: []
  }
})

const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;