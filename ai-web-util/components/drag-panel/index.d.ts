import React from 'react';
import './index.less';
export declare const DragPanel: React.ForwardRefExoticComponent<DragPanel & React.RefAttributes<unknown>>;
declare type DragPanel = {
    ctrls?: Ctrl[];
    points?: Point[];
    relations?: Relation[][];
    /** 每层之间的间隔 */
    levelGap?: number;
    /** 同层中，每个节点之间的距离 */
    ptrGap?: number;
    onSelect?: (p: Point) => void;
    onChange?: () => void;
    onPtrAdd?: (ctrlId: any, cb: (ele: JSX.Element, color?: string) => void) => void;
};
declare type Point = {
    id: any;
    x: number;
    y: number;
    ele: JSX.Element;
    color?: string;
    showLinkPtr?: boolean;
    showDelete?: boolean;
};
declare type Relation = {
    to: any;
    from: any;
    desc?: string;
};
declare type Ctrl = {
    id: any;
    ele: JSX.Element;
};
export {};
