const request = require('supertest');
const app = require('../../../index'); 
const { test_user } = require('../../setupFilesAfterEnv');

describe('Basic Login', () => {

    it('should authenticate a user with valid credentials', async () => {
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({
            email: 'test1@example.com',
            password: 'password123',
        });
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Logged in successfully.');
        expect(response.body).toHaveProperty('data');


        console.log(test_user);

        const userData = response.body.data;
        expect(userData).toHaveProperty('userId', test_user.id);
        expect(userData).toHaveProperty('firstName', 'John');
        expect(userData).toHaveProperty('lastName', 'Doe');
        expect(userData).toHaveProperty('accessToken');
        expect(userData).toHaveProperty('refreshToken');
    });
    
    it('should fail to authenticate a user with invalid credentials', async () => {
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

    it('should return an error when email and/or password are missing', async () => {
        const response = await request(app)
            .post('/v1/auth/basic-login')
            .send({});
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occured while logging in.');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ email: 'Valid email address is required.' }),
                expect.objectContaining({ password: 'Password is required.' })
            ])
        );
    });

    it('should return an error if the email is not registered', async () => {
        const response = await request(app)
            .post('/v1/auth/basic-login')
            .send({
                email: 'samaurah@gmail.com',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'samaurah@gmail.com does not exist.');
    });
});

