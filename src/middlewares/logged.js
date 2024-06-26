const logged = (req, res, next) => {
  if (req.session.user) {
    req.logger.info(`${req.method} ${req.path} - Ya estás logueado`);
    return res.status(403).send({ status: 'error', message: 'Ya estás logueado' });
  }
  return next();
}

export default logged