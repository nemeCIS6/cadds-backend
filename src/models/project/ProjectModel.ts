import IProject from '../../interfaces/project/IProject';
import ProjectStatusesModel from './ProjectStatusesModel';
import IStatus from '../../interfaces/common/IStatus';
import LocationModel from '../location/LocationModel';
import ClientModel from '../client/ClientModel';
import UserModel from '../account/UserModel';
import clientDatabase from '../../classes/db/clientDatabase';
import accountService from '../../classes/service/accountService';
import MediaModel from '../media/MediaModel';
import mediaService from '../../classes/service/mediaService';

export default class ProjectModel implements IProject {
    id: number;
    hourlyRate?: number|null;
    quotedRate?: number|null;
    jobNumber: number;
    status: IStatus;
    title: string;
    site: LocationModel;
    client: ClientModel;
    workOrderNumber: string;
    edmNumber?: number;
    deadline?: string;
    user: UserModel;
    scope?:string;
    photo?: string|null;

    constructor(
        id: number,
        jobNumber: number,
        status: IStatus,
        title: string,
        site: LocationModel,
        client: ClientModel,
        workOrderNumber: string,
        user:UserModel,
        edmNumber?: number,
        hourlyRate?: number|null,
        quotedRate?: number|null,
        deadline?: string,
        scope?:string,
        photo?:string|null
    ) {
        this.id = id;
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
        this.photo = photo;
    }

    public static async fromDatabaseValues(p:any, status:IStatus):Promise<ProjectModel>{
        const site = new LocationModel(p.site_uide,p.site_longitude,p.site_latitude,p.site_street,p.site_city,p.site_country,p.site_name);
        const client = new ClientModel(p.client_uid,p.client_email,p.client_name,p.client_address,p.client_phone);
        const user = new UserModel(p.user_id,p.user_first_name,p.user_registered,accountService.roles.getById(1),p.user_position,p.user_last_name,p.user_email);
        const getPhoto = await mediaService.getByProjectId(p.uid);
        let photo:string|null=null;
        if(getPhoto){
            photo = getPhoto.uri;
        }
        return new this (
            p.uid,
            p.job_number,
            status,
            p.title,
            site,
            client,
            p.work_order_number,
            user,
            p.edm_number,
            p.hourly_rate === 0 ? null:p.hourly_rate,
            p.quoted_rate === 0 ? null:p.quoted_rate,
            p.deadline,
            p.scope,
            photo
        )
    }

}