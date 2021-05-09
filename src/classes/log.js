class log {

    error(err){
        console.error(new Date().getDate())
        console.error(err);
    }
    notification(message){
        console.log(new Date().getDate())
        console.log(message);
    }

}
module.exports = new log();