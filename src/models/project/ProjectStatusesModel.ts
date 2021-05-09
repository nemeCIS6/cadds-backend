import DatabaseTypes from '../common/DatabaseTypes';
import IStatus from '../../interfaces/common/IStatus';

class ProjectStatusesModel extends DatabaseTypes {
    
    protected _types:IStatus[] = [];

    constructor(){
        super();
    }
}

export default ProjectStatusesModel;