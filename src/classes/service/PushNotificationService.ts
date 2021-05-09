// import awaitReadyBase from "../common/awaitReadyBase";
// import accountDatabase from '../db/accountDatabase';
// import accountService from './accountService';
// import Expo, { ExpoPushMessage } from 'expo-server-sdk';
// import { IPushNotificationData, IPushNotification } from "../../interfaces/common/IPushNotification";
// import JobModel from "../../models/job/JobModel";
// import IExistingUser from "../../interfaces/account/IExistingUser";
// import IUserSession from "../../interfaces/account/IUserSession";
// import IExistingJob from "../../interfaces/job/IExistingJob";
// const settings = require('./../../settings');
// const expo = new Expo();


// class PushNotificationService extends awaitReadyBase{

//     constructor(){
//         super();
//         this._ready = true;
//     }

//     async saveTokenAsync(pushNotificatinToken:string){
//         return await accountDatabase.savePushNotificationTokenAsync(pushNotificatinToken);
//     }
    
//     async getPushNotificationTokenByToken(pushNotificatinToken:string){
//         let result = await accountDatabase.getPushNotificationTokenByToken(pushNotificatinToken);
//         return result;
//     }

//     async sendNotifcationAsync(message:IPushNotification){
//         return await this.sendNotifcationsAsync([message]);
//     }

//     async sendNotifcationsAsync(messages:IPushNotification[]){

//         const pushMessages = messages.filter(m => {
//             if(Expo.isExpoPushToken(m.pushToken)){
//                 return true;
//             }
//             console.error(`${m.pushToken} is not a valid expo pushtoken, message is skipped`);
//             return false;
//         }).map((m):ExpoPushMessage => {
//             const {data,body,pushToken} = m;
//             return {
//                 to: pushToken,
//                 sound: 'default',
//                 body,  data
//             }
//         });
//         const chuncks = expo.chunkPushNotifications(pushMessages);
//         let tickets = [];
//         for(const chunk of chuncks){
//             try{
//                 const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//                 tickets.push(...ticketChunk);
//             }
//             catch(e){
//                 console.error(e);
//             }
//         }

//     }

//     /**
//      * 
//      * @param job Sends notifications about a new job to nearby users
//      */
//     async sendNewJobNotificationAsync(job:IExistingJob,userFilter:IExistingUser[] = []){
//         const {newJobRadius,userLimit,lastActivity} = settings.pushNotifications;
       
//         const nearbySessions = await accountService.listNearbySessionsAsync(job.location,newJobRadius,lastActivity,false,userFilter,0,userLimit);
//         const messages = nearbySessions.list.map(s => this._prepareNewJobNotification(job,s));
//         //a filter is somehow not accepted by TypeScript so we have to do it like this:
//         const messagesWithoutNulls:IPushNotification[] = [];
//         for(const message of messages){
//             message && messagesWithoutNulls.push(message);
//         }
//         return this.sendNotifcationsAsync(messagesWithoutNulls);
//     }

//     async sendJobApprovalNotificationAsync(job:IExistingJob){
//         await this.ReadyAsync();
//         const session = await accountService.getSessionAsync(job.user,true);
        
//         if(!session || !session?.pushNotificationToken){
//             return;
//         }
        
//         let message = `The job `;
//         if(job.location.city){
//             message += `in ${job.location?.street} ${job.location.city} `
//         }
//         message += ` you recently posted has been cleaned by ${job.user.firstName}. Please review it.`
//         await this.sendNotifcationAsync({
//             pushToken: session.pushNotificationToken,
//             body: message,
//             data: {
//                 reference: job.id,
//                 message,
//                 type: 'jobCleaned'
//             }
//         })
//     }

//     private _prepareNewJobNotification(job:IExistingJob,session:IUserSession):IPushNotification|false{
//         if(!session.pushNotificationToken){
//             return false;
//         }
//         const message = `There is a new job available ${session.distance ?? 9999} meters away!`;

//         return {
//             pushToken:session.pushNotificationToken,
//             body: message,
//             data: {
//                 reference: job.id,
//                 message,
//                 type: 'newJob'
//             }
//         }
//     }

// }

// export default new PushNotificationService;