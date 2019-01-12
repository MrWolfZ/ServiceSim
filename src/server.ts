import errorHandler from 'errorhandler';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import lusca from 'lusca';
import path from 'path';
import { logger, SESSION_SECRET } from './api-infrastructure';

import 'core-js/fn/array/flat-map';

import * as api from './api';
import { CONFIG } from './config';

const host = express();

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

const server = host.listen(CONFIG.port, CONFIG.hostnameToBind, () => {
  logger.info(`App is running at http://${CONFIG.hostnameToBind}:${CONFIG.port} in ${CONFIG.environment} mode`);
  logger.info('Press CTRL-C to stop\n');
});

export default server;
