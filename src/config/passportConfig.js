import passport from "passport";
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth20';
import local from 'passport-local'
import jwt, { ExtractJwt } from "passport-jwt";

import userModel from "../dao/mongo/models/usersModel.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import cartService from "../services/cartService.js";
import userService from "../services/userService.js";
import { GHCLIENT_ID, GHCLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_SECRET, JWT_SECRET } from "../utils/config.js";


const localStrategy = local.Strategy;
const JWTStratergy = jwt.Strategy;

const initializatePassport = () => {
  passport.use('register', new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      const { firstName, lastName, age} = req.body;
      if (!firstName || !lastName || !age || !password || !email) {
        done(null, false, {message: 'All fields are required!'})
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        done(null, false, {message: 'Invalid email!'})
      }
      // add password validation, the password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
        done(null, false, {message: 'Invalid password!, the password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'})
      }
      if (age < 18) {
        done(null, false, {message: 'You must be over 18 years old!'})
      }

      try {
        const existingUser = await userService.findUserEmail(email);
        if (existingUser) {
          done(null, false, {message: 'User already exist!'})
        }

        const newUser = {
          firstName,
          lastName,
          email,
          age,
          password: createHash(password)
        }

        //Register user, create cart and update user with new cart id
        const registeredUser = await userService.registerUser(newUser)
        const cart = await cartService.addCart(registeredUser._id)
        const result = await userService.updateUser(registeredUser._id, cart._id);

        done(null, result)
      } catch (error) {
        done(error.message)
      }
    }
  ))

  passport.use('login', new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      if (!email || !password) {
        done(null, false, {message: 'All fields are required!'})
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        done(null, false, {message: 'Invalid email!'})
      }
      try {
        const user = await userService.findUserEmail(email);
        if (!user) {
          done(null, false, {message: 'User not found!'})
        }

        if(!isValidPassword(user, password)) {
          done(null, false, {message: 'Invalid password!'})
        }
        
        done(null, user)
      } catch (error) {
        done(error.message)
      }
    }
  ))

  passport.use('jwt', new JWTStratergy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (jwt_payload, done) => {
      try {
        const user = await userService.findUserEmail(jwt_payload.email)
        if (user) {
          done(null, user)
        } else {
          done(null, jwt_payload);
        }
      } catch (error) {
        done(error);
      }
    }
  ))

  passport.use('github', new GitHubStrategy(
    {
    clientID: GHCLIENT_ID,
    clientSecret: GHCLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/session/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userModel.findOne({username: profile._json.login})
        if (!user) {
          const newUser = {
            username: profile._json.login,
            name: profile._json.name,
            password: ''
          }
          const registeredUser = await userService.registerUser(newUser)
          const cart = await cartService.addCart(registeredUser._id)
          const result = await userService.updateUser(registeredUser._id, cart._id);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        done(error);
      }
    }
  ));

  passport.use('google', new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: 'http://localhost:8080/api/session/googlecallback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userModel.findOne({username: profile._json.name})
        if (!user) {
          const newUser = {
            username: profile._json.name,
            name: profile._json.name,
            password: ''
          }
          const registeredUser = await userService.registerUser(newUser)
          const cart = await cartService.addCart(registeredUser._id)
          const result = await userService.updateUser(registeredUser._id, cart._id);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        done(error);
      }
    })
  )
  
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

export default initializatePassport