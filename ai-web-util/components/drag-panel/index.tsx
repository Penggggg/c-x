import { v4 } from 'uuid';
import { Tooltip, notification } from 'antd';
import React, { useState, useMemo, useEffect, createRef, useImperativeHandle, useRef } from 'react';
import { Ptr2Line, DragItem } from '../index';
import './index.less';

export const DragPanel = React.forwardRef(
    ({ points = [ ], relations = [ ], ctrls = [ ], onPtrAdd }: DragPanel, ref ) => {

    /** 节点之间连线，对节点右上角的偏差 */
    const delX = 14;
    const delY = 14;

    /** 右侧控制bar的宽度 */
    const ctrlBarwidth = 150;

    const itemRefs = useRef< any[ ]>([ ]);

    /** 连接中的起始节点 */
    const [ sPid, sPid$ ] = useState< any >( null );

    /** 拖拽控制面板的位移 */
    const [ ctrlPos, ctrlPos$ ] = useState({ x: 0, y: 0 })

    /** 拖拽中的控制组件 */
    const [ ctrling, ctrling$ ] = useState< Ctrl | null >( null );

    /** 内部节点 */
    const [ _points, _points$ ] = useState< Point[ ]>([ ]);

    /** 内部关系 */
    const [ _relations, _relations$ ] = useState< Relation[ ][ ]>([ ]);

    /** 节点移动 */
    const onPtrMove = ( pid: any, pos: any ) => {

        const { x, y } = pos;
        const temp = [ ..._points ];
        const Index = _points.findIndex( p => p.id === pid );
        const ptr = temp[ Index ];

        temp.splice( Index, 1, {
            ...ptr,
            x,
            y
        });
        _points$( temp );
    }

    /** 节点删除 */
    const onPtrDel = ( pid: any ) => {

        // 先删除节点
        const temp = [ ..._points ];
        const Index = temp.findIndex( x => x.id === pid );
        temp.splice( Index, 1 );
        _points$( temp );

        // 再删除关系
        const rels: Relation[ ][ ] = [ ];
        _relations.map( chain => {
            rels.push( chain.filter( x => !( x.to === pid || x.from === pid )));
        });
        _relations$( rels );
    }

    /** 节点增加 */
    const _onPtrAdd = ( e: any ) => {
        
        if ( !ctrling ) return;

        const pid = v4( );
        const cid = ctrling.id;
        const { pageX, pageY } = e;
        const y = pageY - ctrlPos.y;
        const x = pageX - ctrlPos.x - ctrlBarwidth;

        ctrling$( null );
        ctrlPos$({ x: 0, y: 0 });
        
        !!onPtrAdd && onPtrAdd( cid, pid, ( ele, color ) => {
            _points$( points => [
                ...points,
                {
                    x,
                    y,
                    ele,
                    id: pid,
                    color: color || ''
                }
            ]);
            // 这里应该要调子节点的hooks，便于张开drawer
            setTimeout(( ) => {
                const { _open } = itemRefs.current.find( x => x.pid === pid ).ref.current;
                _open( );
            }, 100 )
        });
    }

    /** 控制组件移动 */
    const onCtrlDrag = ( e: any, c: Ctrl ) => {
        ctrlPos$({
            x: e.pageX,
            y: e.pageY
        });
        ctrling$( c );
    }

    /** 关系删除 */
    const onRelDel = ({ sx, sy, ex, ey }: any ) => {

        const rels: Relation[ ][ ] = [ ];
        const to = _points.find( x => x.x === ex - delX && x.y === ey - delY ) as Point;
        const from = _points.find( x => x.x === sx - delX && x.y === sy - delY ) as Point;
        if ( !to && !from ) return

        _relations.map( chain => {
            const inner = chain.filter( x => !( x.to === to.id && x.from === from.id ))
            !!inner.length && rels.push( inner )
        })
        _relations$( rels );
    }

    /** 找到节点进行连接 */
    const onLink = ( ePid: any, cb: any ) => {

        const err = ( description : any) => {
            notification.info({
                message: '提示',
                description
            });
            return cb( );
        }

        /**
         * check: 
         * 
         * 1、是否为自己
         * 2、是否已有方向相同、相反的关系
         */
        if ( sPid === ePid ) return err('不能指向自己')

        const hasSame = _relations.some(
            chain => chain.some( p => p.from === sPid && p.to === ePid )
        );
        if ( hasSame ) return err('已存在相同连接')

        const hasReverse = _relations.some(
            chain => chain.some( p => p.from === ePid && p.to === sPid )
        );
        if ( hasReverse ) return err('已存在相反方向的连接，请先删除')

        /**
         * 插入逻辑：
         * 判断【起始节点】在所有关系链中的位置
         * 
         * 1、暂不存在于任何关系链中，则创建新关系链
         * 2、在关系链中处于链头或链中或链尾，则为给当前关系链插入新的关系
         */
        const judgePos = ( pid: any, chain: Relation[ ]) => {
            if ( chain.every( p => p.from !== pid && p.to !== pid )) return PtrPos.empty;
            if (!!chain.find( p => p.from === pid ) &&
                !chain.find( p => p.to === pid )) return PtrPos.start;
            if (!!chain.find( p => p.to === pid ) &&
                !chain.find( p => p.from === pid )) return PtrPos.end;
            if (!!chain.find( p => p.to === pid ) &&
                !!chain.find( p => p.from === pid )) return PtrPos.mid;
            return PtrPos.empty
        }

        const isIndependent = _relations.every( chain => judgePos( sPid, chain ) === PtrPos.empty );

        /** 尝试合并2条关系 */
        const sChainIndex = _relations.findIndex( chain => judgePos( sPid, chain ) === PtrPos.end );
        const eChainIndex = _relations.findIndex( chain => judgePos( ePid, chain ) === PtrPos.start );

        // 生成空的关系
        if ( isIndependent ) {
            _relations$([
                ..._relations,
                [
                    {
                        from: sPid,
                        to: ePid
                    }
                ]
            ]);

        /** 尝试合并2条关系 */
        } else if ( sChainIndex !== -1 && eChainIndex !== -1 ) {

            const sChain = _relations[ sChainIndex ];
            const eChain = _relations[ eChainIndex ];
            const result = _relations.filter(( c, k ) => k !== sChainIndex && k !== eChainIndex );
            result.push([
                ...sChain,
                {
                    from: sPid,
                    to: ePid
                },
                ...eChain
            ])
            _relations$( result );

        } else {
            // 普通插入
            const result: Relation[ ][ ] = [ ];

            _relations.map( chain => {

                const meta = [ ...chain ];
                const shouldAppend = judgePos( sPid, chain ) !== PtrPos.empty;

                !!shouldAppend && meta.push({
                    from: sPid,
                    to: ePid
                });
                result.push( meta )
            });
            _relations$( result );
        }
        cb( );
    }

    /** 目前能看到的所有连线 */
    const lines$ = useMemo<Line [ ]>(( ) => {
        const result: Line[ ] = [ ];
        _relations.map( chain => {
            chain.map(({ from, to, desc }) => {

                const toPtr = _points.find( x => x.id === to );
                const fromPtr = _points.find( x => x.id === from );
                
                if ( !toPtr || !fromPtr ) return;

                result.push({
                    desc,
                    sx: fromPtr.x + delX,
                    sy: fromPtr.y + delY,
                    ex: toPtr.x + delX,
                    ey: toPtr.y + delY
                });
            });
        });
        return result;
    }, [ _points, _relations ])


    /** 节点的Ref */
    const itemRefs$ = useMemo(( ) => {
        return _points.map( x => ({
            pid: x.id,
            ref: createRef< any >( )
        }));
    }, [ _points ]);

    /** ref引用，给外层暴露方法 */
    useImperativeHandle( ref, ( ) => ({
        /** 这里应该要根据relation遍历节点的_getData */
        getData: async ( ) => {

            const getPtrData = async ( itemRef: any ) => {
                const { pid } = itemRef;
                const ptr = _points.find( x => x.id === pid );
                return {
                    pid: pid,
                    x: !!ptr ? ptr.x : 0,
                    y: !!ptr ? ptr.y : 0,
                    // 这里是个promise
                    val: await itemRef.ref.current._getData( )
                }
            };

            const ptrVal = await Promise.all(
                itemRefs$.map( getPtrData )
            )
            
            return {
                ptrVal,
                relations: _relations
            }
        }
    }));

    useEffect(( ) => {
        itemRefs.current = itemRefs$;
    }, [ itemRefs$ ])

    useEffect(( ) => {
        _points$( points );
        _relations$( relations );
    }, [ ]);

    useEffect(( ) => {
        // console.log(`points: `, _points );
        // console.log(`relation: `, _relations );
    }, [ _relations, _points ])

    return (
        <div 
            className='com-drag-panel'
        >

            {/* 操作bar */}
            {
                ctrls.length > 0 && (
                    <div
                        className='controll-con'
                        style={{ width: ctrlBarwidth }}
                    >
                        {
                            ctrls.map( c => (
                                <Tooltip
                                    key={ c.id }
                                    placement='topLeft'
                                    title='拖到右侧，进行添加'
                                >
                                    <div
                                        key={ c.id }
                                        draggable='true'
                                        className='controll-item'
                                        onDragStart={ e => onCtrlDrag( e, c )}
                                    >
                                        { c.ele }
                                    </div>
                                </Tooltip>
                            ))
                        }
                    </div>
                )
            }

            {/* 面板 */}
            <div 
                onDrop={ _onPtrAdd }
                className='drag-panel-con'
                onDragOver={ e => e.preventDefault( )}
            >
                <div 
                    className='drag-panel-con-stretching'
                >
                    {/* 节点 */}
                    {
                        _points.map(( p, k ) => (
                            <DragItem
                                id={ p.id }
                                key={ p.id }
                                linkPos={{
                                    x: delX,
                                    y: delY,
                                    color: p.color
                                }}
                                defaultX={ p.x }
                                defaultY={ p.y }
                                linking={ sPid }
                                onLink={ onLink }
                                onDelete={ onPtrDel }
                                showLinkPtr={ p.showLinkPtr }
                                showDelete={ p.showDelete }
                                ref={ itemRefs$[ k ].ref }
                                onReadyToLink={ pid => sPid$( pid )}
                                onCancelToLink={( ) => sPid$( null )}
                                onMove={ pos => onPtrMove( p.id, pos )}
                            >
                                { p.ele }
                            </DragItem>
                        ))
                    }

                    {/* 连线 */}
                    {
                        lines$.map(( l, k ) => (
                            <Ptr2Line 
                                key={ k }
                                sx={ l.sx }
                                sy={ l.sy }
                                ex={ l.ex }
                                ey={ l.ey }
                                desc={ l.desc }
                                onDelete={ onRelDel }
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
})

type DragPanel = {
    ctrls?: Ctrl[ ]
    points?: Point[ ]
    relations?: Relation[ ][ ]
    /** 每层之间的间隔 */
    levelGap?: number,
    /** 同层中，每个节点之间的距离 */
    ptrGap?: number
    onSelect?: ( p: Point ) => void
    onChange?: ( ) => void
    onPtrAdd?: ( 
        ctrlId: any, 
        pointId: any,
        cb: ( ele: JSX.Element, color?: string ) => void
    ) => void
}

type Point = {
    id: any,
    x: number,
    y: number,
    ele: JSX.Element
    color?: string
    showLinkPtr?: boolean
    showDelete?: boolean
}

type Relation = {
    to: any
    from: any
    desc?: string
}

type Ctrl = {
    id: any
    ele: JSX.Element
}

type Line = {
    desc?: string
    sx: number,
    sy: number,
    ex: number,
    ey: number
}

/** 节点在关系链中的位置 */
enum PtrPos {
    start,
    mid,
    end,
    empty
}