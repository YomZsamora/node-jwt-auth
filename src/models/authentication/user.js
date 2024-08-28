// src/models/authentication/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: (user) => {
            user.password = hashPassword(user.password);
        },
    },
});

User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password); // Compare hashed password with provided password
};

const hashPassword = (password) => {
    // Add your password hashing logic here, e.g., using bcrypt
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
};

module.exports = User;
