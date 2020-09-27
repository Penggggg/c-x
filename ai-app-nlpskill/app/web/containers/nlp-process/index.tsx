import uuid from 'uuid';
import { DragPanel } from '@cvte/ai-web-util/components';
import React, { useMemo, useRef, useState, useEffect, useImperativeHandle } from 'react';
import { NlpPtrSlot } from '../../containers/nlp-ptr-slot';
import { NlpPtrFetch } from '../../containers/nlp-ptr-fetch';
import { NlpPtrStart } from '../../containers/nlp-ptr-start';
import { NlpPtrRes } from '../nlp-ptr-response';
import './index.less';

/**
 * Nlp流程图
 */
export const NlpProcess = React.forwardRef(
    ({ points = [ ], relations = [ ], abilityId = '', frames = [ ]}: NlpProcess, ref ) => {

    const panelRef = useRef< any >( null );

    /** 节点id到类型到映射 */
    const [ pid2Type, pid2Type$ ] = useState<{[ key: string ]: PointType }>({ });

    const generatePtr = ( type: PointType, defaultValue?: any ) => {
        if ( type === PointType.collection ) {
            return (
                <NlpPtrSlot
                    abilityId={ abilityId }
                    defaultValue={ defaultValue }
                />
            )
        } else if ( type === PointType.answer ) {
            return (
                <NlpPtrRes 
                    frames={ frames }
                    abilityId={ abilityId }
                    defaultValue={ defaultValue }
                />
            )
        } else if ( type === PointType.fetch ) {
            return (
                <NlpPtrFetch 
                    abilityId={ abilityId }
                    defaultValue={ defaultValue }
                />
            )
        } else {
            return (
                <NlpPtrStart 
                    abilityId={ abilityId }
                    defaultValue={ defaultValue }
                />
            )
        }
    }

    const generateCtrl = ( type: PointType ) => {
        if ( type === PointType.collection ) {
            return (
                <div
                    className='com-nlp-process-ctrl'
                 >
                    <div 
                        className='ball purple'
                    ></div>
                    词槽收集
                </div>
            )
        } else if ( type === PointType.fetch ) {
            return (
                <div
                    className='com-nlp-process-ctrl'
                 >
                    <div 
                        className='ball blue'
                    ></div>
                    资源调用
                </div>
            )
        } else if ( type === PointType.answer ) {
            return (
                <div
                    className='com-nlp-process-ctrl'
                 >
                    <div 
                        className='ball cyan'
                    ></div>
                    回复
                </div>
            )
        } else {
            return <div></div>
        }
    }

    const generatePtrColor = ( type: PointType ) => {
        if ( type === PointType.collection ) {
            return '#ffadd2'
        } else if ( type === PointType.answer ) {
            return '#87e8de'
        } else if ( type === PointType.fetch ) {
            return '#91d5ff'
        } else {
            return '#ffadd2'
        }
    } 

    const onPtrAdd = ( cid: PointType, pid: any, cb ) => {
        pid2Type$({
            ...pid2Type,
            [ pid ]: cid
        })
        cb( generatePtr( cid, { }), generatePtrColor( cid ))
    }

    /** ref引用，给外层暴露方法 */
    useImperativeHandle( ref, ( ) => ({
        /** 这里应该要根据relation遍历节点的_getData */
        getData: async ( ) => {
            const { ptrVal, relations } = await panelRef.current.getData( );
            const _ptrVal = ptrVal.map( p => ({
                ...p,
                id: p.pid,
                pid: undefined,
                // 插入类型
                type: pid2Type[ p.pid ] || PointType.start
            }))
            return {
                relations,
                ptrVal: _ptrVal
            };
        }
    }))

    const points$ = useMemo(( ) => {
        const result: any[ ] = points.map(( p , k )=> {
            const { id, x, y, val } = p;
            return {
                id: id,
                x: x || (( k * 100 ) + 100 ),
                y: y || (( k * 100 ) + 100 ),
                ele: generatePtr( p.type, val ),
                color: generatePtrColor( p.type ),
                showLinkPtr: p.type !== PointType.start,
                showDelete: p.type !== PointType.start,
            }
        });
        // 插入开始节点
        if ( !points.length ) {
            result.unshift({
                y: 10,
                x: 250,
                id: uuid.v4(),
                showLinkPtr: false,
                showDelete: false,
                type: PointType.start,
                ele: generatePtr( PointType.start )
            });
        } 
        return result;
    }, [ points ]);

    /** 初始化节点类型 */
    useEffect(( ) => {
        const _pid2Type = points.reduce(( pre, cur ) => {
            return {
                ...pre,
                [ cur.id ]: cur.type
            }
        }, { });
        pid2Type$( _pid2Type );
    }, [ ]);

    return (
        <DragPanel
            ref={ panelRef }
            points={ points$ }
            relations={ relations }
            ctrls={[
                {
                    id: PointType.collection,
                    ele: generateCtrl( PointType.collection )
                }, {
                    id: PointType.fetch,
                    ele: generateCtrl( PointType.fetch )
                }, {
                    id: PointType.answer,
                    ele: generateCtrl( PointType.answer )
                }
            ]}
            onPtrAdd={ onPtrAdd }
        />
    )
})

type NlpProcess = {
    points?: Point[ ]
    relations?: Relation[ ][ ]
    abilityId?: any
    frames?: {
        id?: any,
        name?: any
    }[ ]
}

type Point = {
    id: any
    x?: number,
    y?: number,
    type: PointType
    val?: any
}

type Relation = {
    to: any
    from: any
    desc?: string
}

enum PointType {
    collection = 'slot',
    fetch = 'resource',
    answer = 'response_condition',
    start = 'start',
}