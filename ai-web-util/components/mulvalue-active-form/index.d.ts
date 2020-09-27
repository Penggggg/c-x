/// <reference types="react" />
declare type TPMulvalueActiveForm = {
    label?: string;
    json?: {
        [key: string]: string;
    };
    showEmpty?: boolean;
    placeholder?: {
        key: string;
        value: string;
    };
    onChane?: (r: {
        [key: string]: string;
    }) => void;
};
export declare const MulvalueActiveForm: ({ json, label, showEmpty, placeholder, onChane }: TPMulvalueActiveForm) => JSX.Element;
export {};
