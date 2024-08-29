const User = require('../models/authentication/user');

beforeEach(async () => {
    try {
        console.log('Syncing User model...');
        await User.sync({ force: true });
        console.log('User model synced successfully.');
        
        // Insert mock users
        await User.bulkCreate([
            {
                email: 'test1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'password123',
            },
            {
                email: 'test2@example.com',
                firstName: 'Jane',
                lastName: 'Doe',
                password: 'password123',
            },
        ]);
    } catch (error) {
        console.error('Error during setup:', error);
    }
});

afterEach(async () => {
    try {
        await User.drop({ cascade: true });
        console.log('User table dropped.');
    } catch (error) {
        console.error('Error during teardown:', error);
    }
});
