const request = require('supertest');
const app = require('../../../index'); // Adjust the path to your Express app
const User = require('../../../models/authentication/user');

describe('User Login', () => {
    it('should log in a user with valid credentials', async () => {
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({
            email: 'test1@example.com',
            password: 'password123',
        });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
    
    it('should fail to log in a user with invalid credentials', async () => {
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({
            email: 'test1@example.com',
            password: 'wrongpassword',
        });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });
});

