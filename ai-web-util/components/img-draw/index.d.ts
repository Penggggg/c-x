/// <reference types="react" />
import './index.less';
/**
 * @description
 *
 * 图片画图组件
 *
 * 1、图片展示/居中
 *
 * 2、缩放图片（指针滚动）
 * 3、位置拖拽（放大后，用鼠标拖拽）
 *
 * 4、画正方形框框
 * 5、画圆形框框
 * 6、画线条
 *
 * 7、操作撤回
 * 8、操作唯一性（只能存在一个框框）
 *
 * 9、extra跟标签进行配合
 *
 */
export declare const ImgDraw: ({ url, height, canZoom, canDrag, defaultKuangArr, onSelectKuang, onChangeKuang }: TComImgDraw) => JSX.Element;
declare type TDefaultKuang = {
    /** 绝对坐标 */
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
    key?: any;
    color?: TPenColor;
};
declare type TComImgDraw = {
    /** 图片路径 */
    url: string;
    /** canvas高度 */
    height: number;
    /** 能否缩放 */
    canZoom?: boolean;
    /** 能否拖拖拽 */
    canDrag?: boolean;
    /** 默认框 */
    defaultKuangArr?: TDefaultKuang[];
    /** 框变动 */
    onChangeKuang?: (kuangs: TCbKuang[]) => void;
    /** 选中某个框 */
    onSelectKuang?: (kuang: TCbKuang | null) => void;
};
declare type TCbKuang = {
    id: any;
    key: number;
    /** 绝对坐标 */
    abs: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    /** 相对比例 */
    rate: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    /** 图片的大小 */
    img: {
        w: number;
        h: number;
    };
    /** 框的颜色 */
    color?: TPenColor;
};
/** 笔的颜色 | 红/黄/绿/蓝/灰/黑/白 */
declare type TPenColor = '#f5222d' | '#ffec3d' | '#52c41a' | '#1890ff' | '#949494' | '#000' | '#fff';
export {};
