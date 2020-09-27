/// <reference types="react" />
export declare const CheckboxTags: ({ defaultSelected, tags, block, type, onChange, onDelete, onUpdate }: TComChexkboxTag) => JSX.Element;
declare type TComChexkboxTag = {
    tags: TChexkboxTag[];
    type: 'single' | 'multipul';
    block?: boolean;
    defaultSelected?: string[];
    onChange?: (selecteds: string[]) => void;
    onDelete?: (tag: TChexkboxTag) => void;
    onUpdate?: (tag: TChexkboxTag) => void;
};
declare type TChexkboxTag = {
    id: string;
    name: string;
    [key: string]: any;
};
export {};
