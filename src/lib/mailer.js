const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "961dde13be5e4e",
    pass: "9690d23a664172"
  }
});

  module.exports = transport;