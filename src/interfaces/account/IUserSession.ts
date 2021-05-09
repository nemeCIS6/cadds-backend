import IExistingUser from './IExistingUser';
import ILocation from '../location/ILocation';

export default interface IUserSession {
    id: string;
    uid?: number;
    validUntil: Date;
    started: Date;
    user: IExistingUser;
    pushNotificationToken?: string;
    location?:ILocation;
}