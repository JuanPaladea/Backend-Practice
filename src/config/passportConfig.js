import passport from "passport";
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oidc';
import local from 'passport-local'
import { userModel } from "../dao/models/usersModel";

const localStrategy = local.Strategy;
const initializatePassport = () => {
  passport.use('register', new localStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email'
    }
  ))
}