import IProjectStatus from './IProjectStatus';
import ILocation from '../location/ILocation';
import IClient from '../client/IExistingClient';
import IUser from '../account/IUser';

export default interface IProject {
    id?: number;
    hourlyRate?: number|null;
    quotedRate?: number|null;
    user: IUser;
    jobNumber: number;
    status?: IProjectStatus;   
    title: string;
    site: ILocation;
    client: IClient;
    workOrderNumber: string;
    edmNumber?: number;
    deadline?: string|null;
    scope?: string;
}