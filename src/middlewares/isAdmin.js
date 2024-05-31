const isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({status: 'error', message: 'Unauthorized'})
  }

  if (req.session.user.role != 'admin') {
    return res.status(403).send({status: 'error', message: 'No tienes permisos para realizar esta acción'})
  }

  return next();
}

export default isAdmin