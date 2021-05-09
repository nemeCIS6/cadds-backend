import ILocation from '../../interfaces/location/ILocation';

export default class LocationModel implements ILocation {

    id: number;
    longitude: number;
    latitude: number;
    street: string;
    city: string;
    country?: string;
    name?: string;

    constructor(
        id: number,
        longitude: number,
        latitude: number,
        street: string,
        city: string,
        country?: string,
        name?: string
    ) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;
        this.city = city;
        this.street = street;
        this.country = country || undefined;
        this.name = name;
    }
}