/// <reference types="react" />
/**
 * @description
 * cvter的搜索框
 */
export declare const CvterSearch: ({ url, query, accountKey, nameKey, placeholder, onChange, multipul }: TComCvterSearch) => JSX.Element;
declare type TComCvterSearch = {
    url: string;
    query: string;
    nameKey: string;
    accountKey: string;
    multipul?: boolean;
    placeholder?: string;
    onChange?: (result: string) => void;
};
export {};
