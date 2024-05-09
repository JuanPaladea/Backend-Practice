const isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }

  if (req.session.user.role != 'admin') {
    return res.status(400).send({
      status: "error",
      message: "Unathorized"
    });
  }

  return next();
}

export default isAdmin