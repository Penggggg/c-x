/// <reference types="react" />
/**
 * @description
 * 容器，当调节浏览器窗口时
 * 会返回元素最新的宽高
 */
export declare const ResizeContainer: ({ children, onChange, onInit, className }: TComResizeContainer) => JSX.Element;
declare type TComResizeContainer = {
    children?: any;
    className?: string;
    onInit?: (w: number, h: number) => void;
    onChange?: (w: number, h: number) => void;
};
export {};
