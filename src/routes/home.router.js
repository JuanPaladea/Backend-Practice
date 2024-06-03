import { Router } from "express"
import cartService from "../services/cartService.js"
import authRedirect from "../middlewares/authRedirect.js"
import isVerified from "../middlewares/isVerified.js"

const router = Router()

router.get('/', authRedirect, isVerified, async (req, res) => {
  try {
    const userId = req.session.user._id
    const cart = await cartService.getCartWithUserId(userId)
    res.render(
      "home", {
        layout: "default",
        title: 'Backend Juan Paladea',
        user: req.session.user,
        cart: cart 
      }
    )
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

export default router