const settings = require('../../settings');
import trim from 'lodash';

const { sha256, md5 } = require('../../helpers/hashers');
const cc = require('../../helpers/objectKeysToCamelCase');

import accountDatabase from '../db/accountDatabase';
import cron from '../cron';
import awaitReadyBase from '../common/awaitReadyBase';
import IUserRole from '../../interfaces/account/IUserRole';
import UserModel from '../../models/account/UserModel';
import UserRolesModel from '../../models/account/UserRolesModel';
import UserCreateModel from '../../models/account/UserCreateModel';
import CurrentUserModel from '../../models/account/CurrentUserModel';
import {UserSessionModel} from '../../models/account/UserSessionModel';
import PagedListModel from '../../models/common/PagedListModel';
import IExistingUser from '../../interfaces/account/IExistingUser';
import BigNumber from 'bignumber.js';
import makeN from '../../helpers/makeN';
import emailService from './emailService';
//import pushNotificationService from './PushNotificationService';
import console = require('console');
import ILocation from '../../interfaces/location/ILocation';
import IUserSession from '../../interfaces/account/IUserSession';
import IUser from '../../interfaces/account/IUser';
const log = require('./../log');
/**
 *  
 * Provides CRUD methods to the endpoint that is related to Account
 * @class accountService
 */
class accountService extends awaitReadyBase {

    public roles: UserRolesModel = new UserRolesModel;

    constructor() {
        super();
        this._ready = false;
        cron.addJob(
            async () => {
                const [
                    accountRoles
                ] = await Promise.all([
                    this._getRolesAsync()
                ]);
                this.roles.set(accountRoles);
                if (!this._ready) {
                    this._ready = true;
                }
            },
            settings.cron.databaseTypeInterval
        )
    }

    async loginAsync(email: string, password: string): Promise<CurrentUserModel | false> {
        await this.ReadyAsync();
        let trimmedEmail = trim(email).toString(), trimmedPassword = trim(password).toString();
        let user = await accountDatabase.authorizeAsync(
            trimmedEmail,
            this.getPasswordHash(trimmedPassword)
        );
        if (user) {
            user = cc(user);
            let role = this.roles.getById(user.roleId);
            const rUser = new CurrentUserModel(
                user.id,
                user.email,
                user.firstName,
                new Date(user.registered * 1000),
                role,
                user.position,
                user.lastName,
                user.activated ? new Date(user.activated / .001) : undefined
            );
            return rUser;
        }
        return false;
    }

    async activateAsync(user: IExistingUser, activatedTime: Date = new Date()) {
        return await accountDatabase.activateAsync(user.id, activatedTime);
    }
    getPasswordHash(password: string): string {
        let { salt } = settings.crypto;
        let hash = sha256(password + salt);
        return sha256(salt + hash + password);
    }

    getActivationCode(user: IExistingUser, date?: Date): string {
        let { salt } = settings.crypto;
        let hash: string = md5(user.id + salt + user.id);
        if (date) {
            hash = md5(hash + user.id + date.getTime() + hash + user.id + salt);
        }
        let subHash = hash.substring(hash.length - 5);

        let bn = new BigNumber('0x' + subHash);
        let numbers = ('....' + bn.toFormat()).replace(/(\,|\.)/g, '');
        return makeN(numbers);
    }

    async createSessionAsync(user: CurrentUserModel, pushNotificationToken?: string, location?:ILocation): Promise<UserSessionModel> {
        const validity = settings.session.validity || 30;

        let { salt } = settings.crypto;
        let date = new Date();
        let validUntil = new Date(date.getTime() + validity * 86400000);
        let ms = date.getMilliseconds();
        let sessionId = sha256(salt + ms + user.id + Math.random() + (Math.random() * user.id));
        let uid;
/*         let pushNotificationTokenId = undefined;
        if (pushNotificationToken) {
            pushNotificationTokenId = await pushNotificationService.saveTokenAsync(pushNotificationToken);
            if (!pushNotificationTokenId) {
                let token = await pushNotificationService.getPushNotificationTokenByToken(pushNotificationToken);
                if (!token) {
                    pushNotificationTokenId = undefined;
                }
                else {
                    pushNotificationTokenId = token.id;
                }
            }
        } */
        uid = await accountDatabase.createSessionAsync(user.id, sessionId ,location /* , pushNotificationTokenId */);

        return new UserSessionModel(user, sessionId, uid, date, validUntil, pushNotificationToken, location);
    }

    async getByEmailAsync(email: string): Promise<false | UserModel> {
        let dbUser = await accountDatabase.getByEmailAsync(email);
        if (!dbUser) {
            return false;
        }
        let userReturn: UserModel = new UserModel(
            dbUser.id,
            dbUser.first_name,
            new Date(dbUser.registered * 1000),
            this.roles.getById(dbUser.role_id),
            dbUser.position,
            dbUser.last_name,
            email
        );

        userReturn.activated = dbUser.activated;
        return userReturn;
    }

    async createAccountAsync(
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        role: string | IUserRole,
        position: string,
        sendConfirmationEmail: boolean = false
    ): Promise<CurrentUserModel | false> {

        await this.ReadyAsync();
        if (typeof role === 'string') {
            role = this.roles.getByValue(role);
        }
        let createModel = new UserCreateModel(
            email, this.getPasswordHash(password), firstName, lastName, position, role
        );
        const userId = await accountDatabase.createAccountAsync(createModel);
        if (!userId) {
            return false
        }
        const newUser = CurrentUserModel.fromUserCreateModel(userId, createModel, email);
        if (sendConfirmationEmail) {
            let code = this.getActivationCode(newUser);
            try {
                emailService.sendConfirmationMailAsync(newUser, code);
            }
            catch (error) {
                throw ({ message: 'Cannot send email', error });
            }
        }
        return newUser;
    }

    async patchAsync(userId: number, patch: any): Promise<number | false> {
        let firstName: string | false = patch.firstName || false;
        let lastName: string | false = patch.lastName || false;
        let roleId: number | false = patch.roleId || false;
        let email: string | false = patch.email || false;
        let password: string | false = patch.newPassword ? this.getPasswordHash(patch.newPassword) : false;
        let birthday: Date | false = patch.birthday ? new Date(patch.birthday) : false;

        let userPatch: number | false = false;
        try {
            userPatch = await accountDatabase.patchAsync(userId, firstName, lastName, roleId, email, password, birthday);
        }
        catch (e) {
            console.log(e);
            throw ({ message: 'Error patching user' });
        }
        return userPatch;
    }

    async userExistsAsync(email: string): Promise<boolean> {
        const exists = await accountDatabase.userExistsAsync(email);
        return exists ? true : false;
    }
    async getSessionAsync(uid:number, getInactive?:boolean): Promise<UserSessionModel | false>
    async getSessionAsync(sessionId:string, getInactive?:boolean): Promise<UserSessionModel | false> 
    async getSessionAsync(user:IExistingUser,  getInactive?:boolean): Promise<UserSessionModel | false> 
    async getSessionAsync(identifier:IExistingUser|number|string,  getInactive = false): Promise<UserSessionModel | false> 
    {
        await this.ReadyAsync();
        let s:any = false;
        if(typeof identifier === 'object'&& 'id' in identifier){
            s = await accountDatabase.getSessionAsync(identifier.id,'userId',getInactive)
        }
        else if(typeof identifier === 'string'){
           s = await accountDatabase.getSessionAsync(identifier, 'sessionId',getInactive);
        }
        else{
            s = await accountDatabase.getSessionAsync(identifier, 'uid',getInactive)
        }        
        if (!s) {
            return false;
        }
        
        const session = await UserSessionModel.fromDatabaseAsync(s,true);
        return session || false;

    }

    async logoutAsync(sessionId: string) {
        return await accountDatabase.invalidateSessionAsync(sessionId);
    }

    async getAsync(id: number, showEmail: boolean = false): Promise<UserModel | null | false> {
        await this.ReadyAsync();
        let dbUser = await accountDatabase.getAsync(id);
        if (!dbUser) {
            return null;
        }
        return UserModel.fromDatabaseValuesAsync(dbUser, showEmail);
    }

    async listAsync(skip: number = 0, take: number = 25): Promise<PagedListModel<UserModel>> {
        let tasks = [
            accountDatabase.listAsync(
                skip,
                take
            ),
            accountDatabase.getListTotalsAsync()
        ];

        const [list, total] = await Promise.all(tasks);
        const userListTasks: Promise<UserModel>[] = list.map(
            (user: any): Promise<UserModel> => UserModel.fromDatabaseValuesAsync(user, true)
        );
        let userList: UserModel[] = [];

        for (let i = 0; i < userListTasks.length; i++) {
            userList.push(await userListTasks[i]);
        }

        return new PagedListModel(userList, skip, take, total);
    }

    public async createPasswordReset(user: IExistingUser, sendEmail: boolean = true) {
        let lastRequest = await this.getLastPasswordResetDateAsync(user);
        if (lastRequest) {
            let now = new Date();
            let newRequest = (lastRequest.getTime() + (settings.account.passwordReset.codeRequestIntervalInSeconds / .001))
            let difference = newRequest - now.getTime();

            if (difference > 0) {
                throw ({ message: `Please wait ${Math.round(Math.abs(difference) * .001)} seconds before requesting password reset again`, code: 429 });
            }
        }
        lastRequest = await accountDatabase.createPasswordResetAsync(user.id);
        if (!lastRequest) {
            throw ({ message: `Something went wrong creating password reset. If problem persists, please contact administrator` });
        }
        if (sendEmail) {
            try {
                let code = this.getActivationCode(user, lastRequest);
                emailService.sendResetPasswordEmailAsync(user, code, new Date(lastRequest.getTime() + (settings.account.passwordReset.codeValidityInHours * 60 * 60 * 1000)));
            }
            catch (e) {
                log.error(e);
                throw ({ message: "Unknown error sending the email" });
            }

        }
        return lastRequest;
    }

    public async getLastPasswordResetDateAsync(user: IExistingUser) {
        return await accountDatabase.getLastPasswordResetDateAsync(user.id);
    }

    public async sendActivationCodeAsync(user: IExistingUser, logActivationMessage: boolean = true) {
        let lastRequest = await accountDatabase.getLastActivationMessageAsync(user.id);
        if (lastRequest) {
            let now = new Date();
            let newRequest = (lastRequest.getTime() + (settings.account.activation.codeRequestIntervalInSeconds / .001))
            let difference = newRequest - now.getTime();

            if (difference > 0) {
                throw ({ message: `Please wait ${Math.round(Math.abs(difference) * .001)} seconds before requesting code again`, code: 429 });
            }
        }
        let code = this.getActivationCode(user);
        emailService.sendConfirmationMailAsync(user, code);
        if (logActivationMessage) {
            accountDatabase.logActivationMessageAsync(user.id, new Date())
        }
        return true;
    }

    public async resetPasswordAsync(user: IExistingUser, code: string, newPassword: string): Promise<boolean> {
        await this.ReadyAsync();
        let lastRequest = await this.getLastPasswordResetDateAsync(user);
        if (!lastRequest) {
            throw ({ message: `Your code has expired. Please request a new code.`, code: 419 });
        }
        let now = new Date();
        let difference = now.getTime() - lastRequest.getTime();
        if (difference > settings.account.passwordReset.codeValidityInHours * 60 * 60 * 1000) {
            throw ({ message: `Your code has expired. Please request a new code.`, code: 419 });
        }
        let validateCode = this.getActivationCode(user, lastRequest);
        if (parseInt(validateCode) !== parseInt(code)) {
            throw ({ message: `Code ${code} is invalid. If you requested a new code, check if this is the last one received.`, code: 498 });
        }
        let passwordHash = this.getPasswordHash(newPassword);
        let success = await accountDatabase.updatePasswordAsync(user.id, passwordHash);
        return success ? true : false;
    }

    public async updateSessionAsync(session:IUserSession, location?:ILocation){
        if(!session.uid){
            throw {message: "Cannot update session w/o uid"}
        }
        try{
            return await accountDatabase.updateSessionAsync(session.uid,location ? {longitude:location.longitude, latitude:location.latitude}: undefined);
        }
        catch(e){
            console.error(e);
        }
    }

    private async _getRolesAsync(): Promise<IUserRole[]> {
        const roles = await accountDatabase.getRolesAsync();
        return roles;
    }

}
let as = new accountService();
export default as;