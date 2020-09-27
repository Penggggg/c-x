declare type IHttpResult<T> = {
    data: T;
    status: 200 | 400 | 500;
};
interface IHttp {
    get<T>(opts: any): Promise<IHttpResult<T>>;
    post<T>(opts: any): Promise<IHttpResult<T>>;
    put<T>(opts: any): Promise<IHttpResult<T>>;
    delete<T>(opts: any): Promise<IHttpResult<T>>;
    originFetch<T>(opts: any): Promise<IHttpResult<T>>;
}
declare class Http implements IHttp {
    get<T>(opts: any): Promise<IHttpResult<T>>;
    post<T>(opts: any): Promise<IHttpResult<T>>;
    put<T>(opts: any): Promise<IHttpResult<T>>;
    delete<T>(opts: any): Promise<IHttpResult<T>>;
    /** 公共的方法 */
    originFetch<T>(opts: any): Promise<IHttpResult<T>>;
}
export declare const http: Http;
export {};
