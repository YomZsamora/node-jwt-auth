const { getUserGroups, getUserPermissions } = require('../../utils/user-helpers');
const UserGroup = require('../../models/authentication/user-group');
const Permission = require('../../models/authentication/permission');
const GroupPermission = require('../../models/authentication/group-permission');

// Mock the Sequelize models
jest.mock('../../models/authentication/user-group');
jest.mock('../../models/authentication/permission');
jest.mock('../../models/authentication/group-permission');

describe('User Helper Functions', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Clear any mock calls after each test
    });

    describe('getUserGroups', () => {
        it('should return an array of group IDs for a given user ID', async () => {
            const mockUserId = 1;
            const mockUserGroups = [
                { userId: mockUserId, groupId: 10 },
                { userId: mockUserId, groupId: 20 }
            ];
            

            UserGroup.findAll.mockResolvedValue(mockUserGroups);

            const result = await getUserGroups(mockUserId);

            expect(UserGroup.findAll).toHaveBeenCalledWith({ where: { userId: mockUserId } });
            expect(result).toEqual([10, 20]);
        });

    });

    
});
