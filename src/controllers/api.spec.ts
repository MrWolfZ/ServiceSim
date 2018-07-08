import request from 'supertest';
import host from '../host';

describe('GET /api', () => {
  it('should return 200 OK', () => {
    return request(host).get('/api')
      .expect(200);
  });
});
