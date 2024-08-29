const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize'); 

const RefreshToken = sequelize.define('RefreshToken', {

    jti: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'refresh_tokens',
});

module.exports = RefreshToken;
