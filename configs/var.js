const path = require('path');

// import .env variables
require('dotenv').config({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../env.example'),
});

module.exports = {
    port: process.env.PORT
};