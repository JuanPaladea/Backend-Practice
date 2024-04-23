import { Router } from "express";
import userManagerDB from "../dao/utils/userManagerDB.js";
import CartManagerDB from "../dao/utils/cartManagerDB.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

const userManagerService = new userManagerDB()
const cartManagerService = new CartManagerDB()

router.get('/users', async (req, res) => {
  try {
    const result = await userManagerService.getUsers()
    res.send({users: result})
  } catch (error) {
    console.error(error)
  }
})

router.post("/register", async (req, res) => {
  const {firstName, lastName, email, age, password} = req.body
  const user = {
    firstName,
    lastName,
    email,
    age,
    password: createHash(password)
  }

  try {
    const response = await userManagerService.registerUser(user)
    const cart = await cartManagerService.addCart(response._id)

    //ADD CART TO USER
    await userManagerService.updateUser(response._id, cart._id)
    res.redirect('/')
  } catch (error) {
    res.redirect('/register')
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    req.session.failLogin = false

    const user = await userManagerService.findUserEmail(email);
    if (!user) {
      req.session.failLogin = true;
      return res.redirect('/login');
    }

    if (!isValidPassword(user, password)) {
      req.session.failLogin = true
      return res.redirect('/login')
    }

    req.session.user = user
    res.redirect('/')

  } catch (error) {
    console.error('Error during login:', error);
    req.session.failLogin = true;
    res.redirect('/login');
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(error => {
      res.redirect('/login');
  })
});

export default router