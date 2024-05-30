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
      passReqToCallback: true,
      failureFlash: true
    },
    async (req, email, password, done) => {
      const { firstName, lastName, age} = req.body;
      if (!firstName || !lastName || !age || !password || !email) {
        return done(null, false, {message: 'All fields are required!'})
      }
      if (age < 18) {
        return done(null, false, {message: 'You must be over 18 years old!'})
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return done(null, false, {message: 'Invalid email!'})
      }
      // add password validation, the password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
        return done(null, false, {message: 'Invalid password!, the password must have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'})
      }

      try {
        const existingUser = await userService.findUserEmail(email);
        if (existingUser) {
          return done(null, false, {message: 'User already exist!'})
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

        return done(null, result)
      } catch (error) {
        return done(error)
      }
    }
  ))

  passport.use('login', new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      failureFlash: true
    },
    async (username, password, done) => {
      if (!username || !password) {
        return done(null, false, {message: 'All fields are required!'})
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
        return done(null, false, {message: 'Invalid email!'})
      }
      try {
        const user = await userService.findUserEmail(username);
        if (!user) {
          return done(null, false, {message: 'User not found!'})
        }
        console.log(user)
        if(!isValidPassword(user, password)) {
          return done(null, false, {message: 'Invalid password!'})
        }
        
        return done(null, user)
      } catch (error) {
        return done(error)
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
          return done(null, user)
        } else {
          return done(null, jwt_payload);
        }
      } catch (error) {
        return done(error);
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
          return done(null, result);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
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
          return done(null, result);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  )
  
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUserById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

export default initializatePassport