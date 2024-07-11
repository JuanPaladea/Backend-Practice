import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config.js';

const auth = (req, res, next) => {
  if (!req.session.user) {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, JWT_SECRET);
      req.session.user = decoded;
      next();
    } catch (error) {
      req.logger.warning("Unauthorized");
      return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }
  } else {
    next()
  }
}

export default auth;