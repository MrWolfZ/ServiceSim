import express from 'express';
import request from 'supertest';
import { simulationApi } from './simulation.api';

describe('simulation', () => {
  const app = express();
  app.use(simulationApi);

  it('should return 404 if no predicates exist', async () => {
    return request(app).get('/').expect(404);
  });
});
