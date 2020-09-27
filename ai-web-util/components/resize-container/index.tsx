import React, { useRef, useEffect } from 'react';

/**
 * @description
 * 容器，当调节浏览器窗口时
 * 会返回元素最新的宽高
 */
export const ResizeContainer = ({ children, onChange, onInit, className }: TComResizeContainer ) => {

    const conRef: any = useRef( null );

    /** 获取元素宽高 */
    const getEleAttr = ( ) => {
        try {
            const { offsetWidth, offsetHeight } = conRef.current;
            !!onChange && onChange( offsetWidth, offsetHeight );
        } catch ( e ) { }
    }

    /** didMount */
    useEffect(( ) => {
        setTimeout(( ) => {
            const { offsetWidth, offsetHeight } = conRef.current;
            !!onInit && onInit( offsetWidth, offsetHeight );
        }, 20 );
        window.addEventListener('resize', getEleAttr );
    }, [ ]);

    return (
        <div
            ref={ conRef }
            className={ className || '' }
        >
            { !!children && children }
        </div>
    );
}

type TComResizeContainer = {
    children?: any
    className?: string
    onInit?: ( w: number, h: number ) => void
    onChange?: ( w: number, h: number ) => void
}