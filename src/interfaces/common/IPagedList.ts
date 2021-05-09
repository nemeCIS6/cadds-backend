export default interface IPagedList<T>{
    list:Array<T>,
    skip: number;
    take:number;
    total:number;
    type?:any;

    pages:number;
    currentPage:number;
    hasPreviousPage:boolean;
    hasNextPage:boolean;

    toObj?: () => IPagedList<T>
}