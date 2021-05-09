import { NextFunction } from "connect";
import Express from 'express';
const settings = require("../../settings");

/* Copyright 2018 Rogier van Poppel 
/* Pass allowed origins as 3rd parameter to the express app.use
/* to check for the origin match and if found will return Access-Control-Allow-Origin header for that resource
*/

/** 2020 rewritten in TypeScript */

export const allowCredentialsHelper = (req:Express.Request,res:Express.Response,next:NextFunction) => {
    res.header("Access-Control-Allow-Credentials", 'true');
    const {allowedOrigins} = settings.server;
    if(typeof req.headers['origin'] != 'undefined'||typeof req.headers['Origin'] != 'undefined'){
        let reqOrigin = req.headers['origin']||req.headers['Origin'];
        allowedOrigins.some((origin:string) => {
            let http = 'http://' + origin;
            let https = 'https://' + origin;
            if(reqOrigin?.indexOf(http) == 0 || reqOrigin?.indexOf(https) == 0){
                res.header('Access-Control-Allow-Origin', reqOrigin);
                return true;
            }
        });
    }
    return next();
}

export const allowOriginsHelper =  (req:Express.Request,res:Express.Response,next:NextFunction) => {
    res.header("Access-Control-Allow-Headers", `content-type,${settings.authenticationTokenName}`);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Credentials", 'true');
    return res.status(204).end();
}

export const allowOriginAndCredentialsRouteHelper = Express.Router()
.use('*',allowCredentialsHelper)
.options('*',allowOriginsHelper)
export default allowOriginAndCredentialsRouteHelper;