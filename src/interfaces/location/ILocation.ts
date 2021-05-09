import IUser from './../account/IUser';

export default interface ILocation {
    id?: number;
    user?: IUser,
    userId? : number;
    longitude: number;
    latitude: number;
    accuracy? : number;
    city? : string;
    country?: string;
    name?: string;
    postalCode?: string;
    region?: string;
    street?: string;
}
