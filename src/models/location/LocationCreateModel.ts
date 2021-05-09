import ILocation from '../../interfaces/location/ILocation';
import IUser from '../../interfaces/account/IUser';

class LocationCreateModel implements ILocation {

    user: IUser;
    longitude: number;
    latitude: number;
    accuracy : number;
    street: string;
    city : string;
    country?: string;
    name?: string;
    postalCode?: string;
    region?: string;    

    constructor(
        user:IUser,
        longitude: number,
        latitude: number,
        accuracy : number,
        street: string,
        city : string,
        country: string,
        name : string,
        postalCode: string,
        region: string

        ){
            this.user = user;
            this.longitude  = longitude;
            this.latitude   = latitude;
            this.accuracy   = accuracy ;
            this.city       = city;
            this.country   = country ;
            this.name       = name;
            this.postalCode = postalCode;
            this.region     = region;
            this.street     = street;

    }

    public get userId(){
        return this.user.id;
    }

    public static fromDatabaseValues(r:any):LocationCreateModel{
        return new this(r.user,r.location.longitude,r.location.latitude,r.location.accuracy,r.location.street,r.location.city,r.location.country,r.location.name,r.location.postalCode,r.location.region)
    }

}

export default LocationCreateModel;