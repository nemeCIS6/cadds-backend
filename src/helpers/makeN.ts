
/**
 * Converts integers to fixed length.
 * When shorter than fiven length, takes last 6 numbers. When shorter, adds leading zeros.
 * (c) Rogier van Poppel, 2019
 * @param {(number|string)} number
 * @returns {string}
 */
function makeN(number:number|string, length:number = 6):string{
    length = Math.round(length);
    if(typeof number === 'string'){
        number = parseInt(number);
    }

    let sN:string = '' + number;

    if(sN.length > length){
        sN = sN.substr(sN.length -6);
    }
    while(sN.length < length){
        sN = '0' + sN;
    }

    return sN;
}

export default makeN;