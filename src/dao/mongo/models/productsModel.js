import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
    type: Array,
    default: []
  }
})

productsSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;