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
  const { email, password } = req.body;
  try {
    req.session.failLogin = false
    const user = await userManagerService.findUserEmail(email);
    
    if (!user) {
      req.session.failLogin = true;
      return res.redirect('/login');
    }

    if (password !== user.password) {
      req.session.failLogin = true
      return res.redirect('/login')
    }

    req.session.user = user

    if (user.email == "adminCoder@coder.com" && user.password == "adminCod3r123") {
      req.session.user.role = 'admin'
    }
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