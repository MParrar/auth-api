const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (to, subject, text) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY_EMAIL,
  });

  const sentFrom = new Sender(
    "noreply@trial-7dnvo4dqd3rl5r86.mlsender.net",
    "noreply"
  );

  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setText(text);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmail };
