/**
* Establishes a connection to a MySQL database using Sequelize ORM.
* Database credentials are sourced from environment variables using the 'dotenv' package.
*/

const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// Create a new Sequelize instance with database configuration from environment variables
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

// Authenticate the database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log('Error: ' + err));

module.exports = sequelize;
