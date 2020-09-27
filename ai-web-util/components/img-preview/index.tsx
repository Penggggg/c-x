import React, { useRef, useState, useEffect } from 'react';
import './index.less';

/** 
 * 图片预览区域 
 */
export const ImgPreview = ({ src, width, height, radius, background }: TImgPreview ) => {

    /** 图片 */
    const imgRef: any = useRef( null );

    /** 图片展示模式 */
    const [ mode, mode$ ] = useState('');

    /** 调整图片模式 */
    const fixPic = ( ) => {
        const imgEle = imgRef.current;
        const { naturalHeight, naturalWidth } = imgEle;

        const inputRate = Number(( width / height ).toFixed( 2 ));
        const imgRate = Number(( naturalWidth / naturalHeight ).toFixed( 2 ));

        // 图片比较宽
        if ( imgRate > inputRate ) {
            mode$('width-img');
        // 图片比较窄
        } else {
            mode$('height-img');
        }
    }

    const onImgLoad = ( ) => {
        fixPic( );
    }

    useEffect(( ) => {
        fixPic( );
    }, [ width, height ])

    return (
        <div 
            className="com-img-preview"
            style={{ 
                width, 
                height, 
                background: background || '#fff',
                borderRadius: radius ? `${radius}px` : 0 
            }}
        >
            <img 
                src={ src }
                ref={ imgRef }
                className={ mode }
                onLoad={ onImgLoad }
            />
        </div>
    );
}

type TImgPreview = {
    width: number
    height: number
    src: string
    radius?: number // 曲率
    background?: string // 区域背景颜色
};