export interface IPushNotificationData{
    type: string;
    reference: number|string;
    message: string;
    extra?: {[key:string]:any}
}

export interface IPushNotification {
    pushToken:string;
    body: string;
    data: IPushNotificationData;
}
