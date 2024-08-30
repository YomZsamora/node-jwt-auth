const request = require('supertest');
const app = require('../../../index'); 

describe('User Registration', () => {
    
    let testUserEmail = 'adzumi@example.com';
    
    it('should successfully register a new user with valid details', async () => {
        const response = await request(app)
        .post('/v1/auth/user-registration')
        .send({
            email: testUserEmail,
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'Password123!',
            passwordConfirm: 'Password123!',
        });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('code', 201);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', `${testUserEmail} has been successfully registered.`);
        expect(response.body).toHaveProperty('data');
        
        const userData = response.body.data;
        expect(userData).toHaveProperty('userId');
        expect(userData).toHaveProperty('email', testUserEmail);
        expect(userData).toHaveProperty('firstName', 'Jane');
        expect(userData).toHaveProperty('lastName', 'Doe');
        expect(userData).toHaveProperty('createdAt');
        expect(userData).toHaveProperty('updatedAt');
    });
    
});
