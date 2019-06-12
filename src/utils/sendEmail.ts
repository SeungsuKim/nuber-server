import Mailgun from "mailgun-js";

const mailgunClient = new Mailgun({
  apiKey: process.env.MAILGUN_KEY || "",
  domain: process.env.MAILGUN_DOMAIN || ""
});
