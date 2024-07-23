import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = 'uploads/'
    if (req.path.includes('documents')) {
      dest = 'uploads/documents/'
    } else if (req.path.includes('products')) {
      dest = 'uploads/products/'
    } else if (req.path.includes('profile')) {
      dest = 'uploads/profile/'
    }
    cb(null, dest)
 },
  filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage })

export default upload
