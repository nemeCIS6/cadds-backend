import UserModel from './UserModel';
import IUserSession from '../../interfaces/account/IUserSession';
import ILocation from '../../interfaces/location/ILocation';
import accountService from '../../classes/service/accountService';
const settings = require('../../settings');

export class UserSessionModel implements IUserSession{

    id: string;
    uid?: number;
    validUntil: Date;
    started: Date;
    user: UserModel;
    pushNotificationToken?: string;
    location?: ILocation;
    constructor(
        user:UserModel,
        id:string, 
        uid:number,
        started:Date, 
        validUntil:Date, 
        pushNotificationToken?:string,
        location?:ILocation,
        public distance?:number
        ){
        this.user = user;
        this.id = id;
        if(uid){
            this.uid = uid;
        }
        this.validUntil = validUntil;
        this.started = started;
        this.pushNotificationToken = pushNotificationToken;
        this.location = location;
    }

    toObj = ():any => {

        const user = this.user.toObj ? this.user.toObj() : this.user;

        return {
            user,
            [`${settings.authenticationTokenName}`]:this.id,
            uid:this.uid,
            started: this.started,
            validUntil: this.validUntil,
            pushNotificationToken: this.pushNotificationToken,
            location: this.location
        }
    }

    public static async fromDatabaseAsync(dbobj:{[key:string]:any},showEmail = false){
        await accountService.ReadyAsync();
        const user = new UserModel(
            parseInt(dbobj.user),
            dbobj.first_name,
            new Date(parseInt(dbobj.registered) / .001 ),
            accountService.roles.getById(dbobj.role_id),
            dbobj.position,
            dbobj.last_name,
            dbobj.email,
            new Date(parseInt( dbobj.activated) / .001 ),
            showEmail
        )

        return new this(
            user,
            dbobj.session_id,
            parseInt(dbobj.uid),
            new Date(parseInt(`${dbobj.started}`) / .001),
            new Date(parseInt(`${dbobj.valid_until}`) / .001),
            dbobj.push_token,
            parseInt(dbobj.last_location?.x) && parseInt(dbobj.last_location?.y) ? 
            {longitude: parseFloat(dbobj.last_location.x),latitude: parseFloat(dbobj.last_location?.y)}
            : undefined,
            dbobj.location_distance !== undefined ? parseInt( dbobj.location_distance) : undefined
        )
    }

}

export default UserSessionModel;