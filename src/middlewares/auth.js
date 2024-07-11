import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config.js';

const auth = (req, res, next) => {
  if (!req.session.user) {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, JWT_SECRET);
      req.session.user = decoded;
      next(); // Move inside the try block to ensure it only calls next if authentication succeeds
    } catch (error) {
      return res.status(401).send({ error: "Please authenticate" }); // Add return to prevent calling next after sending a response
    }
  } else {
    next(); // Ensure next is called when the user is already in the session
  }
}

export default auth;