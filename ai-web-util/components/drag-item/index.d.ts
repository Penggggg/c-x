import React from 'react';
import './index.less';
/**
 * @description
 * 流程图里面，可拖拽的单元
 */
export declare const DragItem: React.ForwardRefExoticComponent<DragItem & React.RefAttributes<unknown>>;
declare type DragItem = {
    id?: any;
    children?: any;
    defaultX?: number;
    defaultY?: number;
    /** 连接中状态的开始节点 */
    linking?: any;
    /** 连接点的位置 */
    linkPos?: {
        x: number;
        y: number;
        color?: string;
    };
    /** 展示删除按钮 */
    showDelete?: boolean;
    /** 展示连接点 */
    showLinkPtr?: boolean;
    /** 找到连接点 */
    onLink?: (id: any, cb: () => void) => void;
    /** 取消连接 */
    onCancelToLink?: () => void;
    /** 点击第一个连接点，进入连接状态 */
    onReadyToLink?: (id?: any) => void;
    /** 删除节点 */
    onDelete?: (id?: any) => void;
    /** 节点移动 */
    onMove?: (p: {
        x: number;
        y: number;
    }) => void;
};
export {};
