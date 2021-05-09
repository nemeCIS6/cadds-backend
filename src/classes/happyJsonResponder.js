
/**
 * Wraps javascript object in simpele javascript object containing data, message and success keys.
 * (c)  2018 Rogier van Poppel
 * @class happyJsonResponder
 */
class happyJsonResponder{

    static success(data, message = "no custom message provided"){
        let response = 
        {
            success : true,
            message : message,
            data : data,
            copyright: "Copyright 2020, Nemecis Technologies"
        }
        return response;
    }
    static fail(data = null, message = null){
        let response = 
        {
            success : false,
            message : message,
            data : data,
            copyright: "Copyright 2020, Nemecis Technologies"
        }
        return response;

    }


}
module.exports =  happyJsonResponder;