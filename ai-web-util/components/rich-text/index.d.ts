/// <reference types="react" />
import 'braft-editor/dist/index.css';
export declare const RichText: ({ defaultValue, onChange, uploadUrl, placeholder }: RichText) => JSX.Element;
declare type RichText = {
    uploadUrl?: string;
    placeholder?: string;
    defaultValue?: string;
    onChange?: (html: string) => void;
};
export {};
