import express from 'express';

import * as apiController from './controllers/api';

const app = express.Router();

app.get('/api', apiController.getApi);

export default app;
