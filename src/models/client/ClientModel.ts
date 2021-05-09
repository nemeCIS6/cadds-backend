import IExistingClient from '../../interfaces/client/IExistingClient';

export default class ClientModel implements IExistingClient {
    id: number;
    email: string;
    name: string;
    address: string;
    phone: string;

    constructor(
        id: number,
        email: string,
        name: string,
        address: string,
        phone: string
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.address = address;
        this.phone = phone;
    }

    public static fromDatabaseValues(c:any):ClientModel{
        return new this(c.uid,c.email,c.name,c.address,c.string);
    }
}