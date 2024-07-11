import supertest from "supertest";
import * as chai from 'chai';
import { generateUser } from "../src/utils/faker.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");


describe("apiSesssion", () => {
  let token
  
  describe("POST /api/session/register", () => {
    it("should register a new user", async () => {
      const user = generateUser();
      const response = await requester.post("/api/session/register").send(
        user
      );
  
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({status: 'success', message: 'User registered, please check your email to verify your account.'});
    })
  })

  describe("POST /api/session/login", () => {
    it("should login and return an admin token", async () => {
      const response = await requester.post("/api/session/login").send({
        email: "adminCoder@coder.com",
        password: "adminCod3r123"
      });
      token = response.body.token;

      expect(response.body.token).to.be.a('string');
    })
  })

  describe("GET /api/session/users", () => {
    it("should return an array of users", async () => {
      const response = await requester.get("/api/session/users").set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
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

  describe("POST /api/session/logout", () => {
    it("should logout", async () => {
      const response = await requester.post("/api/session/logout")
      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
    })
  })
});