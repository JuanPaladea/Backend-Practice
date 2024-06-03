import nodemailer from 'nodemailer';
import { EMAIL, PASSWORD } from './config.js';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

export default transport; 