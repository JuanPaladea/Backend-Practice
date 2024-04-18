import { Router } from "express";
import userManagerDB from "../dao/utils/userManagerDB.js";

const router = Router();

const userManagerService = new userManagerDB()

router.post("/register", async (req, res) => {
  const user = req.body
  try {
    await userManagerService.registerUser(user)
    res.redirect('/')
  } catch (error) {
    res.redirect('/register')
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email
  try {
    req.session.failLogin = false
    const result = await userManagerService.findUserEmail(email)
    if (!result) {
      req.session.failLogin = true;
      res.redirect('/login')
    }
    if (req.body.password !== result.password) {
      req.session.failLogin = true
      res.redirect('/login')
    }
    req.session.user = result

    res.redirect('/')
  } catch (error) {
    req.session.failLogin = true
    res.redirect('/products')
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(error => {
      res.redirect('/login');
  })
});

export default router