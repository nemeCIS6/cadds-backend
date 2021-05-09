import DatabaseTypes from '../common/DatabaseTypes';
import IUserType from '../../interfaces/account/IUserType';

class UserTypesModel extends DatabaseTypes {
    
    protected _types:IUserType[] = [];

    constructor(){
        super();
    }

}

export default UserTypesModel;