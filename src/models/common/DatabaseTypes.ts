import DatabaseType from '../../interfaces/common/IDatabaseType';

export default class DatabaseTypes {

    protected _types:DatabaseType[] =[];
    protected indexMap:Map<number, DatabaseType> = new Map();
    protected valueMap:Map<string, DatabaseType> = new Map();

    public set(types:DatabaseType[]):void  {
        this._types = types;
        const indexMapArray:Array<[number,DatabaseType]> = [];
        const valueMapArray:Array<[string,DatabaseType]> = []; 
        types.forEach(item => {
            indexMapArray.push(
                [item.id,item]
            )
            valueMapArray.push(
                [item.name,item],[item.name.toLowerCase(),item]
            )
        });
        this.indexMap = new Map(indexMapArray);
        this.valueMap = new Map(valueMapArray);
    }

    public get():DatabaseType[]{
        return this._types;
    }

    getId(name:string):number{
        let item = this.getByValue(name);
        return item.id
    }

    getValue(id: number):string{
        let item = this.getById(id);
        return item.name;
    }

    getByValue(value:string):DatabaseType{
        let item = this.valueMap.get(value);
        if(item === undefined){
            throw({message: `value "${value}" does not exist`});
        }
        return item;
    }

    getById(id:number|string):DatabaseType{
        let idInt = typeof id === "string" ? parseInt(id) :id; 
        let item = this.indexMap.get(idInt);
        if(item === undefined){
            throw({message: `id "${id}" does not exist`});
        }
        return item;
    }

}