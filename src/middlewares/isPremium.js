const isPremium = (req, res, next) => {
  if (!req.session.user) {
    req.logger.warning(`${req.method} ${req.path} - Unauthorized`)
    return res.status(401).send({status: 'error', message: 'Unauthorized'})
  }

  if (req.session.user.role == 'admin') {
    return next();
  }

  if (req.session.user.role != 'premium') {
    req.logger.warning(`${req.method} ${req.path} - No tienes permisos premium para realizar esta acción`)
    return res.status(403).send({status: 'error', message: 'No tienes permisos premium para realizar esta acción'})
  }

  return next();
}

export default isPremium;