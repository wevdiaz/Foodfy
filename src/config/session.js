const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
require("dotenv").config();

const db = require("./db");

module.exports = session({
    store: new pgSession({
        pool: db
    }),
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }

});