const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "929595fffd6471",
    pass: "d630891bf85235"
  }
});

  module.exports = transport;