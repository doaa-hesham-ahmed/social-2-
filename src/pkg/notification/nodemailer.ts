
import { createTransport, Transporter } from "nodemailer";
import {INotifictionProvider} from "./notification.interface";
interface INodemailerConfig {
    port: number;
    host: string;
    user: string;
    password: string;
    fromEmail: string;
}

export class NodeMailerProvider implements INotifictionProvider {
    private client: Transporter;
    private readonly fromEmail: string;

    constructor(config: INodemailerConfig) {
        this.client = createTransport({
            port: config.port,
            host: config.host,
            secure: true,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });

        this.fromEmail = config.fromEmail;
    }

    async send(to: string, title: string, body: string) {
        await this.client.sendMail({
            from: this.fromEmail,
            to: to,
            subject:title,
            html:body,
        });
    }
}
