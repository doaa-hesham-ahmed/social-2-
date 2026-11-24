export interface INotifictionProvider {
    send(to: string, title: string, body: string): Promise<void>;
};