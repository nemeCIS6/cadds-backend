import awaitReadyBase from './../common/awaitReadyBase';
import mediaDatabase from '../db/mediaDatabase';
import fs from '../common/fsPromisified';

import cron from '../cron';
import IUser from '../../interfaces/account/IUser';
import IMediaType from '../../interfaces/media/IMediaType';
import MediaTypes from '../../models/media/MediaTypes';
import MediaModel from '../../models/media/MediaModel';
import MediaCreateModel from '../../models/media/MediaCreateModel';
import IMedia from '../../interfaces/media/IMedia';
const md5 = require('../../helpers/hashers').md5;

const cc = require('../../helpers/objectKeysToCamelCase');
const bufferType = require('buffer-type');
const settings = require('../../settings');


class mediaService extends awaitReadyBase {

    public mediaTypes:MediaTypes = new MediaTypes;

    constructor(){
        super();
        this._ready = false;
        cron.addJob(
            async() => {
                const mediaTypes = await this._getMediaTypesAsync();
                this.mediaTypes.set(mediaTypes);
                if(!this._ready){
                    this._ready = true;
                }
            },
            settings.cron.databaseTypeInterval                
        )
    }

    private async _getMediaTypesAsync():Promise<IMediaType[]>{
        const types = await mediaDatabase.getTypesAsync();
        return types;
    }

    async createAsync(base64Image:string, type:IMediaType, user:IUser):Promise<MediaModel>{
       
        await this.ReadyAsync()

        let imgBuffer = Buffer.from(base64Image,'base64');
        let bt = bufferType(imgBuffer);
        if(bt === undefined || bt.type === undefined){
            //TODO: FIX! VERY IMPORTANT
            bt = {
                type: 'image/jpeg'
            }
            // res.message = 'invalid image';
            // return res;
        }
        if(Object.keys(settings.media.contentTypes).indexOf(bt.type) !== -1){
            
            let hash = md5(imgBuffer);
            let exists = await this.findImageByHashAsync(hash);
           
            if(!exists){
                let path = this.getMediaPath(type,hash,new Date(),bt.type,true);
                const mediaCreate = new MediaCreateModel(
                    type,hash,bt.type,user
                )
                let mediaId = await mediaDatabase.createAsync(mediaCreate);
                await fs.writeFileAsync([settings.media.filePath,path].join('/'),imgBuffer);

                if(!mediaId){
                   throw( {message:"Something went wrong saving the image"});
                }
                return MediaModel.fromMediaCreateModel(
                    mediaId,
                    [
                        settings.server.mediaServer +
                        settings.media.remotePath,
                        path
                    ].join('/'),
                    mediaCreate
                )
            }
            else{
                return exists;
            }
        }
        else{
            throw(
                {message:"Image has wrong content type"}
            )
        }
    }

    async createProjectAsync(base64Image:string, type:IMediaType, user:IUser, projectId:number):Promise<MediaModel>{
       
        await this.ReadyAsync()

        let imgBuffer = Buffer.from(base64Image,'base64');
        let bt = bufferType(imgBuffer);
        if(bt === undefined || bt.type === undefined){
            //TODO: FIX! VERY IMPORTANT
            bt = {
                type: 'image/jpeg'
            }
            // res.message = 'invalid image';
            // return res;
        }
        if(Object.keys(settings.media.contentTypes).indexOf(bt.type) !== -1){
            
            let hash = md5(imgBuffer);
            //let exists = await this.findImageByHashAsync(hash);
           
                let path = this.getMediaPath(type,hash,new Date(),bt.type,true);
                const mediaCreate = new MediaCreateModel(
                    type,hash,bt.type,user
                )
                let mediaId = await mediaDatabase.createProjectImageAsync(mediaCreate,projectId);
                await fs.writeFileAsync([settings.media.filePath,path].join('/'),imgBuffer);

                if(!mediaId){
                   throw( {message:"Something went wrong saving the image"});
                }
                return MediaModel.fromMediaCreateModel(
                    mediaId,
                    [
                        settings.server.mediaServer +
                        settings.media.remotePath,
                        path
                    ].join('/'),
                    mediaCreate
                )
        }
        else{
            throw(
                {message:"Image has wrong content type"}
            )
        }
    }

    /**
     * finds image by it's hash, and returns info on it.
     *
     * @param {string} hash
     * @returns id of image with given hash
     * @memberof mediaService
     */
    async findImageByHashAsync(hash:string):Promise<MediaModel|null>{
        await this.ReadyAsync();
        let image = await mediaDatabase.findImageByHash(hash);
        if(!image){
            return null;
        }
        const type = this.mediaTypes.getById(image.type);
        const url = [
            settings.server.mediaServer +
            settings.media.remotePath,
            this.getMediaPath(type,image.hash,new Date(image.created),image.content_type)
        ].join('/');
        return new MediaModel(url,image.id,type,image.hash,image.content_type);

    }

    async getById(id:number):Promise<MediaModel|null>{
        await this.ReadyAsync();
        let image = await mediaDatabase.findImageById(id);
        if(!image){
            return null;
        }  
        const type = this.mediaTypes.getById(image.type);
        const url = [
            settings.server.mediaServer +
            settings.media.remotePath,
            this.getMediaPath(type,image.hash,new Date(image.created),image.content_type)
        ].join('/');
        return new MediaModel(url,image.id,type,image.hash,image.content_type);
    }

    async getByProjectId(id:number):Promise<MediaModel|null>{
        await this.ReadyAsync();
        let image = await mediaDatabase.findImageByProject(id);
        if(!image){
            return null;
        }  
        const type = this.mediaTypes.getById(image.type);
        const url = [
            settings.server.mediaServer +
            settings.media.remotePath,
            this.getMediaPath(type,image.hash,new Date(image.created),image.content_type)
        ].join('/');
        return new MediaModel(url,image.id,type,image.hash,image.content_type);
    }

    public getMediaUrl(type:IMediaType,hash:string,created:Date,contentType:string):string{
        return [
            settings.server.mediaServer +
            settings.media.remotePath,
            this.getMediaPath(type,hash,created,contentType)
        ].join('/');
    }

    private getMediaPath(type:IMediaType,hash:string,date:Date, contentType:string,createIfNotExists:boolean = false):string{
        let typeName = type.name.toLowerCase();
        let month = date.getMonth() + 1;
        let datePath = date.getFullYear() + (month < 10 ? "0" : '') + month;

        if(createIfNotExists && !fs.existsSync([settings.media.filePath,typeName,datePath].join('/'))){
            if(!fs.existsSync(settings.media.filePath)){
                fs.mkdirSync(settings.media.filePath); 
            }
            if(!fs.existsSync([settings.media.filePath,typeName].join('/'))){
                fs.mkdirSync([settings.media.filePath,typeName].join('/')); 
            }
            fs.mkdirSync([settings.media.filePath,typeName,datePath].join('/')); 
        }        
        return [typeName,datePath,hash.toLowerCase()].join('/') + '.' + settings.media.contentTypes[contentType];
    }

}
export default new mediaService;