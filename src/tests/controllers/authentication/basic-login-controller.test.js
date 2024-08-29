const request = require('supertest');
const app = require('../../../index'); 
const { User } = require('../../../models/associations');

describe('Basic Login', () => {

    it('should authenticate a user with valid credentials', async () => {
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({
            email: 'test1@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Logged in successfully.');
        expect(response.body).toHaveProperty('data');

        const userData = response.body.data;
        expect(userData).toHaveProperty('userId', 1);
        expect(userData).toHaveProperty('firstName', 'John');
        expect(userData).toHaveProperty('lastName', 'Doe');
        expect(userData).toHaveProperty('accessToken');
        expect(userData).toHaveProperty('refreshToken');
    });
    
    it('should fail to log in a user with invalid credentials', async () => {
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({
            email: 'test1@example.com',
            password: 'wrongpassword',
        });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Invalid email and/or password.');
    });
});

