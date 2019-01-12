import winston from 'winston';
import { CONFIG } from '../config';

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
});

if (CONFIG.environment !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));

  logger.debug('Logging initialized at debug level');
}
