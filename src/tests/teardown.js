const { Sequelize } = require('sequelize');
const { test } = require('../config/config.js');

module.exports = async () => {
    const sequelize = new Sequelize(test.database, test.username, test.password, {
        host: test.host,
        dialect: test.dialect,
    });
    
    try {
        await sequelize.authenticate();
        console.log('Connection to the test database has been established successfully.');
        await sequelize.query(`DROP DATABASE IF EXISTS \`${test.database}\`;`);
        console.log(`Database ${test.database} dropped.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};
