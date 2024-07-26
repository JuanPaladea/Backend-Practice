import supertest from "supertest";
import * as chai from 'chai';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("apiCarts", () => {
  let token;
  let cartId

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

  describe("POST /api/carts", () => {
    it("should create a new cart or return the user's cart", async () => {
      const response = await requester.post("/api/carts").set('Authorization', `Bearer ${token}`);
      cartId = response.body.cart._id;

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('carrito creado');
      expect(response.body.cart).to.be.an('object');
    });
  })

  describe("GET /api/carts", () => {
    it("should return an array of carts", async () => {
      const response = await requester.get("/api/carts").set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('carritos encontrados');
      expect(response.body.carts).to.be.an('array').that.is.not.empty;
    });
  })

  describe("GET /api/carts/:cid", () => {
    it("should return a cart by id", async () => {
      const response = await requester.get(`/api/carts/${cartId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('carrito encontrado');
      expect(response.body.cart).to.be.an('object');
    })
  })

  describe("POST /api/carts/:cid/products/:pid", () => {
    it("should add a product to the cart", async () => {
      const response = await requester.post(`/api/carts/${cartId}/products/6617ed15f8782713d833e632`).set('Authorization', `Bearer ${token}`).send({quantity: 1});

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto 6617ed15f8782713d833e632 agregado al carrito');
    })
  })

  describe("PUT /api/carts/:cid/products/:pid", () => {
    it("should update a product quantity in the cart", async () => {
      const response = await requester.put("/api/carts/665a06a99f0653cac83f744b/products/6617ed15f8782713d833e632").set('Authorization', `Bearer ${token}`).send({quantity: 2});

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('cantidad de producto actualizada');
    })
  })

  describe("DELETE /api/carts/:cid/products/:pid", () => {
    it("should delete a product from the cart", async () => {
      const response = await requester.delete("/api/carts/665a06a99f0653cac83f744b/products/6617ed15f8782713d833e632").set('Authorization', `Bearer ${token}`);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto eliminado del carrito');
    })
  })
})