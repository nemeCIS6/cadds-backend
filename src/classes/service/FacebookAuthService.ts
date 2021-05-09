/* const settings =  require('../../settings').facebook;
import awaitReadyBase from '../common/awaitReadyBase';
import UserSessionModel from '../../models/account/UserSessionModel';
import accountService from './accountService';
import CurrentUserModel from '../../models/account/CurrentUserModel';
import request from 'request-promise';
import ILocation from '../../interfaces/location/ILocation';
const log = require('../log');

class FacebookAuthService extends awaitReadyBase {

    constructor() {
        super();
    }

    async SignInAsync(idToken:string,pushNotificationToken?:string, location?:ILocation) :Promise<UserSessionModel>{
        await accountService.ReadyAsync();
        const fbUserId = await this._verifyUserAsync(idToken);
        if(!fbUserId){
            throw({message: "Invalid token or ",data: {idToken}});
        }
        try{
            const fbUser = await this._getUserInfoAsync(idToken,fbUserId);
            if(!fbUser){
                throw({message: "Facebook data insufficient for account creation/login"});
            }
            let account = await accountService.getByEmailAsync(fbUser.email);
            const facebookType = accountService.types.getByValue('facebook');
            if(!account){
                account = await accountService.createAccountAsync(fbUser.email,fbUser.first_name,fbUser.last_name || '',Math.ceil(10000 * Math.random()) + new Date().getTime() + 'asdasd' + fbUser.id,'user',facebookType);
                if(!account){
                    throw({message: `Unknown Error creating account for ${fbUser.email}`});
                }
            }
            else if(account.type.id !== facebookType.id){
                let type = account.type.name === 'native' ? 'email' : account.type.name;                
                throw({message: `Account is active using the ${type} login method. Click on the ${type} login instead.`});
            }
            const user = CurrentUserModel.fromUserModel(account,fbUser.email);

            const session = await accountService.createSessionAsync(user, pushNotificationToken, location);
            return session;
        }
        catch(e){
            throw({message: e.message || 'Unknown error', data: {idToken}});
        }

    }

    private async _verifyUserAsync(idToken:string):Promise<false|string>{
        try{
           let result = await request(
            {
                uri: 'https://graph.facebook.com/v3.3/debug_token',
                qs: {
                    input_token: idToken,
                    access_token: [settings.appId,settings.appSecret].join('|')
                }
            });
            if(typeof result === "string"){
                result = JSON.parse(result);
            }
            return result && result.data !== undefined && result.data.is_valid && result.data.user_id ? result.data.user_id : false;
            
        }
        catch(e){
            return false;
        }
    }

    private async _getUserInfoAsync(idToken:string,fbUserId:string|number):Promise<any>{
        try{
            let result = await request(
             {
                 uri: 'https://graph.facebook.com/v3.3/' + fbUserId,
                 qs: {
                     fields: ['first_name','last_name','email'].join(','),
                     access_token: idToken
                 }
             });
             if(typeof result === "string"){
                result = JSON.parse(result);
            }
             if(result && result.first_name && result.last_name && result.email){
                 return result;
             }
             return false;
         }
         catch(e){
             return false;
         }
    }

}

export default new FacebookAuthService(); */