/// <reference types="react" />
/**
 * @description
 * 封装了各鼠标事件的容器
 */
export declare const MouseContainer: ({ children, onWheelDirection, onGragSync, onGrag, onMouseDown, onMouseUp, onKeyDownCode, onTextSelect, onBlur, className }: TComMouseContainer) => JSX.Element;
declare type TComMouseContainer = {
    children?: any;
    className?: string;
    /** 滚轮方向 */
    onWheelDirection?: (dir: EWheelDirection) => void;
    /** 拖拽位移（同步版：结束了才返回结果） */
    onGragSync?: (result: {
        detalX: number;
        detalY: number;
    }) => void;
    /** 拖拽位移（异步版：拖拽过程就会返回结果） */
    onGrag?: (result: {
        detalX: number;
        detalY: number;
    }) => void;
    /** 鼠标点击 */
    onMouseDown?: (result: {
        x: number;
        y: number;
    }) => void;
    /** 鼠标点击2 */
    onMouseUp?: (result: {
        x: number;
        y: number;
    }) => void;
    /** 按键盘 */
    onKeyDownCode?: (code: number) => void;
    /** 失去焦点 */
    onBlur?: () => void;
    /** 文字选中 */
    onTextSelect?: (result: {
        txt: string;
        baseOffset: number;
    } | null) => void;
};
/** 指针滚动方向 */
declare enum EWheelDirection {
    up = 0,
    down = 1
}
export {};
