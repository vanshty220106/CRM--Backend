const request = require('supertest');
const app = require('../app');

describe('Backend API Setup & Health', () => {
  it('should return 200 OK and status JSON on /api/health', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/api/unknown-route-123xyz');
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body.message).toMatch(/Cannot find/);
  });
});
