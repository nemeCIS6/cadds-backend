class awaitReadyBase {

    protected _ready:boolean = true;
    private _runningPromise?:Promise<void>;

    public ReadyAsync = async ():Promise<void> => {

        if(this._ready){
            return;
        }
        if(this._runningPromise === undefined || this._runningPromise.isPending){
            await this._createReadyIntervalAsync();
        }
        return await this._runningPromise;

    }

    private _createReadyIntervalAsync = async():Promise<void> => {

        this._runningPromise = new Promise(resolve => {
            
            const method = ():void => {
                if(this._ready){
                    clearInterval(interval);
                    resolve();
                }
            }

            let interval = setInterval(method,1);
            
        });
    }

}

export default awaitReadyBase;