import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';

import userService from "../services/userService.js";
import { JWT_SECRET } from "../utils/config.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get('/users', auth, async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.status(200).send({status: 'success', message: 'usuarios encontrados', users})
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.get('/current', auth, async (req, res) => { 
  try {
    const user = await userService.getUserById(req.session.user._id);
    res.status(200).send({status: 'success', message: 'User found', user});
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message});

  };
});

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/api/session/failRegister', failureFlash: true}),
  (req, res) => {
    res.status(200).send({
      status: 'success',
      message: 'User registered',
    });
  }
);

router.get("/failRegister", (req, res) => {
  const message = req.flash('error')[0];
  res.status(400).send({
    status: "error",
    message: message || "Failed Register"
  });
});

router.post(
  '/login',
  passport.authenticate('login', {failureRedirect: '/api/session/failLogin', failureFlash: true}),
  (req, res) => {
    if (!req.user) {
      res.status(401).send({
        status: 'error',
        message: 'Error login!'
      });
    }
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role 
    };

    const token = jwt.sign({
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role
    }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('jwt', token);
    res.status(200).send({
      status: 'success',
      message: 'User logged in',
      token: token
    });
  }
)

router.get("/failLogin", (req, res) => {
  const message = req.flash('error')[0];
  res.status(400).send({
      status: "error",
      message: message || "Failed Login"
    });
});

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'Success'
  });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

router.get("/google", passport.authenticate('google', {scope: ['email', 'profile']}), (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'Success'
  });
});

router.get("/googlecallback", passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

router.post("/logout", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(400).send({
        status: 'error',
        message: 'Error logging out'
      });
    }
    res.clearCookie('jwt');
    res.status(200).send({
      status: 'success',
      message: 'User logged out'
    });
  })
});

export default router