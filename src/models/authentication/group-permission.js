const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize'); 

const GroupPermission = sequelize.define('GroupPermission', {

    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'groups',
            key: 'id',
        },
    },
    permissionId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'permissions',
            key: 'id',
        },
    },
}, {
    tableName: 'group_permissions',
    timestamps: false,
});

module.exports = GroupPermission;