const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize'); 
const User = require('./user');
const Group = require('./group');

const UserGroup = sequelize.define('UserGroup', {
    
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id',
        },
    },
}, {
    tableName: 'user_groups',
});

module.exports = UserGroup;