const settings = require("../../settings");
import validator from 'validator';
import express from 'express';
import ILocation from '../../interfaces/location/ILocation';

declare global {
    namespace Express {
      interface Request {
        location?: ILocation
      }
    }
 }

export const locationRouteHelper = async (req:express.Request,res: express.Response,next: express.NextFunction) => {
    const locationString = (req.header(settings.locationHeaderName)||'').toString();
    if(locationString && validator.isBase64(locationString)){
      try{
        let buffer = Buffer.from(locationString,'base64');
        let str = buffer.toString().split('').reverse().join('');
        buffer = Buffer.from(str,'base64');
        str = buffer.toString().split('').reverse().join('');
        const arr = JSON.parse(str);
        if(Array.isArray(arr)){
          const [longitude,latitude]  = arr.map(v => parseFloat(v));
          if([longitude,latitude].every(v => v !== 0)){
            req.location = {longitude,latitude};
          }
        }

      }
      catch(e){
        console.error(e);
      }
    }
    return next();
}
