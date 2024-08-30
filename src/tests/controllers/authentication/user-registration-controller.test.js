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

    it('should return an error if email already exists', async () => {
        const response = await request(app)
            .post('/v1/auth/user-registration')
            .send({
                email: testUserEmail, 
                firstName: 'Jane',
                lastName: 'Doe',
                password: 'Password123!',
                passwordConfirm: 'Password123!',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occurred during registration.');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ email: `${testUserEmail} already exists. Please use a different email.` })
            ])
        );
    });

    it('should return an error if passwords do not match', async () => {
        const response = await request(app)
            .post('/v1/auth/user-registration')
            .send({
                email: 'test3@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'Password123!',
                passwordConfirm: 'DifferentPassword123!',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occurred during registration.');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ passwordConfirm: 'Passwords do not match.' })
            ])
        );
    });

    it('should return validation errors if required fields are missing', async () => {
        const response = await request(app)
            .post('/v1/auth/user-registration')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occurred during registration.');
        expect(response.body).toHaveProperty('data');

        // Expect errors for all required fields
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ email: 'Valid email address is required.' }),
                expect.objectContaining({ firstName: 'First name is required.' }),
                expect.objectContaining({ lastName: 'Last name is required.' }),
                expect.objectContaining({ password: 'Password is required.' }),
                expect.objectContaining({ passwordConfirm: 'Password confirmation is required.' })
            ])
        );
    });
    
});
