import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  req.logger.debug('Debug log');
  req.logger.http('HTTP log');
  req.logger.info('Info log');
  req.logger.warning('Warning log');
  req.logger.error('Error log');
  req.logger.fatal('Fatal log');

  res.send('Logs printed in console and file');
});

export default router