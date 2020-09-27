/// <reference types="react" />
import './index.less';
export declare const Imglist: ({ list, imgWdith, imgHeight, showNext, showPre, defaultImg, toolTips, value, onSelect, onPageChange }: TCImglist) => JSX.Element;
declare type TCImglist = {
    list: string[];
    imgWdith: number;
    imgHeight: number;
    /** 提示 */
    toolTips?: string[];
    /** 当前选中图片的url */
    value?: string;
    /** 展示按钮 */
    showPre?: boolean;
    showNext?: boolean;
    /** 展示默认的图片 */
    defaultImg?: string;
    /** 封面文字 */
    coverTextFunc?: (s: string) => string;
    onSelect?: (imgUrl: string, index: number, cb: () => void) => void;
    onPageChange?: (type: 'pre' | 'next', cb: () => void) => void;
};
export {};
