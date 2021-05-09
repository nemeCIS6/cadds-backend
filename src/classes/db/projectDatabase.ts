"use strict";

import db from '../mysqlDatabase';
const log = require("../log");

import ProjectCreateModel from '../../models/project/ProjectCreateModel';
import ILocation from '../../interfaces/location/ILocation';
import IExistingUser from '../../interfaces/account/IExistingUser';
import IProjectStatus from '../../interfaces/project/IProjectStatus';

class projectDatabase {


    async createAsync(project: ProjectCreateModel, status:number): Promise<number | false> {

        let inserts = ['`user`', '`job_number`', '`status`', '`title`', '`site`', '`client`', '`work_order_number`'];
        let binders = [project.user.id, project.jobNumber, status, project.title, project.site.id, project.client.id, project.workOrderNumber];

        if (project.hourlyRate) {
            inserts.push('`hourly_rate`');
            binders.push(project.hourlyRate);
        }
        if (project.quotedRate) {
            inserts.push('`quoted_rate`');
            binders.push(project.quotedRate);
        }

        if (project.edmNumber) {
            inserts.push('`edm_number`');
            binders.push(project.edmNumber);
        }

        if (project.deadline) {
            inserts.push('`deadline`');
            binders.push(project.deadline);
        }

        if (project.scope) {
            inserts.push('`scope`');
            binders.push(project.scope);
        }

        let query: string =
            `INSERT INTO \`projects\` (${inserts.join(', ')}) VALUES(${[...inserts].fill('?').join(', ')}) `;

        try {
            const result = await db.queryAsync(query, binders);
            return result.insertId || 0;
        } catch (e) {
            log.error(e);
            return false;
        }
    }

    async getAsync(id: number): Promise<any> {
        let joinbinders: Array<string | number> = [];
        let selectbinders: Array<string | number> = [];

        let selects: string[] = [
            "`projects`.`uid`",
            "`projects`.`job_number`",
            "`projects`.`status`",
            "`projects`.`title`",
            "`projects`. `work_order_number`",
            "`projects`. `hourly_rate`",
            "`projects`. `quoted_rate`",
            "`projects`. `edm_number`",
            "UNIX_TIMESTAMP(`projects`.`deadline`) as `deadline`",
            "UNIX_TIMESTAMP(`projects`.`updated`) as `updated`",
            "UNIX_TIMESTAMP(`projects`.`created`) as `created`",
            "`clients`.`uid` AS `client_id`",
            "`clients`.`name` AS `client_name`",
            "`clients`.`address` AS `client_address`",
            "`clients`.`phone` AS `client_phone`",
            "`clients`.`email` AS `client_email`",
            "`users`.`uid` AS `user_id`",
            "`users`.`first_name` AS `user_first_name`",
            "`users`.`last_name` AS `user_last_name`",
            "`users`.`position` AS `user_position`",
            "`users`.`email` AS `user_email`",
            "`locations`.`uid` AS `site_uid`",
            "ST_X(`locations`.`location`) AS `site_longitude`",
            "ST_Y(`locations`.`location`) AS `site_latitude`",
            "`locations`.`city` AS `site_city`",
            "`locations`.`country` AS `site_country`",
            "`locations`.`region` AS `site_reggion`",
            "`locations`.`street` AS `site_street`"
        ];

        let joins = [
            "LEFT JOIN `clients` ON `clients`.`uid` = `projects`.`client`",
            "LEFT JOIN `users` ON `users`.`uid` = `projects`.`user`",
            "LEFT JOIN `locations` ON `locations`.`uid` = `projects`.`site`"
        ];

        let query = `SELECT ${selects.join(",")} FROM \`projects\` ${joins.join(
            " "
        )} `;
        query += "WHERE `projects`.`uid` = ? LIMIT 1";

        try {
            const result = await db.queryAsync(query, [
                ...selectbinders,
                ...joinbinders,
                id
            ]);
            return result && result.length ? result[0] : null;
        } catch (e) {
            log.error(e);
            return null;
        }
    }

    async listAsync(
        userId:number,
        location: ILocation | false = false,
        showAll: boolean = false,
        skip: number = 0,
        take: number = 25
    ) {
        let where: string[] = [];
        let wherebinders: Array<string | number> = [];
        let joinbinders: Array<string | number> = [];
        let selectbinders: Array<string | number> = [];

        let selects: string[] = [
            "`projects`.`uid`",
            "`projects`.`job_number`",
            "`projects`.`status`",
            "`projects`.`title`",
            "`projects`. `work_order_number`",
            "`projects`. `hourly_rate`",
            "`projects`. `quoted_rate`",
            "`projects`. `edm_number`",
            "`projects`. `scope`",
            "`projects`. `deadline`",
            "UNIX_TIMESTAMP(`projects`.`deadline`) as `deadline`",
            "UNIX_TIMESTAMP(`projects`.`updated`) as `updated`",
            "UNIX_TIMESTAMP(`projects`.`created`) as `created`",
            "`clients`.`uid` AS `client_id`",
            "`clients`.`name` AS `client_name`",
            "`clients`.`address` AS `client_address`",
            "`clients`.`phone` AS `client_phone`",
            "`clients`.`email` AS `client_email`",
            "`users`.`uid` AS `user_id`",
            "`users`.`first_name` AS `user_first_name`",
            "`users`.`last_name` AS `user_last_name`",
            "`users`.`position` AS `user_position`",
            "`users`.`email` AS `user_email`",
            "`users`.`registered` AS `user_registered`",
            "`locations`.`uid` AS `site_uid`",
            "ST_X(`locations`.`location`) AS `site_longitude`",
            "ST_Y(`locations`.`location`) AS `site_latitude`",
            "`locations`.`city` AS `site_city`",
            "`locations`.`country` AS `site_country`",
            "`locations`.`region` AS `site_reggion`",
            "`locations`.`street` AS `site_street`",
            "`locations`.`name` AS `site_name`"
        ];

        let joins = [
            "LEFT JOIN `clients` ON `clients`.`uid` = `projects`.`client`",
            "LEFT JOIN `users` ON `users`.`uid` = `projects`.`user`",
            "LEFT JOIN `locations` ON `locations`.`uid` = `projects`.`site`"
        ];

        if (showAll) {
            selects.push(
                "`users`.`uid` AS `user_id`",
                "`users`.`first_name` AS `user_first_name`",
                "`users`.`last_name` AS `user_last_name`",
                "`users`.`role` AS `user_role`",
                "`users`.`email` AS `user_email`"
            );
            joins.push("LEFT JOIN `users` ON `users`.`uid` = `projects`.`user`");
        }

        /*     if(location){
              selects.push(" ST_DISTANCE_SPHERE(`locations`.`location`,POINT(?,?)) AS `location_distance` ")
              where.push(" ABS(ST_DISTANCE_SPHERE(`locations`.`location`,POINT(?,?))) <= `zones`.`radius` ");
              selectbinders.push(location.longitude,location.latitude);
              wherebinders.push(location.longitude,location.latitude);
            } */

        let query = `SELECT ${selects.join(",")} FROM \`projects\` ${joins.join(" ")} `;
        if (where.length > 0) {
            query += ` WHERE ${where.join(" AND ")} `;
        }
        /*     if(location){
              query += "ORDER BY `location_distance` ASC ";
            } */
        query += `WHERE \`users\`.\`uid\` = ${userId} LIMIT ${skip} , ${take}`;
        try {
            const result = await db.queryAsync(query, [
                ...selectbinders,
                ...joinbinders,
                ...wherebinders
            ]);
            return result || [];
        } catch (e) {
            log.error(e);
            return false;
        }
    }

    async getListTotalsAsync(
        location: ILocation | false = false,
    ): Promise<number> {

        let where: string[] = [];
        let wherebinders: Array<string | number> = [];

        /*     if(location){
              where.push(" ABS(ST_DISTANCE_SPHERE(`locations`.`location`,POINT(?,?))) <= `projects`.`radius` ");
              wherebinders.push(location.longitude,location.latitude);
            } */

        let query = "SELECT count(`projects`.`uid`) AS `count` FROM `projects` ";
        //query += ` ${joins.join(" ")} `;
        if (where.length > 0) {
            query += ` WHERE ${where.join(" AND ")} `;
        }

        try {
            const result = await db.queryAsync(query, wherebinders);
            return result ? parseInt(result[0].count) : 0;
        } catch (e) {
            log.error(e);
            return 0;
        }
    }

    async patchAsync(
        id: number,
        title: string | false,
        user: number | false,
        site: number | false,
        jobNumber: number | false,
        client: number | false,
        workOrderNumber: string | false,
        hourlyRate: number | false,
        quotedRate: number | false,
        edmNumber: number | false,
        deadline: string | false
    ): Promise<number | false> {
        let query = "UPDATE `projects` SET ";
        let setters = [];
        let binders = [];
        if (title) setters.push(" `title` = ? ") && binders.push(title);
        if (user) setters.push(" `user` = ? ") && binders.push(user);
        if (site) setters.push(" `site` = ? ") && binders.push(site);
        if (jobNumber)
            setters.push(" `jobNumber` = ? ") &&
                binders.push(jobNumber);
        if (client)
            setters.push(" `client` = ? ") &&
                binders.push(client);
        if (workOrderNumber) setters.push(" `workOrderNumber` = ? ") && binders.push(workOrderNumber);
        if (hourlyRate) setters.push(" `hourlyRate` = ? ") && binders.push(hourlyRate);
        if (quotedRate) setters.push(" `quotedRate` = ? ") && binders.push(quotedRate);
        if (edmNumber) setters.push(" `edmNumber` = ? ") && binders.push(edmNumber);
        if (deadline) setters.push(" `deadline` = FROM_UNIXTIME(?)  ") && binders.push(deadline.toString());

        query += setters.join(" , ") + " WHERE `uid` = ?";
        binders.push(id);
        try {
            const result = await db.queryAsync(query, binders);
            return result.affectedRows;
        } catch (e) {
            log.error(e);
            return false;
        }
    }

    async getStatusesAsync(): Promise<IProjectStatus[]> {
        try {
            const result = await db.queryAsync(
                "SELECT `uid`,`name` FROM `project_statuses`"
            );
            return result && result.length > 0
                ? result.map(
                    (row: any): IProjectStatus => {
                        return { id: parseInt(row.uid), name: row.name };
                    }
                )
                : [];
        } catch (e) {
            log.error(e);
        }
        return [];
    }

}

export default new projectDatabase();