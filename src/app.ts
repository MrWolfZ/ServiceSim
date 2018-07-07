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

// Controllers (route handlers)
import * as apiController from './controllers/api';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET!,
}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

app.get('/api', apiController.getApi);

export default app;
