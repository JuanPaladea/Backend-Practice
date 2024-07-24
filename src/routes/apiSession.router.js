import { Router } from "express";
import passport from "passport";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../middlewares/multer.js";

import { changeUserRole, failLogin, failRegister, getCurrentUser, getUsers, setSessionUserCookie, logOut, resetPassword, sendPasswordResetEmail, uploadDocuments, deleteUnactiveUsers, deleteUser } from "../controllers/sessionController.js";

const router = Router();

router.get('/', auth, getUsers)
router.get('/current', auth, getCurrentUser);
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failRegister', failureFlash: true}), setSessionUserCookie);
router.get("/failRegister", failRegister);
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/failLogin', failureFlash: true}), setSessionUserCookie);
router.get("/failLogin", failLogin);
router.post('/forgotpassword', sendPasswordResetEmail)
router.post('/resetpassword', resetPassword)
router.get("/role/:userId", auth, changeUserRole);
router.post("/:userId/documents", auth, upload.array('files', 3), uploadDocuments)
router.post("/logout", logOut);
router.delete('/', auth, isAdmin, deleteUnactiveUsers);
router.delete("/:userId", auth, isAdmin, deleteUser);

// EXTERNAL LOGIN
router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
  res.status(200).send({status: 'success', message: 'Success'});
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email,
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
    role: req.user.role
  };
  res.redirect('/');
});

export default router