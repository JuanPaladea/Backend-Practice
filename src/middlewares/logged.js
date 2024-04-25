const logged = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/user')
  }
  return next();
}

export default logged