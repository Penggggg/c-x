declare type TArg<T> = {
    initVal?: T;
    url: string;
};
export declare const useFetch: <T>(arg: TArg<T>) => readonly [{} | T, {
    /** 重置 */
    readonly reset: () => void;
    /** 方法：加载列表 */
    readonly load: (outterArgs: any) => Promise<any>;
    /** 数据：列表是否加载中 */
    readonly isLoading: boolean;
}];
export {};
