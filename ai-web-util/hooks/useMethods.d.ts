declare type TMethodsCon<T> = {
    [P in keyof T]: (arg?: any) => void;
};
/**
 * 数据类型的，Hooks生成函数
 */
export declare const useMethods: <T, B>(initialVal: T, methods: B) => [T, TMethodsCon<B>];
export {};
