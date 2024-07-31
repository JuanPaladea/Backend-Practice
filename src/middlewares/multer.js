import multer from 'multer'
import fs from 'fs';
import path from 'path'
import { __dirname } from '../utils/utils.js';

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = ''

    if (req.path.includes('documents')) {
      dest = path.resolve(__dirname, '../../uploads/documents/')
    } else if (req.path.includes('products')) {
      dest = path.resolve(__dirname, '../../uploads/products/')
    } else if (req.path.includes('profile')) {
      dest = path.resolve(__dirname, '../../uploads/profile/')
    }
    ensureDirectoryExistence(dest);
    cb(null, dest)
 },
  filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage })

export default upload
