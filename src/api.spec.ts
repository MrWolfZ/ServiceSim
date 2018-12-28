import express, { Express } from 'express';
import request from 'supertest';
import { api, initializeAsync } from './api';

describe('simulation', () => {
  let rootApp: Express;
  let shutdown: () => void;

  beforeEach(async () => {
    rootApp = express();
    rootApp.use(api);

    shutdown = await initializeAsync();
  });

  afterEach(() => {
    shutdown();
  });

  it('should return 204 for simulation with default configuration', async () => {
    return request(rootApp).get('/simulation').expect(204);
  });
});
