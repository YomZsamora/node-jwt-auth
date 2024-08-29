const UserGroup = require('../models/authentication/user-group');
const Permission = require('../models/authentication/permission');
const GroupPermission = require('../models/authentication/group-permission');

async function getUserGroups(userId) {
    console.log("-------------------------CODE-CURRENT-STATUS-15---------------------------------");
    const userGroups = await UserGroup.findAll({ where: { userId } });
    console.log("-------------------------CODE-CURRENT-STATUS-20---------------------------------");
    return userGroups.map(userGroup => userGroup.groupId);
}

async function getUserPermissions(userId) {
    console.log("-------------------------CODE-CURRENT-STATUS-10---------------------------------");
    const groups = await getUserGroups(userId);
    const groupPermissions = await GroupPermission.findAll({ where: { groupId: groups} });
    const permissionIds = groupPermissions.map(gp => gp.permissionId);
    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    return permissions.map(p => p.codeName);
}

module.exports = { getUserGroups, getUserPermissions };