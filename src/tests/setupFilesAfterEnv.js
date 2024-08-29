const { User, RefreshToken, Group, UserGroup, Permission, GroupPermission } = require('../models/associations');

let test_user; // Define user object at a higher scope

beforeEach(async () => {

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

        test_user = await User.create({
            email: 'test1@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
        });
    } catch (error) {
        console.error('Error during setup:', error);
    }
});

module.exports = { test_user }
