import jwt from 'jsonwebtoken';

import transport from "../utils/mailer.js";
import userService from "../services/userService.js";
import { EMAIL, JWT_SECRET } from "../utils/config.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.status(200).send({status: 'success', message: 'usuarios encontrados', users})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.session.user._id);
    res.status(200).send({status: 'success', message: 'User found', user});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const sendVerificationEmail = (req, res) => {
  const token = jwt.sign({
    _id: req.user._id,
    email: req.user.email,
  }, JWT_SECRET, {expiresIn: '1d'})

  // transport.sendMail({
  //   from: `BackEnd JP <${EMAIL}>`,
  //   to: req.user.email,
  //   subject: 'Bienvenido al Backend JP - Verificación de cuenta',
  //   html: 
  //   `<div>
  //   <h1>¡Bienvenido a Backend JP!</h1>
  //   <p>Para verificar tu cuenta, por favor haz click en el siguiente enlace:</p>
  //   <a href="http://localhost:8080/api/session/verify?token=${token}">Verificar cuenta</a>
  //   </div>`
  // })
  
  res.status(200).send({status: 'success', message: 'User registered, please check your email to verify your account.'});
}

export const failRegister = (req, res) => {
  const message = req.flash('error')[0];
  req.logger.error(`${req.method} ${req.path} - ${message}`)
  res.status(400).send({status: "error", message: message || "Failed Register"});
}

export const setSessionUserCookie = (req, res) => {
  if (!req.user) {
    return res.status(401).send({status: 'error', message: 'Error login!'});
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
  res.status(200).send({status: 'success', message: 'User logged in', token: token});
}

export const failLogin = (req, res) => {
  const message = req.flash('error')[0];
  req.logger.error(`${req.method} ${req.path} - ${message}`)
  res.status(400).send({status: "error", message: message || "Failed Login"});
}

export const verifyUser = async (req, res) => {
  const token = req.query.token;
  if (!token) {
    req.logger.warning(`${req.method} ${req.path} - Token not found`)
    return res.status(400).send({status: 'error', message: 'Token not found'});
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUserById(decoded._id);
    if (!user) {
      req.logger.warning(`${req.method} ${req.path} - User not found`)
      return res.status(404).send({status: 'error', message: 'User not found'});
    }

    if (user.verified) {
      req.logger.info(`${req.method} ${req.path} - User already verified`)
      return res.status(400).send({status: 'error', message: 'User already verified'});
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

    res.status(200).send({status: 'success', message: 'User verified, you are now logged in!'});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const sendPasswordResetEmail = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    req.logger.warning(`${req.method} ${req.path} - Email is required`)
    return res.status(400).send({status: 'error', message: 'Email is required'});
  }

  try {
    const user = await userService.findUserEmail(email);

    if (!user) {
      req.logger.warning(`${req.method} ${req.path} - User not found`)
      return res.status(404).send({status: 'error', message: 'User not found'});
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

    res.status(200).send({status: 'success', message: 'Email sent to reset password'});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const resetPassword = async (req, res) => {
  const token = req.query.token;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (!token) {
    req.logger.warning(`${req.method} ${req.path} - Token not found`)
    return res.status(400).send({status: 'error', message: 'Token not found'});
  }

  if (!password || !password2) {
    req.logger.warning(`${req.method} ${req.path} - Password is required`)
    return res.status(400).send({status: 'error', message: 'Password is required'});
  }

  if (password !== password2) {
    req.logger.warning(`${req.method} ${req.path} - Passwords do not match`)
    return res.status(400).send({status: 'error', message: 'Passwords do not match'});
  }

  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    req.logger.warning(`${req.method} ${req.path} - Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number`)
    return res.status(400).send({status: 'error', message: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number'});
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUserById(decoded._id);

    if (!user) {
      req.logger.warning(`${req.method} ${req.path} - User not found`)
      return res.status(404).send({status: 'error', message: 'User not found'});
    }

    if (isValidPassword(user, password)) {
      req.logger.warning(`${req.method} ${req.path} - Password is the same as the current one`)
      return res.status(400).send({status: 'error', message: 'Password is the same as the current one'});
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

    res.status(200).send({status: 'success', message: 'Password updated'});
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      req.logger.warning(`${req.method} ${req.path} - Token expired`)
      return res.redirect('/forgotpassword', {status: 'error', message: 'Token expired'});
    }
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const changeUserRole = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      req.logger.warning(`${req.method} ${req.path} - User not found`)
      return res.status(404).send({status: 'error', message: 'User not found'});
    }

    if (user.role === 'admin') {
      req.logger.warning(`${req.method} ${req.path} - User is admin, can't change to premium/user`)
      return res.status(400).send({status: 'error', message: "User is admin, can't change to premium/user"});
    }

    if (user.role === 'premium') {
      const result = await userService.updateRole(userId, 'usuario');
      req.session.user.role = 'usuario';
      return res.status(200).send({status: 'success', message: 'User is now user', user: result});
    }

    if (user.role === 'usuario') {
      const result = await userService.updateRole(userId, 'premium');
      req.session.user.role = 'premium';
      return res.status(200).send({status: 'success', message: 'User is now premium', user: result});
    }
    
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const logOut = async (req, res) => {
  req.session.destroy(error => {
    
    if (error) {
      req.logger.error(`${req.method} ${req.path} - Error logging out`) 
      return res.status(400).send({status: 'error', message: 'Error logging out'});
    }

    res.clearCookie('jwt');
    res.status(200).send({status: 'success', message: 'User logged out'})
  })
}