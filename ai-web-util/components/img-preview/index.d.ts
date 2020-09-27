/// <reference types="react" />
import './index.less';
/**
 * 图片预览区域
 */
export declare const ImgPreview: ({ src, width, height, radius, background }: TImgPreview) => JSX.Element;
declare type TImgPreview = {
    width: number;
    height: number;
    src: string;
    radius?: number;
    background?: string;
};
export {};
