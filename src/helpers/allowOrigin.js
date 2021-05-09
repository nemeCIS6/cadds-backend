const settings = require("../settings");

/* Copyright 2018 Rogier van Poppel 
/* Pass allowed origins as 3rd parameter to the express app.use
/* to check for the origin match and if found will return Access-Control-Allow-Origin header for that resource
*/

let allowOrigins = app => {
   
        app.use((req,res,next) => {
            res.header("Access-Control-Allow-Credentials", 'true');
            doAllowOrigin(req,res,next,settings.server.allowedOrigins) ;
        })
        .options('*',(req,res,next)=>{
            res.header("Access-Control-Allow-Headers", `content-type,${settings.authenticationTokenName}`);
            res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
            res.header("Access-Control-Allow-Credentials", 'true');
            return res.status(204).end();
        });

    return app;
}


function doAllowOrigin(req,res,next,origins)  {
    if(typeof req.headers['origin'] != 'undefined'||typeof req.headers['Origin'] != 'undefined'){
        let reqOrigin = req.headers['origin']||req.headers['Origin'];
        origins.some(origin => {
            let http = 'http://' + origin;
            let https = 'https://' + origin;
            if(reqOrigin.indexOf(http) == 0 || reqOrigin.indexOf(https) == 0){
                res.header('Access-Control-Allow-Origin', reqOrigin);
                return true;
            }
        });
    }
    return next();
}
module.exports = allowOrigins;