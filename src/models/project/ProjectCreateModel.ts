import IProject from '../../interfaces/project/IProject';
import IStatus from '../../interfaces/common/IStatus';
import LocationModel from '../location/LocationModel';
import ClientModel from '../client/ClientModel';
import UserModel from '../account/UserModel';

export default class ProjectCreateModel implements IProject {
    hourlyRate?: number;
    quotedRate?: number;
    user:UserModel;
    jobNumber: number;
    status?: IStatus;
    title: string;
    site: LocationModel;
    client: ClientModel;
    workOrderNumber: string;
    edmNumber?: number;
    deadline?: string;
    scope?:string;

    constructor(
        jobNumber: number,
        title: string,
        site: LocationModel,
        client: ClientModel,
        workOrderNumber: string,
        user: UserModel,
        edmNumber?: number,
        hourlyRate?: number,
        quotedRate?: number,
        deadline?: string,
        scope?:string,
        status?: IStatus
    ) {
        this.hourlyRate = hourlyRate;
        this.quotedRate = quotedRate;
        this.jobNumber = jobNumber;
        this.status = status;
        this.title = title;
        this.site = site;
        this.client = client;
        this.workOrderNumber = workOrderNumber;
        this.edmNumber = edmNumber;
        this.deadline = deadline;
        this.user = user;
        this.scope = scope;
    }
}