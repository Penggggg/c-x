/// <reference types="react" />
declare type TCreateStore = <T>(store: T) => {
    useStore: () => T;
    StoreProvider: ({ children }: any) => JSX.Element;
};
/** 创建 Mobx Store */
export declare const createStore: TCreateStore;
export {};
