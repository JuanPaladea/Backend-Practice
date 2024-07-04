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

export default transport; 