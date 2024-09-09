const request = require('supertest');
const app = require('../../../index'); 
const { extractTokenPayload } =  require('../../../utils/tokens');
const { RefreshToken } = require('../../../models/associations');
const { createUser, createRefreshToken } = require('../../setupFilesAfterEnv');

describe('Token Refresh', () => {
    
    let testUser;
    let refreshToken;
    
    beforeAll(async () => {
        testUser = await createUser('john@example.com', 'John', 'Doe', 'password123');
        refreshToken = await createRefreshToken(testUser);
    });
    
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
    
    it('should return 401 if refreshToken is invalid', async () => {
        const response = await request(app)
        .post('/v1/auth/refresh-token')
        .send({ refreshToken: 'invalidtoken' });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Authentication credentials were not provided.');
    });
    
    it('should return 400 if refreshToken has expired', async () => {
        
        tokenPayload = extractTokenPayload(refreshToken);
        await RefreshToken.update(
            { expiryDate: new Date(Date.now() - 3600000) },
            { where: { jti: tokenPayload.jti } },
        );
        
        const response = await request(app)
            .post('/v1/auth/refresh-token')
            .send({ refreshToken });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Refresh token has expired.');
    });
    
    it('should return 200 and new tokens if refreshToken is valid', async () => {
        
        tokenPayload = extractTokenPayload(refreshToken);
        await RefreshToken.update(
            { expiryDate: new Date(Date.now() + 3600000) },
            { where: { jti: tokenPayload.jti } },
        );

        const response = await request(app)
            .post('/v1/auth/refresh-token')
            .send({ refreshToken });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Token refreshed successfully.');
        expect(response.body.data).toHaveProperty('userId', testUser.id);
        expect(response.body.data).toHaveProperty('firstName', testUser.firstName);
        expect(response.body.data).toHaveProperty('lastName', testUser.lastName);
        expect(response.body.data).toHaveProperty('lastLogin');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return 400 if refreshToken has been deleted', async () => {
        
        tokenPayload = extractTokenPayload(refreshToken);
        await RefreshToken.destroy(
            { where: { jti: tokenPayload.jti } },
        );
        
        const response = await request(app)
            .post('/v1/auth/refresh-token')
            .send({ refreshToken });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Invalid refresh token.');
    });
    
});
