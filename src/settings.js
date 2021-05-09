const defaultsDeep = require('lodash').defaultsDeep;

let settings = require('./settings/default.js');

try{
    let local = require('./settings/local.js') ;
    settings = defaultsDeep(local,settings);
}
catch(e){

}
module.exports =  settings;