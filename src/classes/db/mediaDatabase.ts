"use strict"
import db from '../mysqlDatabase';
import IMediaType from '../../interfaces/media/IMediaType';
import {RowDataPacket} from 'mysql';
import MediaCreateModel from '../../models/media/MediaCreateModel';
const mysql = require('mysql');
const log = require('../log');

class mediaDatabase {

    async createAsync(createModel: any):Promise<number|false>{
        let query = "INSERT INTO `media` (`type`, `user`,`hash`,`content_type`) VALUES";
        query +=    " (?,?,UNHEX(?),?)";
        try{
            const result = await db.queryAsync(
                query, [createModel.type.id,createModel.user.id,createModel.hash,createModel.contentType]
                );
            return result.insertId;
        }
        catch(e){
            log.error(e);
            return false;
        }
    }

    async createProjectImageAsync(createModel: any,projectId:number):Promise<number|false>{
        let query = "INSERT INTO `media` (`type`, `user`,`hash`,`content_type`,`project`) VALUES";
        query +=    " (?,?,UNHEX(?),?,?)";
        try{
            const result = await db.queryAsync(
                query, [createModel.type.id,createModel.user.id,createModel.hash,createModel.contentType,projectId]
                );
            return result.insertId;
        }
        catch(e){
            log.error(e);
            return false;
        }
    }

    async getTypesAsync():Promise<IMediaType[]>{
        let query = "SELECT `uid` AS `id` , `name` FROM `media_types`";
        try{
            let result = await db.queryAsync(query);
            const types =  result && result.length > 0 ? result.map((row: any):IMediaType => {return {id: parseInt(row.id), name:row.name} }) : [];           
            return types;
        }
        catch(e){
            log.error(e)
            return [];
        }
    }

    async findImageByHash(hash:string):Promise<RowDataPacket|null|false>{
        try{
            const result = await db.queryAsync(
                "SELECT `uid` AS `id`,`user`,`type`,`created`,HEX(`hash`) AS `hash`,`content_type` FROM `media` WHERE `hash` = UNHEX(?) LIMIT 1",
                [hash]
            );
            return result.length > 0 ? result[0] : false; 
        }
        catch(e){
            log.error(e);
            return false;
        }
    }

    /**
     * Finds an image by it's uid and returns info 
     *
     * @param {number} id
     * @returns
     * @memberof mediaDatabase
     */
    async findImageById(id:number):Promise<RowDataPacket|null|false>{
        try{
            const result = await db.queryAsync(
                "SELECT `uid` AS `id`,`type`,`user`,`created`,HEX(`hash`) AS `hash`,`content_type` FROM `media` WHERE `uid` = ? LIMIT 1",
                [id] 
            );
            return result.length > 0 ? result[0] : false; 
        }
        catch(e){
            log.error(e);
            return false;
        }
    }

    async findImageByProject(id:number):Promise<RowDataPacket|null|false>{
        try{
            const result = await db.queryAsync(
                "SELECT `uid` AS `id`,`type`,`user`,`created`,HEX(`hash`) AS `hash`,`content_type`, `project` FROM `media` WHERE `project` = ? LIMIT 1",
                [id] 
            );
            return result.length > 0 ? result[0] : false; 
        }
        catch(e){
            log.error(e);
            return false;
        }
    }

}

export default new mediaDatabase;