import IUser from '../../interfaces/account/IUser';
import IUserRole from '../../interfaces/account/IUserRole';

class UserCreateModel implements IUser {

    email:string;
    firstName: string;       
    lastName: string;
    passwordHash:string;
    position: string;
    role: IUserRole;
    activated? : Date;

    public constructor(
        email:string,
        passwordHash: string,
        firstName: string,        
        lastName: string,
        position: string,
        role:IUserRole,
        activated?:Date
    ){
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.email = email;
        this.position = position;
        this.activated = activated;
    }

}

export default UserCreateModel;