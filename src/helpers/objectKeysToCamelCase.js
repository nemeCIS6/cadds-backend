

const _ = require('lodash');

/**
 * Converts object to object where keys are converted to camelCase
 * (C) 2019 Rogier van Poppel * 
 * @param {*} obj {non-camelcase object}
 */
const cc = obj => {
    const ccobj = {};
    Object.keys(obj).forEach(key => {
        if(obj.hasOwnProperty(key)) {
            ccobj[_.camelCase(key)] = obj[key];
        }
    });
    return ccobj;
}
module.exports = cc;