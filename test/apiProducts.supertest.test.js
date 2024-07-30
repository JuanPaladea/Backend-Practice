import supertest from "supertest";
import * as chai from 'chai';
import { generateProduct } from "../src/utils/faker.js";

const expect = chai.expect;
const requester = supertest("http://localhost:10000");

describe("apiProducts", () => {
  let token
  let newProduct;

  before(async () => {
    const response = await requester.post("/api/session/login").send({
      email: "adminCoder@coder.com",
      password: "adminCod3r123"
    });
    token = response.body.token;

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('User logged in');
    expect(response.body.token).to.be.a('string');
  });

  describe("GET /api/products", () => {
    it("should return an array of products", async () => {
      const response = await requester.get("/api/products").set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('productos encontrados');
      expect(response.body.products.products).to.be.an('array').that.is.not.empty;
    });
  });

  describe("POST /api/products", () => {
    let product = generateProduct();

    it("should add a new product", async () => {
      const response = await requester.post("/api/products").set('Authorization', `Bearer ${token}`).send({
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails
      });
      
      newProduct = response.body.newProduct;

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto agregado');
      expect(response.body.newProduct).to.be.an('object');
    });
  })

  describe("GET /api/products/:id", () => {
    it("should return a product by id", async () => {
      const response = await requester.get(`/api/products/${newProduct._id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto encontrado');
      expect(response.body.product).to.be.an('object').that.has.all.keys('_id', 'title', 'description', 'owner', 'code', 'price', 'status', 'stock', 'category', 'thumbnails');
    });
  })

  describe("PUT /api/products/:id", () => {
    it("should update a product by id", async () => {
      const response = await requester.put(`/api/products/${newProduct._id}`).set('Authorization', `Bearer ${token}`).send({product: {
        title: 'new Title',
        description: 'new Description',
      }});

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto actualizado');
      expect(response.body.updatedProduct).to.be.an('object').that.has.all.keys('_id', 'title', 'description', 'owner', 'code', 'price', 'status', 'stock', 'category', 'thumbnails');
    });
  })

  describe("DELETE /api/products/:id", () => {
    it("should delete a product by id", async () => {
      const response = await requester.delete(`/api/products/${newProduct._id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto eliminado');
    });
  })

  describe("GET /api/products/mock/mockingproducts", () => {
    it("should return an array of mocking products", async () => {
      const response = await requester.get("/api/products/mock/mockingproducts").set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('productos generados');
      expect(response.body.products).to.be.an('array').that.is.not.empty;
    });
  });
});
