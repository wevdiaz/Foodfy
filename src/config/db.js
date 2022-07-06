const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
    user: "postgres",
    password: process.env.PASSWORD_DB,
    host: "localhost",
    port: 5432,
    database: "foodfy2"
});