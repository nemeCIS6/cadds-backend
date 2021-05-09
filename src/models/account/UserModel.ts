import IExistingUser from '../../interfaces/account/IExistingUser';
import UserCreateModel from './UserCreateModel';
import IUserRole from '../../interfaces/account/IUserRole';
import IUserType from '../../interfaces/account/IUserType';
import accountService from '../../classes/service/accountService';
class UserModel implements IExistingUser {

    id: number;
    firstName: string;       
    registered: Date;
    lastName?: string;
    role: IUserRole;
    position: string;
    email: string;
    activated?: Date;
    showEmail: boolean = false;

    public constructor(
        id: number,
        firstName: string,        
        registered: Date,
        role: IUserRole,
        position: string,
        lastName: string,
        email:string,
        activated?:Date,
        showEmail = false
    ){
        this.id = id;
        this.firstName = firstName;
        this.registered = registered;
        this.lastName = lastName;
        this.role = role;
        this.position = position;
        this.email = email;
        this.activated = activated;
        this.showEmail = showEmail
    }


    get isAdmin() {
        return this.role.name.toLowerCase() === 'admin';
    }

    toObj = ():IExistingUser => {

        return {
            id: this.id,
            firstName: this.firstName,
            registered:this.registered,
            lastName: this.lastName,
            role: this.role,
            position: this.position,
            email: this.showEmail ? this.email : undefined
        }       
    }

    public static async fromDatabaseValuesAsync(r:any,showEmail:boolean=false){
        await accountService.ReadyAsync();
        return new this(
            r.id,
            r.first_name,
            new Date(parseInt(r.registered) / .001 ),
            accountService.roles.getById(r.role_id),
            r.position,
            r.last_name,
            r.email,
            r.activated,
            showEmail
        )
    }

    public static fromUserCreateModel(id:number, model:UserCreateModel, email:string, created:Date = new Date){
        return new this(
            id,model.firstName,created,model.role,model.lastName,model.position,model.email,model.activated
        )
    }
        
}

export default UserModel;