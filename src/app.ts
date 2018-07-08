import express from 'express';

import * as apiController from './controllers/api';
import { InMemoryPersistenceAdapter, setAdapter } from './infrastructure/persistence/persistence';

// TODO: set adapter based on configuration
setAdapter(new InMemoryPersistenceAdapter());

const app = express.Router();

app.get('/api', apiController.getApi);

export default app;
