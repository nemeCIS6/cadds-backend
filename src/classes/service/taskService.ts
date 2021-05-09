
import awaitReadyBase from "../common/awaitReadyBase";
import console = require("console");
const log = require('../log');

class taskService extends awaitReadyBase {

    constructor(){
        super();
    }

    public async startuptasksAsync(){
        this._ready = true;
    }

}

export default new taskService();