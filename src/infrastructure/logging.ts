import 'setimmediate';
import winston, { format } from 'winston';
import { CONFIG } from './config';

export const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

if (CONFIG.platform === 'node') {
  logger.add(
    new winston.transports.File({
      filename: 'debug.log',
    }),
  );
}

if (CONFIG.environment !== 'production') {
  const myFormat = format.printf(arg => {
    const { level, message, timestamp } = arg;
    return CONFIG.platform === 'node' ? `${timestamp} ${level}: ${message}` : message;
  });

  logger.add(
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.splat(),
        myFormat,
      ),
      stderrLevels: ['error'],
      consoleWarnLevels: ['warn'],
    }),
  );
}

logger.debug('Logging initialized at debug level');
