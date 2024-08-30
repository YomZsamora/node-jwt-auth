const request = require('supertest');
const app = require('../../../index'); 
const { User } = require('../../../models/authentication/user');

describe('User Registration', () => {
    
    let testUserEmail = 'adzumi@example.com';
    
    it('should successfully register a new user with valid details', async () => {
        const response = await request(app)
        .post('/v1/auth/user-registration')
        .send({
            email: testUserEmail,
            firstName: 'Olunga',
            lastName: 'Mike',
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
        expect(userData).toHaveProperty('firstName', 'Olunga');
        expect(userData).toHaveProperty('lastName', 'Mike');
        expect(userData).toHaveProperty('createdAt');
        expect(userData).toHaveProperty('updatedAt');
    });

    it('should return an error if email already exists', async () => {
        const response = await request(app)
            .post('/v1/auth/user-registration')
            .send({
                email: testUserEmail, 
                firstName: 'Mary',
                lastName: 'Jane',
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
                firstName: 'Domani',
                lastName: 'Munga',
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

    it('should return an error if the password is too short', async () => {
        const response = await request(app)
            .post('/v1/auth/user-registration')
            .send({
                email: 'test4@example.com',
                firstName: 'Khaligraph',
                lastName: 'Jones',
                password: 'pass',
                passwordConfirm: 'pass',
            });
        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occurred during registration.');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ password: 'Password must be at least 6 characters long.' })
            ])
        );
    });
});
