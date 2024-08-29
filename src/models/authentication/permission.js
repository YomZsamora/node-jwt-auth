const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize'); 

const Permission = sequelize.define('Permission', {

    codeName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    tableName: 'permissions',
});

module.exports = Permission;