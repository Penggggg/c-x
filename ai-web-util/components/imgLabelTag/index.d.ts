/// <reference types="react" />
import './index.less';
/**
 * @description
 * 图片标注里面的，标签标注
 */
export declare const ImgLabelTag: ({ src, height, tags, type, canAction, defaultSelected, onCreate, onSave, onDelete, onUpdate }: TComImgLabelTag) => JSX.Element;
declare type TLabelTag = {
    id: string;
    name: string;
    [key: string]: any;
};
declare type TComImgLabelTag = {
    src: string;
    height: number;
    canAction: boolean;
    tags: TLabelTag[];
    type: 'single' | 'multipul';
    defaultSelected?: string[];
    onCreate?: (name: string) => void;
    onDelete?: (tag: TLabelTag) => void;
    onUpdate?: (tag: TLabelTag) => void;
    onSave?: (selectedTags: TLabelTag[]) => void;
};
export {};
