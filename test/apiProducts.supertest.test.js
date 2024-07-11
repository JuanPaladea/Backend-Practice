import supertest from "supertest";
import * as chai from 'chai';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

let token = "";

describe("Login to get token", () => {
  it("should return a token", async () => {
    const response = await requester.post("/api/session/login").send({
      email: "adminCoder@coder.com",
      password: "adminCod3r123"
    });
    expect(response.body.token).to.be.a('string');
    token = response.body.token;
  });
});

describe("apiProducts", () => {
  describe("GET /api/products", () => {
    it("should return an array of products", async () => {
      const response = await requester.get("/api/products").set('Authorization', `Bearer ${token}`);
      expect(response.body.products.products).to.be.an('array');
    });
  });
});