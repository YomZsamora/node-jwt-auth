const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize'); 

const UserGroup = sequelize.define('UserGroup', {
    
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'groups',
            key: 'id',
        },
    },
}, {
    tableName: 'user_groups',
    timestamps: false,
});

module.exports = UserGroup;