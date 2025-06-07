const request = require('supertest');
const app = require('../app/app');

describe('Chatbot API Tests', () => {
  describe('GET /', () => {
    it('should return the chatbot HTML page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('Chatbot Interface');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('POST /api/messages', () => {
    it('should store a message', async () => {
      const message = {
        message: 'Test message',
        sender: 'user'
      };

      const response = await request(app)
        .post('/api/messages')
        .send(message)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('response');
    });
  });
});