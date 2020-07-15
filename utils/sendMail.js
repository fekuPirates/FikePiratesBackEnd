const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "quickcodedroid@gmail.com",
    pass: "123@quickcodedroid",
  },
});

const sendMail = (to, subject, html) => {
  return transporter.sendMail({
    from: "quickcodedroid@gmail.com",
    to: to,
    subject: subject,
    html: html,
  });
};

module.exports = sendMail;
