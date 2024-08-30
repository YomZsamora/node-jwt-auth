const request = require('supertest');
const app = require('../../../index'); 
const { createUser } = require('../../setupFilesAfterEnv');

describe('Token Refresh', () => {

    it('should return 400 if refreshToken is not provided', async () => {
        const response = await request(app)
            .post('/v1/auth/refresh-token')
            .send({}); // No refreshToken provided

        expect(response.body).toHaveProperty('code', 400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occurred refreshing token.');
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ refreshToken: 'Refresh token is required.' })
            ])
        );
    });

    
});
