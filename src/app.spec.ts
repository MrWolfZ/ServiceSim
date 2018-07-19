import express, { Express } from 'express';
import request from 'supertest';
import app, { initializeAsync } from './app';

describe('simulation', () => {
  let rootApp: Express;
  let shutdown: () => void;

  beforeEach(async () => {
    rootApp = express();
    rootApp.use(app);

    shutdown = await initializeAsync();
  });

  afterEach(() => {
    shutdown();
  });

  it('should return 204 for simulation with default configuration', async () => {
    return request(rootApp).get('/simulation').expect(204);
  });
});
