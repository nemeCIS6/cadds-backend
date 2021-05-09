import IUserRole from './IUserRole';

export default interface IUser {
    id?: number;
    email?: string;

    firstName: string;   
    position: string;
    roleId?: number;
    role: IUserRole;
    registered?: Date;

    lastName?: string;

    toObj?: () => {};    
}