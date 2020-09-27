/// <reference types="react" />
import './index.less';
export declare const TextLabelTag: ({ params, tags, canAction, defaultValue, onDelete, onUpdate, onCreate, onSure }: TextLabelTag) => JSX.Element;
/** 组件属性 */
declare type TextLabelTag = {
    /** 段落 */
    params: string[];
    /** 标签 */
    tags: TextTag[];
    /** 能否操作 */
    canAction?: boolean;
    /** 默认值 */
    defaultValue?: (TSelectingText & {
        tagId: string | number;
    })[];
    onSure?: (labels: (TSelectingText & {
        tagId: string | number;
    })[]) => void;
    onCreate?: (val: string) => void;
    onDelete?: (tag: TextTag) => void;
    onUpdate?: (tag: TextTag) => void;
};
declare type TextTag = {
    val: string;
    id: string | number;
};
/** 正在选中的文字 */
declare type TSelectingText = {
    length: number;
    /** 偏移量 */
    offset: number;
    /** 第几段 */
    paramKey: number;
};
export {};
