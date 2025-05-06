import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sender = {
    name: process.env.SENDER_NAME,
    email: process.env.SENDER_EMAIL,
};

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use true if port is 465
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASS,
    },
    logger: true,
    debugger: true,
});
