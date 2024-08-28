const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/sequelize');
const errorHandler = require('./utils/exceptions/exception-handler');
const authRoutes = require('./routes/authentication/auth-routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/v1/auth/', authRoutes);
app.use(errorHandler);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log('Error: ' + err));

module.exports = app;