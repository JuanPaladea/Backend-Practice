import winston from 'winston';
import { NODE_ENV } from '../utils/config.js';

const customLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  },
  colors: {
    debug: 'blue',
    http: 'green',
    info: 'yellow',
    warning: 'yellow',
    error: 'red',
    fatal: 'red'
  }
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug'
    })
  ]
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level.toUpperCase()}: ${message}`;
        })      
      ),
    }),
    new winston.transports.File({
      filename: './src/logs/errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level.toUpperCase()}: ${message}`;
        })
      )
    })
  ]
});

const logger = NODE_ENV === "production" ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
}