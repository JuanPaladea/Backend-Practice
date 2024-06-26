const auth = (req, res, next) => {
  if (!req.session.user) {
    req.logger.warning(`${req.method} ${req.path} - Unauthorized`)
    return res.status(401).send({status: 'error', message: 'Unauthorized'})
  }
  return next();
}

export default auth