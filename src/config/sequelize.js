/**
* Establishes a connection to a MySQL database using Sequelize ORM.
* Database credentials are sourced from environment variables using the 'dotenv' package.
*/

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance with database configuration from environment variables
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
});

// Authenticate the database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log('Error: ' + err));

module.exports = sequelize;
