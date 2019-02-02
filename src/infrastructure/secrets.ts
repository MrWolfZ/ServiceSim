import dotenv from 'dotenv';
import fs from 'fs';
import { CONFIG } from './config';
import { logger } from './logging';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const SESSION_SECRET = CONFIG.sessionSecret;

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}
