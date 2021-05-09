import IUserRole from '../../interfaces/account/IUserRole';
import IUserType from '../../interfaces/account/IUserType';
import UserModel from './UserModel';
import UserCreateModel from '../../models/account/UserCreateModel';
class CurrentUserModel extends UserModel {

    id: number;
    email: string;
    firstName: string;   
    role: IUserRole;
    registered: Date;
    lastName?: string;
    position: string;
    activated?: Date;

    public constructor(
        id: number,
        email: string,
        firstName: string,        
        registered: Date,
        role: IUserRole,
        position: string,
        lastName: string,
        activated? : Date
    ){
        super(
            id,firstName,registered,role,position,lastName,email
        )
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.role = role;
        this.registered = registered;
        this.lastName = lastName;
        this.position = position;
    }

    get roleId() {
        return this.role ? this.role.id  : undefined;
    }

    public static fromUserModel(model:UserModel,email:string){
        return new this(
            model.id,email,model.firstName,model.registered,model.role,model.position,model.lastName || ''
        )
    }
    public static fromUserCreateModel(id:number, model:UserCreateModel, email:string, created:Date = new Date){
        return new this(
            id,
            model.email || email,
            model.firstName,
            created,
            model.role,
            model.position,
            model.lastName
            )
    }
}

export default CurrentUserModel;