const request = require('supertest');
const app = require('../../../index');

describe('Fetch User Details with Permissions', () => {

    let testUser, token;

    beforeAll(async () => {
        testUser = await createUser('test2@example.com', 'Jane', 'Doe', 'password123', ['view_user']);
        token = generateToken(testUser); // Ensure this function generates a JWT with the correct payload
    });

    it('should fetch user details if user has the "view_user" permission', async () => {
        const response = await request(app)
            .get(`/v1/user/${testUser.id}/details`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'User details retrieved successfully.');
        expect(response.body).toHaveProperty('data');

        const userData = response.body.data;
        expect(userData).toHaveProperty('userId', testUser.id);
        expect(userData).toHaveProperty('firstName', testUser.firstName);
        expect(userData).toHaveProperty('lastName', testUser.lastName);
        expect(userData).toHaveProperty('lastLogin');
    });

    it('should return a PermissionDenied error if user lacks the "view_user" permission', async () => {
        const otherUser = await createUser('test3@example.com', 'John', 'Smith', 'password123', []);
        const otherToken = generateToken(otherUser);

        const response = await request(app)
            .get(`/v1/user/${testUser.id}/details`)
            .set('Authorization', `Bearer ${otherToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'You do not have permission to perform this action.');
    });

    it('should return a NotFound error if user does not exist', async () => {
        const response = await request(app)
            .get(`/v1/user/9999/details`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', "The requested 'User' does not exist.");
    });

    it('should return a NotAuthenticated error if token is missing', async () => {
        const response = await request(app)
            .get(`/v1/user/${testUser.id}/details`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Authentication is required to access this resource.');
    });

    it('should return a NotAuthenticated error if token is invalid', async () => {
        const response = await request(app)
            .get(`/v1/user/${testUser.id}/details`)
            .set('Authorization', 'Bearer invalidtoken123');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Invalid token.');
    });
});
