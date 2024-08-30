const request = require('supertest');
const app = require('../../../index');
const { createUser, generateTestAuthToken } = require('../../setupFilesAfterEnv');

describe('Fetch User Details with Permissions', () => {

    let testUser, accessToken;

    beforeAll(async () => {
        testUser = await createUser('banton@example.com', 'Buju', 'Banton', 'password123');
        accessToken = await generateTestAuthToken(testUser, ["view_user"]); 
    });

    it('should fetch user details if user has the "view_user" permission', async () => {
        const response = await request(app)
            .get(`/v1/user/${testUser.id}/details`)
            .set('authorization', accessToken);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'User details retrieved successfully.');
        expect(response.body).toHaveProperty('data');

        const userData = response.body.data;
        expect(userData).toHaveProperty('userId', testUser.id);
        expect(userData).toHaveProperty('firstName', testUser.firstName);
        expect(userData).toHaveProperty('lastName', testUser.lastName);
        expect(userData).toHaveProperty('lastLogin');
        expect(userData).toHaveProperty('createdAt');
        expect(userData).toHaveProperty('updatedAt');
    });


});
