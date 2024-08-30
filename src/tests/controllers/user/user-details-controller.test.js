const request = require('supertest');
const app = require('../../../index');
const { createUser, generateTestAuthToken } = require('../../setupFilesAfterEnv');

describe('Fetch User Details with Permissions', () => {

    let authorizedUser, unauthorizedUser, accessToken;

    beforeAll(async () => {
        authorizedUser = await createUser('banton@example.com', 'Buju', 'Banton', 'password123');
        unauthorizedUser = await createUser('castro@example.com', 'Fidel', 'Castro', 'password123');
        accessToken = await generateTestAuthToken(authorizedUser, ["view_user"]); 
    });

    it('should return a NotAuthenticated error if token is missing', async () => {
        const response = await request(app)
            .get(`/v1/user/${authorizedUser.id}/details`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Authentication credentials were not provided.');
    });

    it('should return a PermissionDenied error if user lacks the "view_user" permission', async () => {
        
        unauthorizedAccessToken = await generateTestAuthToken(unauthorizedUser, []); 

        const response = await request(app)
            .get(`/v1/user/${unauthorizedUser.id}/details`)
            .set('Authorization', unauthorizedAccessToken);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', "You don't have required permission to perform this action.");
    });

    it('should return a NotFound error if user does not exist', async () => {
        const response = await request(app)
            .get(`/v1/user/9999/details`)
            .set('Authorization', accessToken);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', "The requested 'User' does not exist.");
    });

    it('should return a NotAuthenticated error if token is invalid', async () => {
        const response = await request(app)
            .get(`/v1/user/${unauthorizedUser.id}/details`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Authentication credentials were not provided.');
    });
    
    it('should fetch user details if user has the "view_user" permission', async () => {
        const response = await request(app)
            .get(`/v1/user/${authorizedUser.id}/details`)
            .set('Authorization', accessToken);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'User details retrieved successfully.');
        expect(response.body).toHaveProperty('data');

        const userData = response.body.data;
        expect(userData).toHaveProperty('userId', authorizedUser.id);
        expect(userData).toHaveProperty('firstName', authorizedUser.firstName);
        expect(userData).toHaveProperty('lastName', authorizedUser.lastName);
        expect(userData).toHaveProperty('lastLogin');
        expect(userData).toHaveProperty('createdAt');
        expect(userData).toHaveProperty('updatedAt');
    });

});
