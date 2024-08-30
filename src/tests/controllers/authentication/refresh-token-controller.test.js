const request = require('supertest');
const app = require('../../../index'); 
const { createUser } = require('../../setupFilesAfterEnv');

describe('Token Refresh', () => {

    it('should return 400 if refreshToken is not provided', async () => {
        const response = await request(app)
            .post('/v1/auth/refresh-token')
            .send({}); 

        expect(response.body).toHaveProperty('code', 400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'An error occurred refreshing token.');
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ refreshToken: 'Refresh token is required.' })
            ])
        );
    });

    it('should return 400 if refreshToken is invalid', async () => {
        const response = await request(app)
            .post('/v1/auth/refresh-token')
            .send({ refreshToken: 'invalidtoken' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Invalid or expired refresh token.');
    });

    
});
