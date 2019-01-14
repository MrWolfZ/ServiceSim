import express, { Express } from 'express';
import { Subscription } from 'rxjs';
import request from 'supertest';
import { api, initialize } from './api';
import { CONFIG } from './config';

describe('simulation', () => {
  let rootApp: Express;
  let subscription: Subscription;

  beforeEach(async () => {
    rootApp = express();
    rootApp.use(api);

    subscription = await initialize({
      ...CONFIG,
      persistence: { adapter: 'InMemory', adapterConfig: {} },
      eventPersistence: { adapter: 'InMemory', adapterConfig: {} },
    });
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should return 404 for simulation with default configuration', async () => {
    return request(rootApp).get('/simulation').expect(404);
  });
});
