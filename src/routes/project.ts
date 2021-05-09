const hjr = require("../classes/happyJsonResponder");
import express from "express";
const projectRouter = express.Router();
import validator from "validator";
const missingFields = require("../helpers/missingFields");
import projectService from "../classes/service/projectService";
import clientService from "../classes/service/clientService";
import locationService from "../classes/service/locationService";
import LocationCreateModel from "../models/location/LocationCreateModel";
import ProjectCreateModel from "../models/project/ProjectCreateModel";
import ClientCreateModel from "../models/client/ClientCreateModel";
import dateFromUnixTimestamp from "../helpers/dateFromUnixTimestamp";
import mediaService from "../classes/service/mediaService";

projectRouter
    .put("/create", async (req, res, next) => {
        let missing = missingFields(req.body, [
            "jobNumber",
            "title",
            "site",
            "client",
            "workOrderNumber"
        ]);
        if (missing) {
            return res
                .status(417)
                .json(hjr.fail([], "Expected post field for " + missing.join(", ")));
        }

        let { jobNumber, title, workOrderNumber, quotedRate, hourlyRate, edmNumber, deadline, scope } = req.body;

        if (!validator.isInt(jobNumber)) {
            return res.status(417).json(hjr.fail([], "Project job number invalid"));
        }

        /*         if (!validator.isInt(status)) {
                    return res.status(417).json(hjr.fail("Status invalid"));
                } */
/* 
        if (!validator.isAlphanumeric(title)) {
            return res.status(417).json(hjr.fail([], "Project title invalid"));
        } */

        if (!validator.isAlphanumeric(workOrderNumber)) {
            return res.status(417).json(hjr.fail([], "Project work order number invalid"));
        }

        if (hourlyRate && !validator.isFloat(hourlyRate)) {
            return res.status(417).json(hjr.fail([], "Hourly rate invalid"));
        }

        if (quotedRate && !validator.isFloat(quotedRate)) {
            return res.status(417).json(hjr.fail([], "Quoted rate invalid"));
        }

        if (edmNumber && !validator.isInt(req.body.edmNumber)) {
            return res.status(417).json(hjr.fail([], "EDM number invalid"));
        }

        missing = missingFields(req.body.site, [
            "longitude",
            "latitude",
            "accuracy",
            "city",
            "country",
            "name",
            "postalCode",
            "region",
            "street"
        ]);
        if (missing) {
            return res
                .status(417)
                .json(
                    hjr.fail([], "Site location invalid." + missing.join(", "))
                );
        }

        const site = new LocationCreateModel(
            req.session.user,
            req.body.site.longitude,
            req.body.site.latitude,
            req.body.site.accuracy,
            req.body.site.street,
            req.body.site.city,
            req.body.site.country,
            req.body.site.name,
            req.body.site.postalCode,
            req.body.site.region
        );

        missing = missingFields(req.body.client, [
            "name",
            "address",
            "phone",
            "email",
        ]);
        if (missing) {
            return res
                .status(417)
                .json(
                    hjr.fail([], "Expected post field for client." + missing.join(", "))
                );
        }

        const client = new ClientCreateModel(
            req.body.client.email,
            req.body.client.name,
            req.body.client.address,
            req.body.client.phone
        );

        let createProject: ProjectCreateModel | undefined;
        let projectImage = null;
        try {
            const projectClient = await clientService.createAsync(client);

            const projectLocation = await locationService.createAsync(site);


            if (!projectClient) {
                return res.status(404).json(hjr.fail({}, "Client creation failed"));
            }
            if (!projectLocation) {
                return res.status(400).json(hjr.fail(location, "Location creation failed"));
            }

            createProject = new ProjectCreateModel(
                jobNumber,
                title,
                projectLocation,
                projectClient,
                workOrderNumber,
                req.session.user,
                edmNumber ? edmNumber : null,
                hourlyRate ? hourlyRate : null,
                quotedRate ? quotedRate : null,
                deadline ? deadline : null,
                scope
            );
            const project = await projectService.createAsync(createProject);

            if (project) {
                if (req.body.image) {
                    projectImage = await mediaService.createProjectAsync(req.body.image, mediaService.mediaTypes.getByValue("project"), req.session.user, project.id)
                }
                if (!projectImage) {
                    return res.status(400).json(hjr.fail(location, "Project image upload error"));
                }
                return res.status(201).json(hjr.success({ project: { createProject, projectImage }, projectLocation }));
            } else {
                return res.status(400).json(hjr.fail(project, "unknown error"));
            }
        } catch (e) {
            console.log({ e });
            return res
                .status(400)
                .json(hjr.fail({ project: { createProject, projectImage } }, e.message));
        }
    })
    .get("/list", async (req, res, next) => {
        let skip = req.query.skip || 0;
        let take = req.query.take || 25;

        take = take > 100 ? 100 : take;

        let isAdmin = req.session.user.role.name.toLowerCase() === 'admin' ? true : false;
        let list;
        try{
            list = await projectService.listAsync(req.session.user.id,false, false);
        } 
        catch(e){
            console.log(e);
        }

        return res.json(hjr.success(list?.toObj()));
    })
    .get("/:id", async (req, res, next) => {
        const id = parseInt(req.params.id);
        if (!validator.isInt(req.params.id)) {
            return res.status(400).json(hjr.fail({}, "id invalid"));
        }
        try {
            const project = await projectService.getAsync(id);
            if (project) {
                return res.status(201).json(hjr.success(project));
            } else {
                return res.status(400).json(hjr.fail(project, "cannot get project"));
            }
        } catch (e) {
            return res.status(400).json(hjr.fail(id, e.message || "unknown error"));
        }
    })
    .patch("/:id", async (req, res, next) => {
        if (!validator.isInt(req.params.id)) {
            return next();
        }
        let patch: any = {};
        let foundField = false;
        ["job_number", "title", "site", "client", "work_order_number"].forEach(
            item => {
                if (req.body[item] !== undefined) {
                    patch[item] = req.body[item];
                    foundField = true;
                }
            }
        );
        if (!foundField) {
            return res
                .status(417)
                .json(hjr.fail("Did not find any patchable fields"));
        }
        let projectId = parseInt(req.params.id);
        try {
            const projectExists = await projectService.getAsync(projectId);
            if (!projectExists) {
                return res.status(404).json(hjr.fail(projectId, "zone not found"));
            }
            const project = await projectService.patchAsync(projectId, patch, req.session.user);
            if (project) {
                return res.status(200).json(hjr.success(project));
            } else {
                return res.status(400).json(hjr.fail(project, "unknown error"));
            }
        }
        catch (e) {
            return res.status(400).json(hjr.fail(e.message || 'unknown error'));
        }
    });

module.exports = projectRouter;
