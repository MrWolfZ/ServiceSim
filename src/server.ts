import errorHandler from 'errorhandler';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import lusca from 'lusca';
import path from 'path';
import { SESSION_SECRET } from './util/secrets';

import 'core-js/fn/array/flat-map';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

import * as api from './api';
import { logger } from './util/logger';

const host = express();

host.set('port', process.env.PORT || 3000);
host.use(compression());
host.use(cors());
host.use(bodyParser.json());
host.use(bodyParser.urlencoded({ extended: true }));
host.use(expressValidator());
host.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET!,
}));
host.use(lusca.xframe('SAMEORIGIN'));
host.use(lusca.xssProtection(true));

host.use(
  express.static(path.join(__dirname, 'ui'), { maxAge: 31557600000 })
);

host.use(api.api);

// tslint:disable-next-line:no-floating-promises
api.initialize().then(sub => {
  process.on('SIGTERM', () => {
    sub.unsubscribe();
  });
});

host.use(errorHandler());

const server = host.listen(host.get('port'), () => {
  logger.info(`App is running at http://localhost:${host.get('port')} in ${host.get('env')} mode`);
  logger.info('Press CTRL-C to stop\n');
});

export default server;
