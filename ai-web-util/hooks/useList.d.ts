declare type TArg<T> = {
    initVal?: T[];
    listUrl: string;
};
export declare const useList: <T>(arg: TArg<T>) => readonly [T[], {
    /** 重置列表 */
    readonly reset: () => void;
    /** 方法：加载列表 */
    readonly load: (outterArgs: any) => Promise<any>;
    /** 数据：列表是否加载中 */
    readonly isLoading: boolean;
}];
export {};
