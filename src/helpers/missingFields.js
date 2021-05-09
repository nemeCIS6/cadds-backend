/**
 * (c) Rogier van Poppel, 2019
 * 
 **/


const missingFields = (obj, fields, noNull = true) => {
 
    let missing = [];
    fields.forEach(field => {
        if(typeof obj[field] === 'undefined'){
            missing.push(field);
        }
        else if(noNull && obj[field] === null){
            missing.push(field);
        }
    });
    return missing.length > 0 ? missing : false;
}
module.exports = missingFields