/// <reference types="react" />
export declare const MulInput: ({ value, label, placeholder, onChane }: MulInput) => JSX.Element;
declare type MulInput = {
    label?: string;
    placeholder?: string;
    value?: string[];
    onChane?: (r: string[]) => void;
};
export {};
