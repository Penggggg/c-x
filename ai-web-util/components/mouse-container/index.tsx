import React, { useRef } from 'react';

/**
 * @description
 * 封装了各鼠标事件的容器
 */
export const MouseContainer = ({ children, onWheelDirection, onGragSync, onGrag, onMouseDown, onMouseUp, onKeyDownCode, onTextSelect, onBlur, className = '' }: TComMouseContainer ) => {

    /**  */
    const eleRef = useRef< any >( null );

    /** 鼠标点击事件 */ 
    const downEvent = useRef< any >( null );

    /** 滚轮事件 */
    const onWheel = ( e: any ) => {
        const d = e.deltaY;
        if ( d === 0 ) { return; }
        !!onWheelDirection && onWheelDirection(
            d < 0 ? 
                EWheelDirection.down : 
                EWheelDirection.up 
        )
    }

    /** 鼠标点击 */
    const _onMouseDown = ( downE: any ) =>{

        const downX = downE.nativeEvent.offsetX;
        const downY = downE.nativeEvent.offsetY;

        downEvent.current = {
            downX,
            downY
        };
        !!onMouseDown && onMouseDown({ x: downX, y: downY })
    }

    /** 鼠标弹起或离开了界面 */
    const _onMouseUp = ( upE: any, isMouseLeave = false ) => {
        try {

            !isMouseLeave && getSelection( );

            const downE = downEvent.current

            if ( !downE|| !upE || !upE.nativeEvent ) { return; }
    
            const { downX, downY } = downE;
            const upX = upE.nativeEvent.offsetX;
            const upY = upE.nativeEvent.offsetY;

            !!onGragSync && onGragSync({
                detalX: upX - downX,
                detalY: upY - downY
            });

            !!onMouseUp && onMouseUp({
                x: upX,
                y: upY
            })

            downEvent.current = null;
        } catch ( e ) { }
    }

    /** 鼠标移动 */
    const onMouseMove = ( moveE: any ) => {
        try {
            const downE = downEvent.current

            if ( !downE|| !moveE || !moveE.target ) { return; }
    
            const { downX, downY } = downE;
            const moveX = moveE.nativeEvent.offsetX;
            const moveY = moveE.nativeEvent.offsetY;

            !!onGrag && onGrag({
                detalX: moveX - downX,
                detalY: moveY - downY
            });
        } catch ( e ) { }
    }

    /** 按键盘 */
    const _onKeyDownCode = ( code: number ) => {
        setTimeout(( ) => {
            !!onKeyDownCode && onKeyDownCode( code )
        }, 30 );
    }

    /** 失去焦点 */
    const _onBlur = ( ) => {
        
        /** 选择文案 */
        getSelection( );

        !!onBlur && onBlur( );
    }

    /** 获取选中文字 */
    const getSelection = ( ) => {
        setTimeout(( ) => {
            const conEle = eleRef.current;
            const curSelect: any = window.getSelection( );
            if ( !curSelect || ( !!curSelect && !curSelect.toString( ))) { 
                return !!onTextSelect && onTextSelect( null );
            }

            let { baseOffset, baseNode } = curSelect;

            // 如果这个div，还套了span这些
            const Index = Array.from( conEle.children )
                .findIndex( x => x === baseNode.parentElement );
            
            const allOffset: any = Array.from( conEle.children )
                .slice( 0, Index )
                .reduce(( pre, cur: any ) => pre + cur.innerText.length, baseOffset );
            
            !!onTextSelect && onTextSelect({
                baseOffset: allOffset,
                txt: curSelect.toString( )
            });
        }, 20 )
    }

    return (
        <div
            ref={ eleRef }
            tabIndex={ -1 }
            onWheel={ onWheel }
            onBlur={ _onBlur }
            onMouseUp={ _onMouseUp }
            onMouseDown={ _onMouseDown }
            onMouseMove={ onMouseMove }
            onMouseLeave={ e => _onMouseUp( e, true )}
            onKeyDown={ e => _onKeyDownCode( e.keyCode)}
            className={ className }
        >
            { !!children && children }
        </div>
    )
}

type TComMouseContainer = {
    children?: any

    className?: string

    /** 滚轮方向 */
    onWheelDirection?: ( dir: EWheelDirection ) => void

    /** 拖拽位移（同步版：结束了才返回结果） */
    onGragSync?: ( result:{ detalX: number, detalY: number }) => void

    /** 拖拽位移（异步版：拖拽过程就会返回结果） */
    onGrag?: ( result:{ detalX: number, detalY: number }) => void

    /** 鼠标点击 */
    onMouseDown?: ( result:{ x: number, y: number }) => void

    /** 鼠标点击2 */
    onMouseUp?: ( result:{ x: number, y: number }) => void

    /** 按键盘 */
    onKeyDownCode?: ( code: number ) => void

    /** 失去焦点 */
    onBlur?: ( ) => void

    /** 文字选中 */
    onTextSelect?: ( 
        result:{ 
            txt: string ,
            baseOffset: number
        } | null 
    ) => void
}

/** 指针滚动方向 */
enum EWheelDirection {
    up,
    down
}