import request from 'supertest';
import host from './host';

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(host).get('/reset')
      .expect(404, done);
  });
});
