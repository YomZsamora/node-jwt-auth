const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/sequelize');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Dockerized Node.js App!');
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log('Error: ' + err));

module.exports = app;