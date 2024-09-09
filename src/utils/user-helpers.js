const UserGroup = require('../models/authentication/user-group');
const Permission = require('../models/authentication/permission');
const GroupPermission = require('../models/authentication/group-permission');

/**
* Retrieves user groups based on the provided user ID.
*
* @param {number} userId - The ID of the user to retrieve groups for.
* @returns {Promise<number[]>} An array of group IDs associated with the user.
*/
async function getUserGroups(userId) {
    const userGroups = await UserGroup.findAll({ where: { userId } });
    console.log("------------User-Group-Invoked-------");
    console.log(userGroups);
    return userGroups.map(userGroup => userGroup.groupId);
}

/**
* Retrieves permissions for a user based on the provided user ID.
*
* @param {number} userId - The ID of the user to retrieve permissions for.
* @returns {Promise<string[]>} An array of permission code names associated with the user.
*/
async function getUserPermissions(userId) {
    const groups = await getUserGroups(userId);
    const groupPermissions = await GroupPermission.findAll({ where: { groupId: groups} });
    const permissionIds = groupPermissions.map(gp => gp.permissionId);
    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    return permissions.map(p => p.codeName);
}

module.exports = { getUserGroups, getUserPermissions };
