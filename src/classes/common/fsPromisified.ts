import * as fs from 'fs';
import Promise from 'bluebird';
export interface IPromisifiedFs  {
    [x: string]: any
}

const p = Promise.promisifyAll(fs);

export default p as IPromisifiedFs;