import express from 'express';
import request from 'supertest';
import api from './simulation.api';

describe('simulation', () => {
  const app = express();
  app.use(api);

  it('should return 404 if no predicates exist', async () => {
    return request(app).get('/').expect(404);
  });
});
