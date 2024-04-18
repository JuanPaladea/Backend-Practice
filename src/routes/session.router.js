import { Router } from "express";
import userManagerDB from "../dao/utils/userManagerDB.js";
import auth from "../middlewares/auth.js";

const router = Router();

const userManagerService = new userManagerDB()

router.get('/login', async (req, res) => {
  if (req.session.user) {
    res.redirect('/')
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
  res.render(
    'register',
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Register'
    }
  )
})

router.get('/user', (req, res) => {
  if (req.session.user) {
    res.render(
      "user",
      {
        layout: "default",
        title: 'Backend Juan Paladea | Usuario',
        user: req.session.user
      }
    )
  } else {
    res.redirect('/login')
  }
})

export default router