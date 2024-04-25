import passport from "passport";
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oidc';
import local from 'passport-local'
import { userModel } from "../dao/models/usersModel";
import { isValidPassword } from "../utils/bcrypt";

const localStrategy = local.Strategy;
const initializatePassport = () => {
  passport.use('register', new localStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email'
    },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({email: username});
        if (!user) {
          console.log('User does not exist')
          return done('User does not exist')
        }

        if (!isValidPassword(user, password)) {
          return done(null, false)
        }

        return done(null, user)
      } catch (error) {
      console.log(error.message)
      return done(error.message)
      }
    }
  ))
  
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
      const user = await userModel.findById(id);
      done(null, user);
  })
}

export default initializatePassport