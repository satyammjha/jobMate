import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD 
    }
});