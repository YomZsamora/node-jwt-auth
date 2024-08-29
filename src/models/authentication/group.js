const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize'); 

const Group = sequelize.define('Group', {

    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    tableName: 'groups',
});

module.exports = Group;
