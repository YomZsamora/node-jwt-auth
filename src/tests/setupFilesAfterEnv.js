const { User, RefreshToken, Group, UserGroup, Permission, GroupPermission } = require('../models/associations');
const { generateRefreshToken } = require('../utils/tokens');

beforeAll(async () => {

    try {
        // Sync tables in the correct order
        console.log('Dropping and syncing tables in the correct order...');

        // Drop tables in the correct order to avoid foreign key constraint issues
        await GroupPermission.drop();
        await Permission.drop();
        await UserGroup.drop();
        await Group.drop();
        await RefreshToken.drop();
        await User.drop();

        // Recreate tables in the correct order
        await User.sync({ force: true });
        await RefreshToken.sync({ force: true });
        await Group.sync({ force: true });
        await Permission.sync({ force: true });
        await UserGroup.sync({ force: true });
        await GroupPermission.sync({ force: true });

        console.log('All models synced successfully.');
    } catch (error) {
        console.error('Error during setup:', error);
    }
});

function generateTestAuthToken(user, permissions = []) {
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        permissions,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET_KEY, { algorithm: 'HS256' });
    return `Bearer ${token}`;
}

async function createUser(email, firstName, lastName, password) {
    const user = await User.create({ email, firstName, lastName, password });
    return user;
};

async function createRefreshToken(user) {
    const refreshToken = await generateRefreshToken(user);
    return refreshToken;
};

module.exports = {
    createUser,
    createRefreshToken,
    generateTestAuthToken
};

