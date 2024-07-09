import * as chai from 'chai';
import mongoose from "mongoose";
import { MONGODB_URI } from "../src/utils/config.js";
const expect = chai.expect;

import productService from "../src/services/productService.js";

describe("productService", () => {
  before(async () => {
    await mongoose.connect(MONGODB_URI)
  });
  describe("getProducts", () => {
    it("should return an array of products", async () => {
      const products = await productService.getProducts(10, 1, null, null);
      expect(products.products).to.be.an('array');
    });
  });
});