"use strict";
import Promise from 'bluebird'
import mysql from 'mysql';

import log from './log';
const settings = require("../settings");
/**
 *(c) 2019 Rogier van Poppel
 *MySQL database class
 */
export interface IPromisifiedMySQLPool extends mysql.Pool{
    queryAsync: (...param: any) => Promise<any>;
}
let db;
try {
    db =  Promise.promisifyAll( mysql.createPool(settings.database)); 
} 
catch(e){
    log.error(e);
    process.exit();
}
export default db as IPromisifiedMySQLPool;