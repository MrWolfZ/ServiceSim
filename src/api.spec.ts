import express, { Express } from 'express';
import { Subscription } from 'rxjs';
import request from 'supertest';
import { api, initializeAsync } from './api';

describe('simulation', () => {
  let rootApp: Express;
  let subscription: Subscription;

  beforeEach(async () => {
    rootApp = express();
    rootApp.use(api);

    subscription = await initializeAsync();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should return 404 for simulation with default configuration', async () => {
    return request(rootApp).get('/simulation').expect(404);
  });
});
