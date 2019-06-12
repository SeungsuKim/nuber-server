import Mailgun from "mailgun-js";

const mailgunClient = new Mailgun({
  apiKey: process.env.MAILGUN_KEY || "",
  domain: process.env.MAILGUN_DOMAIN || ""
});

const sendEmail = (subject: string, html: string) => {
  const emailData: Mailgun.messages.SendData = {
    from: "andrew.kim@dingbro.ai",
    to: "andrew.kim@dingbro.ai",
    subject,
    html
  };
  return mailgunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email`;
  const emailBody = `Click the following link to verify. <a href="http://nuber.com/verification/${key}/">Verify!</a>`;
  return sendEmail(emailSubject, emailBody);
};
