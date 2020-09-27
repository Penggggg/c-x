/// <reference types="react" />
import './index.less';
/**
 * @description
 * 图片标注里面的，图片检查标签标注
 */
export declare const ImgLabelDetectTag: ({ src, height, tags, type, defaultValues, canAction, onCreate, onSave, onDelete, onUpdate }: TComImgLabelDetectTag) => JSX.Element;
declare type TLabelTag = {
    id: string;
    name: string;
    [key: string]: any;
};
declare type TDefaultValues = {
    id: any;
    x: number;
    y: number;
    w: number;
    h: number;
    labels: string[];
};
declare type TComImgLabelDetectTag = {
    src: string;
    height: number;
    tags: TLabelTag[];
    canAction?: boolean;
    type: 'single' | 'multipul';
    defaultValues?: TDefaultValues[];
    onCreate?: (name: string) => void;
    onDelete?: (tag: TLabelTag) => void;
    onUpdate?: (tag: TLabelTag) => void;
    onSave?: (selectedTags: TLabelTag[]) => void;
};
export {};
