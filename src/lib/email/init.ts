
import { MailjetProvider } from "../../pkg/notification/mailjet";
import { env } from "../config/env";
import { NodeMailerProvider } from "../../pkg/notification/nodemailer";

export const mailjetProvider = new MailjetProvider({
    apiKey: env.mailjet.apiKey,
    apiSecret: env.mailjet.apiSecret,
    fromEmail: env.mailjet.fromEmail,
    fromName: env.mailjet.fromName,
});

export const nodemailerProvider = new NodeMailerProvider({
    user: env.nodemailer.user,
    password: env.nodemailer.mailPassword,
    host: env.nodemailer.host,
    port: env.nodemailer.port,
    fromEmail: env.nodemailer.fromEmail,
});
