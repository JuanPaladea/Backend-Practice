import { Router } from "express";
import logged from "../middlewares/logged.js";
import cartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";

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

router.get('/user', authRedirect, async (req, res) => {
  const userId = req.session.user._id
  try {
    const cart = await cartService.getCart(userId)
    res.render(
      "user",
      {
        layout: "default",
        title: 'Backend Juan Paladea | Usuario',
        user: req.session.user,
        cart: cart
      }
    )
  } catch (error) {
    res.status(400).send({status: 'error', error: error.message})
  }
})

export default router