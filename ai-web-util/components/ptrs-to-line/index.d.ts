/// <reference types="react" />
import './index.less';
/**
 *
 * @description
 * 2个点之间的连线
 */
export declare const Ptr2Line: ({ sx, sy, ex, ey, desc, color, onDelete }: Ptr2Line) => JSX.Element;
declare type Ptr2Line = {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
    desc?: string;
    color?: string;
    onDelete?: (p: {
        sx: number;
        sy: number;
        ex: number;
        ey: number;
    }) => void;
};
export {};
