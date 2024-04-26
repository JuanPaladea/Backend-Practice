import { Router } from "express";
import userManagerDB from "../dao/utils/userManagerDB.js";
import passport from "passport";

const router = Router();

const userManagerService = new userManagerDB()

router.get('/users', async (req, res) => {
  try {
    const result = await userManagerService.getUsers()
    res.send({users: result})
  } catch (error) {
    console.error(error)
  }
})

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/api/session/failRegister' }),
  async (req, res) => {
    res.redirect('/login')
  }
);

router.get("/failRegister", (req, res) => {
  res.status(400).send({
      status: "error",
      message: "Failed Register"
  });
});

router.post(
  '/login',
  passport.authenticate('login', {failureRedirect: '/api/session/failLogin'}),
  (req, res) => {
    if (!req.user) {
      return res.send(401).send({
        status: 'error',
        message: 'Error login!'
      })
    }
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role 
    }

    res.redirect('/')
  }
)

router.get("/failLogin", (req, res) => {
  res.status(400).send({
      status: "error",
      message: "Failed Login"
  });
});

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
  res.send({
      status: 'success',
      message: 'Success'
  });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

router.get("/google", passport.authenticate('google', {scope: ['user:email']}), (req, res) => {
  res.send({
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
      res.redirect('/login');
  })
});

export default router