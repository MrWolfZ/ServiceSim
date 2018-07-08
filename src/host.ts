import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import lusca from 'lusca';
import path from 'path';
import { SESSION_SECRET } from './util/secrets';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

import app from './app';

const host = express();

host.set('port', process.env.PORT || 3000);
host.use(compression());
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

host.use(app);

export default host;
