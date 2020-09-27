/// <reference types="react" />
export declare const StepsContainer: ({ children, gap, onFinish, loading, skip }: StepsContainer) => JSX.Element;
declare type StepsContainer = {
    gap?: number;
    skip?: boolean;
    children: any[];
    loading: boolean;
    onFinish?: () => void;
};
export {};
