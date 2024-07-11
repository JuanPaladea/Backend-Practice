import supertest from "supertest";
import * as chai from 'chai';
import { generateProduct } from "../src/utils/faker.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("apiProducts", () => {
  let token
  let newProduct;

  before(async () => {
    const response = await requester.post("/api/session/login").send({
      email: "adminCoder@coder.com",
      password: "adminCod3r123"
    });
    token = response.body.token;

    expect(response.body.token).to.be.a('string');
  });

  describe("GET /api/products", () => {
    it("should return an array of products", async () => {
      const response = await requester.get("/api/products").set('Authorization', `Bearer ${token}`);
      expect(response.body.status).to.equal('success');
      expect(response.body.products.products).to.be.an('array').that.is.not.empty;
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a product by id", async () => {
      const response = await requester.get("/api/products/6617ed15f8782713d833e62c").set('Authorization', `Bearer ${token}`);
      expect(response.body.status).to.equal('success');
      expect(response.body.product).to.be.an('object').that.has.all.keys('_id', 'title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails');
    });
  })

  describe("POST /api/products", () => {
    let product = generateProduct();

    it("should add a new product", async () => {
      const response = await requester.post("/api/products").set('Authorization', `Bearer ${token}`).send({product});
      
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto agregado');
      expect(response.body.newProduct).to.be.an('object');
    });
  })

  describe("PUT /api/products/:id and DELETE /api/products/:id", () => {
    let product = generateProduct();

    before(async () => {
      const response = await requester.post("/api/products").set('Authorization', `Bearer ${token}`).send({product});
      newProduct = response.body.newProduct;
    });

    it("should update a product by id", async () => {
      const response = await requester.put(`/api/products/${newProduct._id.toString()}`).set('Authorization', `Bearer ${token}`).send({product});
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto actualizado');
      expect(response.body.updatedProduct).to.be.an('object');
    });

    it("should delete a product by id", async () => {
      const response = await requester.delete(`/api/products/${newProduct._id.toString()}`).set('Authorization', `Bearer ${token}`);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto eliminado');
    });
  });
});
