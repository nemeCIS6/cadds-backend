const settings = require('../settings');

interface cronItem {
    callback : () => Promise<void>; //make sure we only get async functions to prevent delays while waiting for other jobs
    interval : number;
    nextRun : number;
}

/**
 * Register jobs to run at an certain interval. All values are in seconds.
 * (c) 2019 Rogier van Poppel
 * @class Cron Class to run cronjobs in your express application
 */
class Cron {

    private jobs: cronItem[] = [] ;
    private interval : number;
    private cronRunner? : NodeJS.Timeout;

    constructor(){
        this.interval = settings.cron.interval || 5;
        this.createInterval();
    }

    public addJob = (callback: () => Promise<void>, interval: number, nextRun: number = 0):number => {
        interval = interval * 1000;
        this.jobs.push(
           {callback,interval,nextRun} 
        );
        return this.jobs.length + 1;
    }

    private run = async ():Promise<void> => {
       this.jobs.forEach((item,idx) => {       
            const now = new Date().getTime();
            if(item.nextRun <= now){
                item.callback();
                this.jobs[idx].nextRun = now + item.interval;
            }
       });
    }

    private createInterval = async (): Promise<void> => {
        this.cronRunner = setInterval(this.run,this.interval * 1000);
    }


}

const cron = new Cron;
export default cron;