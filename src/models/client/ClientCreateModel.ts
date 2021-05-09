import IClient from '../../interfaces/client/IClient';

export default class ClientCreateModel implements IClient {
    id?: number;
    email: string;
    name: string;
    address: string;
    phone: string;

    constructor(
        email: string,
        name: string,
        address: string,
        phone: string,
        id?: number
    ) {
        this.id = id? id:undefined;
        this.email = email;
        this.name = name;
        this.address = address;
        this.phone = phone;
    }
}