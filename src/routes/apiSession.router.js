import { Router } from "express";
import passport from "passport";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";

import { changeUserRole, failLogin, failRegister, getCurrentUser, getUsers, setSessionUserCookie, logOut, sendVerificationEmail, resetPassword, sendPasswordResetEmail, verifyUser } from "../controllers/sessionController.js";

const router = Router();

router.get('/users', auth, isVerified, isAdmin, getUsers)
router.get('/current', auth, isVerified, getCurrentUser);
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failRegister', failureFlash: true}), sendVerificationEmail);
router.get("/failRegister", failRegister);
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/failLogin', failureFlash: true}), setSessionUserCookie);
router.get("/failLogin", failLogin);
router.get('/verify', verifyUser)
router.post('/forgotpassword', sendPasswordResetEmail)
router.post('/resetpassword', resetPassword)
router.get("/premium/:userId", auth, isVerified, changeUserRole);
router.post("/logout", logOut);

// EXTERNAL LOGIN
router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
  res.status(200).send({status: 'success', message: 'Success'});
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email,
    verified: true,
    role: req.user.role
  };
  res.redirect('/');
});

router.get("/google", passport.authenticate('google', {scope: ['email', 'profile']}), (req, res) => {
  res.status(200).send({status: 'success', message: 'Success'});
});

router.get("/googlecallback", passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    verified: true,
    role: req.user.role
  };
  res.redirect('/');
});

export default router