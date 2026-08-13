const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Your database host
  user: process.env.DB_USER,            // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME // The database you want to target
});

// Export the pool using CommonJS syntax
module.exports = connection;