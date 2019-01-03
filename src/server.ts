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

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

import * as api from './api';

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

api.initializeAsync().then(sub => {
  process.on('SIGTERM', () => {
    sub.unsubscribe();
  });
});

host.use(errorHandler());

const server = host.listen(host.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    host.get('port'),
    host.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
