const User = require('./authentication/user');
const RefreshToken = require('./authentication/refresh-token');
const Group = require('./authorization/group');
const UserGroup = require('./authorization/user-group');
const Permission = require('./authorization/permission');
const GroupPermission = require('./authorization/group-permission');

// User and RefreshToken: One-to-Many
User.hasMany(RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshTokens',
    onDelete: 'SET NULL', 
});
RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

// User and Group: Many-to-Many (through UserGroup)
User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: 'userId',
    otherKey: 'groupId',
    as: 'groups',
});
Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: 'groupId',
    otherKey: 'userId',
    as: 'users',
});

// Group and Permission: Many-to-Many (through GroupPermission)
Group.belongsToMany(Permission, {
    through: GroupPermission,
    foreignKey: 'groupId',
    otherKey: 'permissionId',
    as: 'permissions',
});
Permission.belongsToMany(Group, {
    through: GroupPermission,
    foreignKey: 'permissionId',
    otherKey: 'groupId',
    as: 'groups',
});


module.exports = {
    User,
    RefreshToken,
    Group,
    UserGroup,
    Permission,
    GroupPermission,
};
