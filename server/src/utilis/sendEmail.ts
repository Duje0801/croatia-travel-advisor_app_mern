import nodemailer from "nodemailer";
import { Mail } from "../interfaces/mail";

export const sendEmail = async (code: string, email: string) => {
  //Sends a password recovery email
  const transport: nodemailer.Transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: Mail = {
    from: "Croatia Travel Advisor <admin@cta.com",
    to: email,
    subject: "Reset password - Croatia Travel Advisor",
    html: `<div>Token for email restart is: <b>${code}</b>.</div>
    <div>This code is only valid 10 minutes.</div>
    <div>If you have not requested a password restart, ignore this email.</div>`,
  };

  await transport.sendMail(mailOptions);
};
