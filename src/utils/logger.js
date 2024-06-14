import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'http' }),
    new winston.transports.File({ filename: './src/logs/errors.log', level: 'error' })
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
}