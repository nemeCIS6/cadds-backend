import IPagedList from "../../interfaces/common/IPagedList";

export default class PagedListModel<T> implements IPagedList<T>{
    list:Array<T>;
    skip:number;
    take:number;
    total:number;
    type?:any;

    constructor(list:Array<T>,skip:number,take:number,total:number,type?:any){
        this.list = list;
        this.skip = skip;
        this.take = take;
        this.total = total;
        this.type = type;
    }

    get pages(){
        return Math.ceil(this.total/this.take);
    }

    get hasPreviousPage(){
        return this.skip > 0 && this.take > 0;
    }

    get hasNextPage(){
        return this.total > this.skip + this.take ;
    }

    get currentPage(){
        return Math.ceil(this.skip/this.take) + 1;
    }

    toObj = () => {
        let returnList = this.list.map((item:any) => {
            return typeof item.toObj == 'function' ? item.toObj() : item
        })
        return {           
            skip: this.skip,
            take: this.take,
            total: this.total,
            type: this.type,
            currentPage:this.currentPage,
            hasNextPage: this.hasNextPage,
            hasPreviousPage: this.hasPreviousPage,
            pages: this.pages,
            list: returnList
        }
    }



}