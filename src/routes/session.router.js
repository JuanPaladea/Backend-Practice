import { Router } from "express";
import auth from "../middlewares/auth.js";
import logged from "../middlewares/logged.js";
import { cartModel } from "../dao/models/cartsModel.js";

const router = Router();

router.get('/login', logged, async (req, res) => {
  res.render(
    "login",
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Login',
      loginFailed: req.session.failLogin
    }
  )
})

router.get('/register', logged, async (req, res) => {
  res.render(
    'register',
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Register'
    }
  )
})

router.get('/user', auth, async (req, res) => {
  const userId = req.session.user._id
  const cart = await cartModel.findOne({user: userId}).lean()
  res.render(
    "user",
    {
      layout: "default",
      title: 'Backend Juan Paladea | Usuario',
      user: req.session.user,
      cart: cart
    }
  )
})

export default router