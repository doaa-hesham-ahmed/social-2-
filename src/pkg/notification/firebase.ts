import { INotifictionProvider } from "./notification.interface";
import { App, initializeApp, cert } from "firebase-admin/app";
import {getMessaging , Message } from "firebase-admin/messaging";

export class FirebaseProvider implements INotifictionProvider {
    private readonly client : App ;
    constructor(config:any){
         this.client = initializeApp({
       credential: cert(config)
       });
    }
   async send(to: string, title: string, body: string): Promise<void>{
       const message: Message = {
            token: to,
            notification :{
                title,
            }
       };
       await getMessaging (this.client).send(message)
   }
}