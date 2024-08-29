const request = require('supertest');
const app = require('../../../index'); 
const User = require('../../../models/authentication/user');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/tokens');

jest.mock('../../../models/authentication/user');
jest.mock('../../../utils/tokens');

describe('POST /v1/auth/basic-login', () => {
    
    it('should return 400 if the user does not exist', async () => {
        User.findOne.mockResolvedValue(null);
        
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'nonexistent@example.com does not exist.');
    });
    
    it('should return 400 if the password is invalid', async () => {
        User.findOne.mockResolvedValue({ isValidPassword: jest.fn().mockResolvedValue(false) });
        
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({ email: 'existing@example.com', password: 'wrongpassword' });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid email and/or password.');
    });
    
    it('should return 200 and tokens if login is successful', async () => {
        User.findOne.mockResolvedValue({
            id: 1,
            firstName: 'Yommie',
            lastName: 'Samora',
            lastLogin: new Date(),
            isValidPassword: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(),
        });
        generateAccessToken.mockResolvedValue('mockAccessToken');
        generateRefreshToken.mockResolvedValue('mockRefreshToken');
        
        const response = await request(app)
        .post('/v1/auth/basic-login')
        .send({ email: 'existing@example.com', password: 'correctpassword' });
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('accessToken', 'mockAccessToken');
        expect(response.body.data).toHaveProperty('refreshToken', 'mockRefreshToken');
    });
    
});
