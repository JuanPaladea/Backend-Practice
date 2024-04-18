import { Router } from "express";
import userManagerDB from "../dao/utils/userManagerDB.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get('/login', async (req, res) => {
  if (req.session.user) {
    res.redirect('/user')
  }
  res.render(
    "login",
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Login',
      loginFailed: req.session.failLogin
    }
  )
})

router.get('/register', async (req, res) => {
  if (req.session.user) {
    res.redirect('/user')
  }
  res.render(
    'register',
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Register'
    }
  )
})

router.get('/user', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login')
  }
  res.render(
    "user",
    {
      layout: "default",
      title: 'Backend Juan Paladea | Usuario',
      user: req.session.user
    }
  )
})

export default router