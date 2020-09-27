import { http } from '@cvte/ai-web-util/util';
import React, { useEffect, useState, useMemo } from 'react';
import { Button, Card, Timeline, Modal, Radio } from 'antd';

import { showContent, showSlot } from '../../util/nlp';
import { findDic, findDicCN } from '../../util/dic';
import { NlpPtrStartV2, NlpPtrSlotV2, NlpPtrFetchV2, NlpPtrEndV2, NlpPtrResponseV2, NlpClonePtr } from '../index';
import './index.less';

export const NlpProcessV2 = ({ meta, abilityId = '', frames = [ ]}: NlpProcessV2 ) => {

    /** 节点列表 */
    const [ nodes, nodes$ ] = useState< Ptr[ ]>([ ]);

    /** 创建·准备答复 */
    const [ showReady, showReady$ ] = useState( false );

    /** 创建·执行答复 */
    const [ showExec, showExec$ ] = useState( false );

    /** 正在创建 */
    const [ creating, creating$ ] = useState( false );

    /** 节点类型·准备答复 */
    const [ readyType, readyType$ ] = useState< any >( null );

    /** 节点类型·执行答复 */
    const [ execType, execType$ ] = useState< any >( null );

    /** 收起/展开 */
    const [ hideReady, hideReady$ ] = useState( false );

    /** 收起/展开 */
    const [ hideExec, hideExec$ ] = useState( false );

    /** 获取节点列表 */
    const fetchNodes = ( ) => {
        http.get< Ptr[ ]>({
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${meta.node_id}/flow_config`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            nodes$( data );
        })
    }

    /** 添加准备答复节点 */
    const onCreateReady = ( ) => {
        if ( !start$ || !readyType || creating ) return;
        creating$( true );
        http.post< any >({
            data: {
                node_type: readyType,
                parent_id: start$.parent_id,
                step_type: StepType.ready_response,
                previous_sibling: beforeReady$,
                node_name:  findDicCN('nlp.ready_response', readyType ),
            },
            successMsg: '创建成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            fetchNodes( );
            readyType$('');
            creating$( false );
            showReady$( false );
        })
    }

    /** 添加执行答复节点 */
    const onCreateExec = ( ) => {
        if ( !start$ || !execType || creating ) return;

        creating$( true );
        http.post< any >({
            data: {
                previous_sibling: beforeExec$,
                resType: execType, // 回复类型
                output: {
                    show_type: execType
                },
                parent_id: start$.parent_id,
                step_type: StepType.exec_response,
                node_type: 'response_condition', // 回复节点
                node_name: findDicCN('nlp.exec_response', execType ),
            },
            successMsg: '创建成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            fetchNodes( );
            execType$('');
            creating$( false );
            showExec$( false );
        })
    }

    /** 删除节点 */
    const onDeletePtr = node_id => {
        http.delete({
            successMsg: '删除成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            fetchNodes( );
        })
    }

    /** 移动节点 */
    const onMovePtr = ( node_id, action ) => {
        http.post({
            successMsg: '操作成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}/action/${action}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            fetchNodes( );
        })
    }

    /** 开始节点 */
    const start$ = useMemo< Ptr | undefined >(( ) => {
        return nodes.find( x => x.node_type === PtrType.frame && x.step_type === StepType.start )
    }, [ nodes ]);

    /** 结束节点 */
    const end$ = useMemo< Ptr | undefined >(( ) => {
        return nodes.find( x => x.node_type === PtrType.frame && x.step_type === StepType.end )
    }, [ nodes ]);

    /** 准备答复 */
    const ready$ = useMemo<{ data: Ptr[ ], show: Ptr[ ]}>(( ) => {
        const _ready = nodes.filter( x => x.step_type === StepType.ready_response );
        const head = _ready.find( x => x.previous_sibling === meta.node_id )

        if ( !_ready.length || !head ) {
            return {
                data: [ ],
                show: [ ]
            }
        } 

        // 构建链表（顺序）
        const link = arr => {
            const last = arr[ arr.length -1 ];
            if ( !last ) return arr;
            const next = _ready.find( x => x.previous_sibling === last.node_id );
            if ( !next ) return arr;
            return link([ ...arr, next ]);
        }

        const res = link([ head ]);       
        return {
            data: res,
            show: !hideReady ? res : [ ]
        };
    }, [ nodes, hideReady ]);

    /** 执行答复 */
    const exec$ = useMemo<{ data: Ptr[ ], show: Ptr[ ]}>(( ) => {
        const readyLast = ready$.data[ ready$.data.length - 1 ];
        const _ready = nodes.filter( x => x.step_type === StepType.exec_response );
        const head = _ready.find( x => x.previous_sibling === meta.node_id ||( !!readyLast && x.previous_sibling === readyLast.node_id  ))

        if ( !_ready.length || !head ) {
            return {
                data: [ ],
                show: [ ]
            }
        }

        // 构建链表（顺序）
        const link = arr => {
            const last = arr[ arr.length -1 ];
            if ( !last ) return arr;
            const next = _ready.find( x => x.previous_sibling === last.node_id );
            if ( !next ) return arr;
            return link([ ...arr, next ]);
        }

        const res = link([ head ]);       
        return {
            data: res,
            show: !hideExec ? res : [ ]
        }
    }, [ nodes, ready$, hideExec ]);

    /** 准备答复节点链头的上一个节点 */
    const beforeReady$ = useMemo(( ) => {
        const last = ready$.data[ ready$.data.length - 1 ];
        return !!last ? last.node_id : meta.node_id;
    }, [ ready$, meta ]);

    /** 执行答复节点链头的上一个节点 */
    const beforeExec$ = useMemo(( ) => {
        const execLast = exec$.data[ exec$.data.length - 1 ];
        const readyLast = ready$.data[ ready$.data.length - 1 ];

        let previous_sibling = '';
        if ( !readyLast ) {
            previous_sibling = !!execLast ? execLast.node_id : meta.node_id
        } else {
            previous_sibling = !!execLast ? execLast.node_id : readyLast.node_id
        }

        return previous_sibling;
    }, [ ready$, exec$, meta ]);

    /** didMount */
    useEffect(( ) => {
        fetchNodes( );
    }, [ ])

    return (
        <div className='con-nlp-process-v2'>

            {/* 流程图 */}
            <div className='frames-block'>

                {/* 开始节点 */}
                {
                    !!start$ && (
                        <NlpPtrStartV2 
                            abilityId={ abilityId }
                            name={ start$.node_name }
                            node_id={ start$.node_id }
                        />
                    )
                }
                
                {/* 准备答复阶段 */}
                <Card
                    hoverable
                    title='准备答复阶段' 
                    extra={(
                        <a 
                            onClick={( ) => hideReady$( !hideReady )}
                        >
                            { !hideReady ? ' 收起' : '展开' }
                        </a>
                    )} 
                    style={{ width: '100%', margin: '50px 0' }}
                >
                    <Timeline>
                        {
                            ready$.show.map( r => (
                                <Timeline.Item
                                    key={ r.node_id }
                                >
                                    {
                                        r.node_type === PtrType.slot && (
                                            <NlpPtrSlotV2 
                                                name={ r.node_name }
                                                abilityId={ abilityId }
                                                node_id={ r.node_id }
                                                onDelete={( ) => onDeletePtr( r.node_id )}
                                                onDown={( ) => onMovePtr( r.node_id, 'down')}
                                                onUp={( ) => onMovePtr( r.node_id, 'up')}
                                                defaultContent={ showSlot( r.slot_context || { })}
                                            />
                                        )
                                    }
                                    {
                                        r.node_type === PtrType.resource && (
                                            <NlpPtrFetchV2 
                                                name={ r.node_name }
                                                node_id={ r.node_id }
                                                abilityId={ abilityId }
                                                defaultContent={( r.config_info || { }).url || ''}
                                                onDelete={( ) => onDeletePtr( r.node_id )}
                                                onDown={( ) => onMovePtr( r.node_id, 'down')}
                                                onUp={( ) => onMovePtr( r.node_id, 'up')}
                                            />
                                        )
                                    }
                                </Timeline.Item>
                            ))
                        }
                        <Timeline.Item>
                            <div 
                                style={{ display: 'flex' }}
                            >
                                <Button
                                    ghost
                                    block
                                    type='primary'
                                    style={{ marginRight: 10 }}
                                    onClick={( ) => showReady$( true )}
                                > 
                                    添加
                                </Button>
                                <NlpClonePtr 
                                    targetId={ beforeReady$ }
                                    stepType='ready_response'
                                    abilityId={ abilityId }
                                    onOK={ fetchNodes }
                                />
                            </div>
                        </Timeline.Item>
                    </Timeline>
                </Card>

                {/* 答复消息列表 */}
                <Card
                    hoverable
                    title='执行答复阶段' 
                    extra={(
                        <a 
                            onClick={( ) => hideExec$( !hideExec )}
                        >
                            { !hideExec ? ' 收起' : '展开' }
                        </a>
                    )} 
                    style={{ width: '100%', margin: '0px 0px 50px' }}
                >
                    <Timeline>
                        {
                            exec$.show.map( r => (
                                <Timeline.Item
                                    key={ r.node_id }
                                >
                                    <NlpPtrResponseV2 
                                        frames={ frames }
                                        name={ r.node_name }
                                        node_id={ r.node_id }
                                        abilityId={ abilityId }
                                        defaultContent={ showContent( r.output )}
                                        onDelete={( ) => onDeletePtr( r.node_id )}
                                        onUp={( ) => onMovePtr( r.node_id, 'up')}
                                        onDown={( ) => onMovePtr( r.node_id, 'down')}
                                    />
                                </Timeline.Item>
                            ))
                        }
                        <Timeline.Item>
                            <div 
                                style={{ display: 'flex' }}
                            >
                                <Button
                                    ghost
                                    block
                                    type='primary'
                                    style={{ marginRight: 10 }}
                                    onClick={( ) => showExec$( true )}
                                > 
                                    添加
                                </Button>
                                <NlpClonePtr 
                                    onOK={ fetchNodes }
                                    targetId={ beforeExec$ }
                                    stepType='exec_response'
                                    abilityId={ abilityId }
                                />
                            </div>
                        </Timeline.Item>
                    </Timeline>
                </Card>

                {/* 结束节点 */}
                {
                    !!end$ && (
                        <NlpPtrEndV2 
                            frames={ frames }
                            abilityId={ abilityId }
                            node_id={ end$.node_id }
                        />
                    )
                }
            </div>

            {/* 创建·准备答复弹框 */}
            <Modal
                title='选择类型'
                visible={ showReady }
                onOk={( ) => onCreateReady( )}
                onCancel={( ) => showReady$( false )}
            >
                <Radio.Group 
                    value={ readyType }
                    onChange={ e => readyType$( e.target.value )}
                >
                    {
                        findDic('nlp.ready_response').map( x => (
                            <Radio.Button 
                                key={ x.value }
                                value={ x.value }
                            >
                                { x.label }
                            </Radio.Button>
                        ))
                    }
                </Radio.Group>
            </Modal>

            {/* 创建·执行答复弹框 */}
            <Modal
                width={ 650 }
                title='选择类型'
                visible={ showExec }
                onOk={( ) => onCreateExec( )}
                onCancel={( ) => showExec$( false )}
            >
                <Radio.Group 
                    value={ execType }
                    onChange={ e => execType$( e.target.value )}
                >
                    {
                        findDic('nlp.exec_response').map( x => (
                            <Radio.Button 
                                key={ x.value }
                                value={ x.value }
                            >
                                { x.label }
                            </Radio.Button>
                        ))
                    }
                </Radio.Group>
            </Modal>

        </div>
    )
}

type NlpProcessV2 = {
    meta: Ptr
    abilityId?: any
    frames?: any
}

type Ptr = {
    node_type: PtrType,
    node_name: string,
    created: number,
    updated: number,
    node_id: string,
    parent_id: string
    step_type?: any
    previous_sibling?: string
    [ key: string ]: any
    children?: Ptr[ ]
}

enum PtrType {
    end = 'end',
    start = 'start',
    frame = 'frame',
    slot = 'slot',
    resource = 'resource'
}

enum StepType {
    end = 'end',
    start = 'start',
    ready_response = 'ready_response',
    exec_response = 'exec_response'
}