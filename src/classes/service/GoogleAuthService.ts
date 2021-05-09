/* const settings =  require('../../settings');
import awaitReadyBase from '../common/awaitReadyBase';
import {OAuth2Client} from 'google-auth-library';
import Session from '../../models/account/UserSessionModel';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import accountService from './accountService';
import CurrentUserModel from '../../models/account/CurrentUserModel';
import ILocation from '../../interfaces/location/ILocation';
const log = require('../log');

class GoogleAuthService extends awaitReadyBase {

    private client:OAuth2Client;

    constructor() {
        super();
        this.client = new OAuth2Client(settings.googleSignin.OAuth2ClientId);
    }

    async SignInAsync(idToken:string, pushNotificationToken?:string, location?:ILocation) :Promise<false|Session>{
        await accountService.ReadyAsync();
        try{
            let ticket = await this._verifyUserAsync(idToken);
            if(!ticket){
                throw({message: 'Invalid idToken', data: {idToken}});
            }
            let payload = ticket.getPayload();
            if(!payload || !payload.email){
                throw({message: "Invalid google account"});
            }
            let account = await accountService.getByEmailAsync(payload.email);
            const googleType = accountService.types.getByValue('google');
            if(!account){
                account = await accountService.createAccountAsync(payload.email,payload.given_name || payload.email,payload.family_name || '',Math.ceil(10000 * Math.random()) + new Date().getTime() + 'asdasd' + payload.sub,'user',googleType);
                if(!account){
                    throw({message: `Unknown Error creating account for ${payload.email}`});
                }
            }
            else if(account.type.id !== googleType.id){
                let type = account.type.name === 'native' ? 'email' : account.type.name;                
                throw({message: `Account is active using the ${type} login method. Click on the ${type} login instead.`});
            }
            const user = CurrentUserModel.fromUserModel(account,payload.email);

            const session = await accountService.createSessionAsync(user, pushNotificationToken, location);
            return session;
        }
        catch(e){
            log.error(e);
            throw({message:  e.message || 'UNKNOWN ERROR', data: {idToken}});
        }

    }

    private async _verifyUserAsync(idToken:string):Promise<false|LoginTicket>{
        try{
            const {iOSEXPOAppId,AndroidEXPOAppId,iOSAppId,AndroidAppId} = settings.googleSignin;
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: [iOSEXPOAppId,AndroidEXPOAppId,iOSAppId,AndroidAppId]
            });
            return ticket;
        }
        catch(e){
            log.error(e);
             return false;
        }
    }

}

export default new GoogleAuthService(); */