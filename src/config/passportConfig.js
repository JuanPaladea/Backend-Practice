import passport from "passport";
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth20';
import local from 'passport-local'
import { userModel } from "../dao/models/usersModel.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import userManagerDB from "../dao/utils/userManagerDB.js";
import CartManagerDB from "../dao/utils/cartManagerDB.js";
import dotenv from 'dotenv';
import jwt, { ExtractJwt } from 'passport-jwt';

dotenv.config()
const userManagerService = new userManagerDB()
const cartManagerService = new CartManagerDB()

const localStrategy = local.Strategy;
const JWTStratergy = jwt.Strategy;

const initializatePassport = () => {
  const GHCLIENT_ID = process.env.GHCLIENT_ID
  const GHCLIENT_SECRET = process.env.GHCLIENT_SECRET
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_SECRET = process.env.GOOGLE_SECRET
  const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT

  passport.use('register', new localStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email'
    },
    async (req, username, password, done) => {
      const { firstName, lastName, email, age} = req.body;

      try {
        const user = await userManagerService.findUserEmail(username);
        if (user) {
          console.log('User already exist')
          return done(null, false)
        }

        const newUser = {
          firstName,
          lastName,
          email,
          age,
          password: createHash(password)
        }

        const registeredUser = await userManagerService.registerUser(newUser)
        const cart = await cartManagerService.addCart(registeredUser._id)
        const result = await userManagerService.updateUser(registeredUser._id, cart._id);

        return done(null, result)
      } catch (error) {
      console.log(error.message)
      return done(error.message)
      }
    }
  ))

  passport.use('login', new localStrategy(
    {
      usernameField: 'email'
    },
    async (username, password, done) => {
      try {
        const user = await userManagerService.findUserEmail(username);
        if (!user) {
          console.log('User does not exist')
          return done('User does not exist')
        }

        if(!isValidPassword(user, password)) {
          return done(null, false)
        }
        
        return done(null, user)
      } catch (error) {
      console.log(error.message)
      return done(error.message)
      }
    }
  ))

  passport.use('jwt',new JWTStratergy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: 'coderSecret'
    },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (err) {
        return done(err);
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
          const registeredUser = await userManagerService.registerUser(newUser)
          const cart = await cartManagerService.addCart(registeredUser._id)
          const result = await userManagerService.updateUser(registeredUser._id, cart._id);
          done(null, result);
        } else {
          done(null, user);
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
        if(!user) {
          const newUser = {
            username: profile._json.name,
            name: profile._json.name,
            password: ''
          }
          const registeredUser = await userManagerService.registerUser(newUser)
          const cart = await cartManagerService.addCart(registeredUser._id)
          const result = await userManagerService.updateUser(registeredUser._id, cart._id);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  )
  
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
      const user = await userModel.findById(id);
      done(null, user);
  })
}

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies.coderCookieToken ?? null;
  }

  return token;
}

export default initializatePassport