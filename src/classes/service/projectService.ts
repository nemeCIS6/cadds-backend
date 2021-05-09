const settings = require('../../settings');
import awaitReadyBase from "./../common/awaitReadyBase";
import accountService from "../../classes/service/accountService";
import locationService from "./locationService";
import projectDatabase from "../db/projectDatabase";
import ProjectCreateModel from "../../models/project/ProjectCreateModel";
import ProjectModel from "../../models/project/ProjectModel";
import PagedListModel from "../../models/common/PagedListModel";
import ILocation from "../../interfaces/location/ILocation";
import LocationCreateModel from "../../models/location/LocationCreateModel";
import LocationModel from "../../models/location/LocationModel";
import Validator from "validator";
import IExistingUser from "../../interfaces/account/IExistingUser";
import ProjectStatusesModel from "../../models/project/ProjectStatusesModel";
import cron from '../cron';
import IProjectStatus from "../../interfaces/project/IProjectStatus";
import ClientModel from "../../models/client/ClientModel";
import clientDatabase from "../db/clientDatabase";
import IProject from "../../interfaces/project/IProject";

class projectService extends awaitReadyBase {

    public statuses: ProjectStatusesModel = new ProjectStatusesModel;

    constructor() {
        super();
        this._ready = false;
        cron.addJob(
            async () => {
                const [
                    projectTypes
                ] = await Promise.all([
                    this._getStatusesAsync()
                ]);
                this.statuses.set(projectTypes);
                if (!this._ready) {
                    this._ready = true;
                }
            },
            settings.cron.databaseTypeInterval
        )
    }

    private async _getStatusesAsync(): Promise<IProjectStatus[]> {
        const types = await projectDatabase.getStatusesAsync();
        return types;
    }

    async createAsync(project: ProjectCreateModel): Promise<ProjectModel | false> {
        const projectId = await projectDatabase.createAsync(project,this.statuses.getById(1).id);
        return projectId
            ? new ProjectModel(
                projectId,
                project.jobNumber,
                this.statuses.getById(1),
                project.title,
                project.site,
                project.client,
                project.workOrderNumber,
                project.user,
                project.edmNumber,
                project.hourlyRate,
                project.quotedRate,
                project.deadline
            )
            : false;
    }

    async getAsync(id: number): Promise<ProjectModel | false> {
        const project = await projectDatabase.getAsync(id);
        if (project) {
            return ProjectModel.fromDatabaseValues(project,this.statuses.getById(project.status));
        }
        return false;
    }

    async listAsync(
        userId:number,
        location: ILocation | false = false,
        showAll: boolean = false,
        skip: number = 0,
        take: number = 25
    ): Promise<PagedListModel<ProjectModel>> {

        let tasks = [
            projectDatabase.listAsync(
                userId,
                location,
                showAll,
                skip,
                take
            ),
            projectDatabase.getListTotalsAsync(location)
          ];
      
          const [list, total] = await Promise.all(tasks);
          const projectListTasks: Promise<ProjectModel>[] = list.map(
            (project: any): Promise<IProject> => ProjectModel.fromDatabaseValues(project,this.statuses.getById(1))
          );
      
          let projectList: ProjectModel[] = [];
      
          for (let i = 0; i < projectListTasks.length; i++) {
            projectList.push(await projectListTasks[i]);
          }
          return new PagedListModel(projectList, skip, take, total);
    }

    async patchAsync(
        id: number,
        patch: any,
        user: IExistingUser
    ): Promise<ProjectModel> {
        let locationModel: LocationCreateModel;
        let site: LocationModel | false = false;
        let title: string | false = false;
        let client: ClientModel | false | null = false;
        let jobNumber: number | false = false;
        let workOrderNumber: string | false = false;
        let hourlyRate: number | false = false;
        let quotedRate: number | false = false;
        let edmNumber: number | false = false;
        let deadline: string | false = false;

        if (patch.site) {
            if (
                patch.site.latitude &&
                patch.site.longitude
            ) {
                locationModel = LocationCreateModel.fromDatabaseValues(patch);
                locationModel.user = user;
                site = false;
                site = await locationService.createAsync(locationModel);
            } else {
                throw { message: "invalid location" };
            }
        }

        title = patch.name || false;
        if (patch.client) {
            let clientId:number|false = false;
            try {
                clientId = await clientDatabase.createAsync(patch.sponsorId);
                if(!clientId) throw { message: "cannot update client" };
                client = ClientModel.fromDatabaseValues(await clientDatabase.getAsync(clientId));
            }
            catch (e) {
                throw { message: "cannot update client" };
            }
        }

        deadline = patch.deadline !== undefined ? patch.deadline : false;
        jobNumber = parseInt(patch.jobNumber) || false;
        workOrderNumber = patch.workOrderNumber || false;
        edmNumber = parseInt(patch.edmNumber) || false;
        hourlyRate = parseFloat(patch.hourlyRate) || false;
        quotedRate = parseFloat(patch.quotedRate) || false;

        const project = await projectDatabase.patchAsync(
            id,
            title,
            user.id,
            site? site.id:site,
            jobNumber,
            client? client.id:client,
            workOrderNumber,
            hourlyRate,
            quotedRate,
            edmNumber,
            deadline
        );
        if (project) {
            let newProject = await this.getAsync(id);
            if (!newProject) {
                throw { message: "Something went wrong editing the project (B)" };
            }
            return newProject;
        }
        throw { message: "Something went wrong editing the project (A)" };
    }
}

const zs = new projectService();
export default zs;
