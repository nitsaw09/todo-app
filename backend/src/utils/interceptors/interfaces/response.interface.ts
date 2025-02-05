export interface IResponse<T> {
    data?: T;
    pagination?: T;
    message?: string 
}