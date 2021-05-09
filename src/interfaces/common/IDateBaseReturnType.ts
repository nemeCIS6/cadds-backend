import IDatabaseRow from './IDateBaseRow';
export default interface IDatabaseReturnType{
    
    [rowId:number] : IDatabaseRow;
    
}