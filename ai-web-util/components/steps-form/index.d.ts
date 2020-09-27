/// <reference types="react" />
declare type TStepsForm = {
    forms: {
        title: string;
        formItems: any[];
    }[];
    formName: string;
    onOk?: (e: any) => void;
    onChange?: (e: any, current: number) => void;
    defaultValue?: any;
    isLoading?: boolean;
};
export declare const StepsForm: ({ forms, formName, onOk, onChange, defaultValue, isLoading }: TStepsForm) => JSX.Element;
export {};
