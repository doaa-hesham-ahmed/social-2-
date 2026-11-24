import Mailjet from "node-mailjet";
import { INotifictionProvider } from "./notification.interface";


interface IMailjetConfig {
    apiKey:string;
    apiSecret:string;
    fromEmail:string;
    fromName:string;

}

export class MailjetProvider implements INotifictionProvider {
 private client:Mailjet;
 private readonly fromEmail:string;
 private readonly fromName:string;
  constructor(config:IMailjetConfig) {
    this.client = new Mailjet({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    });

    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }
  async send(to:string, title:string, body:string) {
       await this.client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.fromEmail,
            Name: this.fromName,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: title,
          HTMLPart: body,
        },
      ],
    });
  }
}
