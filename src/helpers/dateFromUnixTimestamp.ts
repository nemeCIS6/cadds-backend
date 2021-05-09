/* Copyright 2019 Francis Gaddi
/* Converts UNIX Timestamp to a date object
*/

const dateFromUnixTimestamp = (timestamp:number) => {
    return (new Date(timestamp * 1000));
}
export default dateFromUnixTimestamp;