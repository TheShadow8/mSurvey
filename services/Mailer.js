const sendgrip = require("sendgrid");
const helper = sendgrip.mail;
const keys = require("../config/keys");

class Mailer extends helper.Mail {}
