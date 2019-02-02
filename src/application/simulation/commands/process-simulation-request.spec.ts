import express from 'express';
import request from 'supertest';
import { processSimulationRequest } from './process-simulation-request';

describe('simulation', () => {
  const app = express();
  app.use(processSimulationRequest);

  it('should return 404 if no predicates exist', async () => {
    return request(app).get('/').expect(404);
  });
});
