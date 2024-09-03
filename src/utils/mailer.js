import nodemailer from 'nodemailer';
import { EMAIL, PASSWORD } from './config.js';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: EMAIL,
    to,
    subject: 'Backend JP - ' + subject,
    html: `<div>
      <h1>${subject}</h1>
      <p>${text}</p>	
      </div>`
  };

  transport.sendMail(mailOptions);
};