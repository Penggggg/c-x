import { Popover, Button, Tooltip, Modal, message } from 'antd';
import React, { useState, useRef, useEffect, cloneElement, useImperativeHandle } from 'react';
import './index.less';

let hideMsg: any = null;

/**
 * @description
 * 流程图里面，可拖拽的单元
 */
export const DragItem = React.forwardRef(({ 
    id, linkPos, children,
    defaultX = 0, defaultY = 0, linking = null, showLinkPtr = true, showDelete = true,
    onLink, onMove, onDelete, onCancelToLink, onReadyToLink, 
}: DragItem, ref ) => {

    const eleRef = useRef< any >( null );
    const childRef = useRef< any >( null );

    const [ popover, popover$ ] = useState( false );
    const [ isLinking, isLinking$ ] = useState( false );
    const [ startPos, startPos$ ] = useState({ x: 0, y: 0 });
 
    /** 拖拽移动 */
    const onDragStart = ( e: any ) => {
        startPos$({
            x: e.pageX,
            y: e.pageY
        });
    }

    /** 拖拽结束 */
    const onDragEnd = ( e: any ) => {
        const { x, y } = startPos;
        const { pageX, pageY } = e;

        const deal = ( e: any, delta: number, type: 'left' | 'top' ) => {
            return Number( e.target.style[ type ].slice( 0, -2 )) + delta;
        }

        const setStyle = ( e: any, val: number, type: 'left' | 'top') => {
            e.target.style[ type ] = `${val}px`;
        }

        const newX = deal( e, pageX - x, 'left' )
        const newY = deal( e, pageY - y, 'top' )
        setStyle( e, newY, 'top' );
        setStyle( e, newX, 'left' );

        !!onMove && onMove({ x: newX, y: newY })
    }

    /** 按键删除 */
    const _onKeyDown = ( e: any ) => {
        if ( e.keyCode === 8 && e.target === eleRef.current ) {
            showDelete && _onDelete( );
        }
    }

    /** 节点删除 */
    const _onDelete = ( ) => {
        Modal.confirm({
            title: '确认删除吗？',
            content: '',
            okType: 'danger',
            onOk: ( ) => {
                !!onDelete && onDelete( id )
            }
        })
    }

    /** 进入连接状态 */
    const _onLink = ( ) => {
        isLinking$( true );
        !!onReadyToLink && onReadyToLink( id );
        hideMsg = message.loading((
            <div style={{ display: 'inline-block' }}>
                点击其他节点进行连接
                <Tooltip
                    title='取消'
                >
                    <Button 
                        size='small'
                        type='link'
                        shape='circle' 
                        icon='close-circle' 
                        style={{ marginLeft: 10 }}
                        onClick={ cancelLink }
                    />
                </Tooltip>
            </div>
        ), 0 );
    }

    /** 取消连接 */
    const cancelLink = ( ) => {
        isLinking$( false );
        setPointer('default');
        !!hideMsg && hideMsg( );
        !!onCancelToLink && onCancelToLink( );
    }

    /** 设置鼠标 */
    const setPointer = ( cursor: 'sw-resize' | 'default' ) => {
        document.body.style.cursor = cursor
    }

    /** 点击节点 */
    const onClick = ( e: any ) => {
        if ( linking === null || linking === undefined ) return;
        if ( !!onLink ) {
            onLink( id, cancelLink );
            e.stopPropagation( );
        }
    }

    useEffect(( ) => {
        setPointer( isLinking ? 'sw-resize' : 'default' );
    }, [ isLinking ]);

    useEffect(( ) => {
        const ele = eleRef.current;
        if ( !!defaultX ) {
            ele.style.left = `${defaultX}px`
        }
        if ( !!defaultY ) {
            ele.style.top = `${defaultY}px`
        }
        return ( ) => {
            cancelLink( );
        }
    }, [ ]);

    useEffect(( ) => {
        // !!popover && setTimeout(( ) => {
        //     popover$( false );
        // }, 1000 );
    }, [ popover ]);

    /** ref引用 */
    useImperativeHandle( ref, ( ) => {
        /** 子节点暴露的getData应该是Promise形式的 */
        const { getData, open } = ( childRef.current || { });
        return {
            _open: open || (( ) => { }),
            _getData: getData || (( ) => Promise.resolve( null ))
        }
    })

    return (
        <Popover 
            visible={ popover }
            mouseLeaveDelay={ 2 }
            onVisibleChange={ popover$ }
            content={ !linking ? (
                <Button.Group>
                    {
                        !!showDelete && (
                            <Tooltip 
                                title='删除'
                            >
                                <Button 
                                    size='small' 
                                    icon='delete'
                                    type='primary' 
                                    onClick={ _onDelete }
                                />
                            </Tooltip>
                        )
                    }
                    <Tooltip 
                        title='指向其他节点'
                    >
                        <Button 
                            size='small' 
                            type='primary' 
                            icon='arrow-right'
                            onClick={ _onLink }
                        />
                    </Tooltip>
                </Button.Group>
            ) : 
                linking !== id ?
                    <Button 
                        size='small' 
                        type='primary' 
                        icon='arrow-down'
                        onClick={ onClick }
                    /> :
                    null
            } 
        >
            <div
                ref={ eleRef }
                tabIndex={ -1 }
                onClick={ onClick }
                onDragEnd={ onDragEnd }
                onKeyDown={ _onKeyDown }
                onDragStart={ onDragStart }
                draggable='true'
                className='com-drag-item'
            >
                
                <div className={`event-cover ${ linking ? 'stop' : '' }`}>
                    {
                        !!children && cloneElement(
                            children,
                            { ref: childRef }
                        )
                    }
                </div>

                {
                    ( !!showLinkPtr && !!linkPos ) && (
                        <div
                            className='linkPos'
                            style={ linkPos.color ? 
                                {
                                    top: linkPos.y,
                                    left: linkPos.x,
                                    background: linkPos.color
                                } :
                                {
                                    top: linkPos.y,
                                    left: linkPos.x
                                }
                        }
                        ></div>
                    )
                }
            </div>
        </Popover>   
    )
})

type DragItem = {
    id?: any
    children?: any
    defaultX?: number
    defaultY?: number
    /** 连接中状态的开始节点 */
    linking?: any
    /** 连接点的位置 */
    linkPos?: {
        x: number,
        y: number,
        color?: string
    }
    /** 展示删除按钮 */
    showDelete?: boolean
    /** 展示连接点 */
    showLinkPtr?: boolean
    /** 找到连接点 */
    onLink?: ( id: any, cb: ( ) => void ) => void
    /** 取消连接 */
    onCancelToLink?: ( ) => void
    /** 点击第一个连接点，进入连接状态 */
    onReadyToLink?: ( id?: any ) => void
    /** 删除节点 */
    onDelete?: ( id?: any ) => void
    /** 节点移动 */
    onMove?: ( p: { 
        x: number
        y: number
    }) => void
}