import supertest from "supertest";
import * as chai from 'chai';
import { generateUser } from "../src/utils/faker.js";

const expect = chai.expect;
const requester = supertest("http://localhost:10000");


describe("apiSesssion", () => {
  let token
  let testUserId

  before(async () => {
    const response = await requester.post("/api/session/login").send({
      email: "adminCoder@coder.com",
      password: "adminCod3r123"
    });
    token = response.body.token;
  })
  
  describe("POST /api/session/register", () => {
    it("should register a new user", async () => {
      const user = generateUser();
      const response = await requester.post("/api/session/register").send(user);

      testUserId = response.body.userId;
      console.log('testUserId: ', testUserId)

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('User logged in');
    })
  })

  describe("POST /api/session/login", () => {
    it("should login and return an admin token", async () => {
      const response = await requester.post("/api/session/login").send({
        email: "adminCoder@coder.com",
        password: "adminCod3r123"
      });

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('User logged in');
      expect(response.body.token).to.be.a('string');
    })
  })

  describe("GET /api/session", () => {
    it("should return an array of users", async () => {
      const response = await requester.get("/api/session/").set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('usuarios encontrados');
      expect(response.body.users).to.be.an('array').that.is.not.empty;
    })
  })

  describe("GET /api/session/current", () => {
    it("should return current user" , async () => {
      const response = await requester.get("/api/session/current").set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.user).to.be.an('object')
    })
  })

  describe("GET /api/session/:userId", () => {
    it("should return a user by id", async () => {
      const response = await requester.get(`/api/session/${testUserId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('User found');
      expect(response.body.user).to.be.an('object');
    })
  })

  describe("DELETE /api/session" , () => {
    it("should delete all unactive users", async () => {
      const response = await requester.delete("/api/session").set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('Users deleted');
    })
  })

  describe("DELETE /api/session/:userId", () => {
    it("should delete a user by id", async () => {
      const response = await requester.delete(`/api/session/${testUserId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('User deleted');
    })
  })
});