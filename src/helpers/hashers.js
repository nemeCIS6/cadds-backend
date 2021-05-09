/**
 * (c) Rogier van Poppel, 2019
 * 
 **/

const crypto = require('crypto');

const sha256 = data => {
    let sha256Hash = crypto.createHash('sha256');
    sha256Hash.update(data);
    let hash = sha256Hash.digest('hex');
    return hash;
}

const md5 = data => {
    let md5hash = crypto.createHash('md5');
    md5hash.update(data);
    let hash = md5hash.digest('hex');
    return hash;
}
module.exports = {
    sha256,
    md5
};