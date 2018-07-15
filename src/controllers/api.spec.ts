import request from 'supertest';
import host from '../host';

describe('GET /api', () => {
  it('should return 204 OK', async () => {
    return request(host).get('/api')
      .expect(204);
  });
});
