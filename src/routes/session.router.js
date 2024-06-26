import { Router } from "express";
import logged from "../middlewares/logged.js";
import cartService from "../services/cartService.js";
import authRedirect from "../middlewares/authRedirect.js";
import isVerified from "../middlewares/isVerified.js";

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

router.get('/user', authRedirect, isVerified, async (req, res) => {
  const userId = req.session.user._id

  try {
    const cart = await cartService.getCartWithUserId(userId)
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
    console.log(error)
  }
})

router.get('/verify/:id', async (req, res) => {
  res.render(
    'verify',
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Verify',
      id: req.params.id
    }
  )
})

router.get('/forgotpassword', async (req, res) => {
  res.render(
    'forgotpassword',
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Forgot Password'
    }
  )
})

router.get('/resetpassword', async (req, res) => {
  const token = req.query.token
  if (!token) {
    res.status(400).send({status: 'error', message: 'Token not found'})
  }
  res.render(
    'resetpassword',
    {
      layout: 'default',
      title: 'Backend Juan Paladea | Reset Password',
      token: token
    }
  )
});

export default router