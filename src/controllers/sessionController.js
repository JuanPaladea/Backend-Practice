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

export const getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userService.getUserById(userId);
    res.status(200).send({status: 'success', message: 'User found', user});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
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

export const failRegister = (req, res) => {
  const message = req.flash('error')[0]
  req.logger.error(`${req.method} ${req.path} - ${message} || 'Failed register'`)
  res.status(400).send({ status: "error", message: message || 'Failed register' });
}

export const setSessionUserCookie = (req, res) => {
  if (!req.user) {
    return res.status(401).send({status: 'error', message: 'Error login!'});
  }

  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName || "",
    email: req.user.email || "",
    age: req.user.age || 0,
    role: req.user.role 
  };
  
  const token = jwt.sign({
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName || "",
    email: req.user.email || "",
    age: req.user.age || 0,
    role: req.user.role
  }, JWT_SECRET, { expiresIn: '1h' });

  res.cookie('jwt', token);
  userService.updateLastConnection(req.user._id);
  res.status(200).send({status: 'success', message: 'User logged in', token: token, userId: req.user._id});
}

export const failLogin = (req, res) => {
  const message = req.flash('error')[0];
  req.logger.error(`${req.method} ${req.path} - ${message || 'Failed login'}`)
  res.status(400).send({ status: "error", message: message || 'Failed login' });
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
      lastName: result.lastName || "",
      email: result.email || "",
      age: result.age || 0,
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
      return res.status(200).send({status: 'success', message: 'User is now user', user: result});
    }

    if (user.role === 'usuario') {
      if (req.session.user.role == 'admin') {
        const result = await userService.updateRole(userId, 'premium');
        return res.status(200).send({status: 'success', message: 'User is now premium', user: result});
      }

      if (!user.documents) {
        req.logger.warning(`${req.method} ${req.path} - User must upload documents to become premium`)
        return res.status(400).send({status: 'error', message: 'User must upload documents to become premium'});
      }
      if (user.documents.length < 3) {
        req.logger.warning(`${req.method} ${req.path} - User must upload documents to become premium`)
        return res.status(400).send({status: 'error', message: 'User must upload documents to become premium'});
      }
      const result = await userService.updateRole(userId, 'premium');
      return res.status(200).send({status: 'success', message: 'User is now premium', user: result});
    }
    
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const uploadDocuments = async (req, res) => {  
  const userId = req.params.userId;
  const documents = req.files.map(file => {
    return {name: file.originalname, reference: file.path}
  })

  if (!documents || documents.length !== 3) {
    req.logger.warning(`${req.method} ${req.path} - The 3 documents are required`)
    return res.status(400).send({status: 'error', message: 'The 3 documents are required'});
  }

  try {
    const result = await userService.uploadDocuments(userId, documents);
    res.status(200).send({status: 'success', message: 'Documents uploaded', user: result});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const deleteUnactiveUsers = async (req, res) => {
  try {
    const users = await userService.getUnactiveUsers();

    if (users) {
      users.forEach(async user => {
        await transport.sendMail({
          from: `BackEnd JP <${EMAIL}>`,
          to: user.email,
          subject: 'Backend JP | Account Deleted',
          html: 
          `<div>
          <h1>Account Deleted</h1>
          <p>Your account has been deleted due to inactivity</p>
          </div>`
        });
      })
    }

    const result = await userService.deleteUnactiveUsers();
    res.status(200).send({status: 'success', message: 'Users deleted', result});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await userService.getUserById(userId);

  if (user.role === 'admin') {
    req.logger.warning(`${req.method} ${req.path} - Can't delete an admin`)
    return res.status(400).send({status: 'error', message: "Can't delete an admin"});
  }

  try {
    const result = await userService.deleteUser(userId);
    res.status(200).send({status: 'success', message: 'User deleted', result});
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message});
  }
}

export const logOut = async (req, res) => {
  userService.updateLastConnection(req.user._id);

  req.session.destroy(error => {
    
    if (error) {
      req.logger.error(`${req.method} ${req.path} - Error logging out`) 
      return res.status(400).send({status: 'error', message: 'Error logging out'});
    }

    res.clearCookie('jwt');
    res.status(200).send({status: 'success', message: 'User logged out'})
  })
}