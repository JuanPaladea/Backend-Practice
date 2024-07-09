import * as chai from 'chai';

import productService from '../src/services/productService.js';
const expect = chai.expect;

describe('ApiProducts', () => {
  describe('GET /products', () => {
    it('should return a list of products', async () => {
      let products = await productService.getProducts();
      expect(products).to.be.an('array');
    });
  })
});