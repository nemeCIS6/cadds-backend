import DatabaseTypes from '../common/DatabaseTypes';
import IUserRole from '../../interfaces/account/IUserRole';

class UserRolesModel extends DatabaseTypes {
    
    protected _types:IUserRole[] = [];

    constructor(){
        super();
    }

}

export default UserRolesModel;