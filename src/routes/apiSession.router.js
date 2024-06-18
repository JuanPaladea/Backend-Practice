import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';

import userService from "../services/userService.js";
import { EMAIL, JWT_SECRET } from "../utils/config.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";
import transport from "../utils/mailer.js";
import { createHash } from "../utils/bcrypt.js";

const router = Router();

router.get('/users', auth, isVerified, isAdmin, async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.status(200).send({status: 'success', message: 'usuarios encontrados', users})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
})

router.get('/current', auth, isVerified, async (req, res) => { 
  try {
    const user = await userService.getUserById(req.session.user._id);
    res.status(200).send({status: 'success', message: 'User found', user});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  };
});

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/api/session/failRegister', failureFlash: true}),
  (req, res) => {

    const token = jwt.sign({
      _id: req.user._id,
      email: req.user.email,
    }, JWT_SECRET, {expiresIn: '1d'})

    transport.sendMail({
      from: `BackEnd JP <${EMAIL}>`,
      to: req.user.email,
      subject: 'Bienvenido al Backend JP - Verificación de cuenta',
      html: 
      `<div>
      <h1>¡Bienvenido a Backend JP!</h1>
      <p>Para verificar tu cuenta, por favor haz click en el siguiente enlace:</p>
      <a href="http://localhost:8080/api/session/verify?token=${token}">Verificar cuenta</a>
      </div>`
    })
    
    res.status(200).send({
      status: 'success',
      message: 'User registered, please check your email to verify your account.',
    });
  }
);

router.get("/failRegister", (req, res) => {
  const message = req.flash('error')[0];
  req.logger.error(`${req.method} ${req.path} - ${message}`)
  res.status(400).send({
    status: "error",
    message: message || "Failed Register"
  });
});

router.post(
  '/login',
  passport.authenticate('login', {failureRedirect: '/api/session/failLogin', failureFlash: true}),
  (req, res) => {
    if (!req.user) {
      res.status(401).send({
        status: 'error',
        message: 'Error login!'
      });
    }
    req.session.user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      verified: req.user.verified,
      age: req.user.age,
      role: req.user.role 
    };
    
    const token = jwt.sign({
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      verified: req.user.verified,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role
    }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('jwt', token);
    res.status(200).send({
      status: 'success',
      message: 'User logged in',
      token: token
    });
  }
)

router.get("/failLogin", (req, res) => {
  const message = req.flash('error')[0];
  req.logger.error(`${req.method} ${req.path} - ${message}`)
  res.status(400).send({
    status: "error",
    message: message || "Failed Login"
  });
});

router.get('/verify', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.status(400).send({
      status: 'error',
      message: 'Token not found'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUserById(decoded._id);
    if (!user) {
      res.status(404).send({
        status: 'error',
        message: 'User not found'
      });
    }
    if (user.verified) {
      res.status(400).send({
        status: 'error',
        message: 'User already verified'
      });
    }
    
    const result = await userService.verifyUser(user._id);
    req.session.user = {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      verified: result.verified,
      age: result.age,
      role: result.role
    };

    res.status(200).send({
      status: 'success',
      message: 'User verified, you are now logged in!',
    });
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
})

router.post('/forgotpassword', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.status(400).send({
      status: 'error',
      message: 'Email is required'
    });
  }

  try {
    const user = await userService.findUserEmail(email);
    if (!user) {
      res.status(404).send({
        status: 'error',
        message: 'User not found'
      });
    }
    const token = jwt.sign({
      _id: user._id,
      email: user.email
    }, JWT_SECRET, { expiresIn: '1h' });

    transport.sendMail({
      from: `BackEnd JP <${EMAIL}>`,
      to: email,
      subject: 'Backend JP | Reset Password',
      html: 
      `<div>
      <h1>Reset Password</h1>
      <p>To reset your password, please click on the following link:</p>
      <a href="http://localhost:8080/resetpassword?token=${token}">Reset Password</a>
      </div>`
    });

    res.status(200).send({
      status: 'success',
      message: 'Email sent to reset password'
    });
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
})

router.post('/resetpassword', async (req, res) => {
  const token = req.query.token;
  const password = req.body.password;
  const password2 = req.body.password2;
  if (!token) {
    res.status(400).send({
      status: 'error',
      message: 'Token not found'
    });
  }
  if (!password || !password2) {
    res.status(400).send({
      status: 'error',
      message: 'Password is required'
    });
  }
  if (password !== password2) {
    res.status(400).send({
      status: 'error',
      message: 'Passwords do not match'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUserById(decoded._id);
    if (!user) {
      res.status(404).send({
        status: 'error',
        message: 'User not found'
      });
    }
    const result = await userService.updatePassword(user._id, createHash(password));
    req.session.user = {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      verified: result.verified,
      age: result.age,
      role: result.role
    };

    res.status(200).send({
      status: 'success',
      message: 'Password updated'
    });
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
})

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'Success'
  });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    email: req.user.email,
    verified: true,
    role: req.user.role
  };
  res.redirect('/');
});

router.get("/google", passport.authenticate('google', {scope: ['email', 'profile']}), (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'Success'
  });
});

router.get("/googlecallback", passport.authenticate('google', {failureRedirect: '/login'}), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    verified: true,
    role: req.user.role
  };
  res.redirect('/');
});

router.post("/logout", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.status(400).send({
        status: 'error',
        message: 'Error logging out'
      });
    }
    res.clearCookie('jwt');
    res.status(200).send({
      status: 'success',
      message: 'User logged out'
    });
  })
});

export default router