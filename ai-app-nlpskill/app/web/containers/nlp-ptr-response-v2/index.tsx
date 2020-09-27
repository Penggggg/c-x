import { http } from '@cvte/ai-web-util/util';
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Card, Drawer, Button, Icon, Tooltip, notification, Modal } from 'antd';

import { findDicCN } from '../../util/dic';
import { fixCondition, showContent } from '../../util/nlp';
import { PtrConfTitle, NlpPtrConditionRel, NlpCtxSetter, PtrCustomAnswer, NlpJumpFrame } from '../index';

export const NlpPtrResponseV2 = ({ name, defaultContent = '', node_id = '', abilityId = '', onDown, onDelete, onUp }: NlpPtrResponseV2 ) => {

    const jumpRef = useRef< any >( null );
    const relRef = useRef< any >( null );
    const customRef = useRef< any >( null );

    /** 弹框 */
    const [ show, show$ ] = useState( false );

    /** 节点原内容 */
    const [ meta, meta$ ] = useState< Ptr | null >( null );

    /** 上下文设置 */
    const [ ctx, ctx$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 获取详情 */
    const fetchDetail = ( ) => {
        http.get< Ptr >({
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}`
        }).then(({ data, status }) => {
            if ( status !== 200 ) return;
            meta$( data );
        })
    }
    
    /** 修改节点 */
    const onModify = ( ) => {
        const rel = relRef.current;
        const custom = customRef.current;
        if ( !rel || !meta ) return;

        rel.getData( )
            .then( relData => {
                custom.getData( )
                    .then( customData => {
                        jumpRef.current.getData( )
                            .then( jumpData => {
                                const jump_frame = jumpData.data;
                                const e1 = relData.err;

                                if ( e1 ) {
                                    notification.info({
                                        message: '提示',
                                        description: '请完善表单'
                                    })
                                    return;
                                }

                                const { show_type } = customData.data;

                                let front_field = JSON.parse( meta.front_field || '{}');
                                let reqData: any = {
                                    ...meta,
                                    jump_frame,
                                    condition: fixCondition( relData.data ),
                                    next_step: jump_frame,
                                    front_field: JSON.stringify({ // 前端字段
                                        ...front_field,
                                        conditions: relData.data
                                    }),
                                    output: customData.data,
                                    context: ctx.map( x => ({
                                        filed_name: x.key,
                                        value: x.value,
                                        type: 'context'
                                    })),
                                    node_name: findDicCN('nlp.exec_response', show_type ),

                                }

                                delete reqData.children;

                                http.put< any >({
                                    data: reqData,
                                    successMsg: '修改完成',
                                    url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}`
                                }).then(({ status }) => {
                                    if ( status !== 200 ) return;
                                    show$( false );
                                    meta$( reqData );
                                })
                            })
                    })
            })
    }

    /** 恢复数据 */
    useEffect(( ) => {
        if ( !meta ) return;
        if ( !Array.isArray( meta.context )) return;

        ctx$(
            ( meta.context || [ ])
                .filter(( x: any ) => !x.type || x.type === 'context' )
                .map( x => ({
                    key: x.filed_name,
                    value: x.value
                }))
        )
    }, [ meta ]);

    useEffect(( ) => {
        !!show && fetchDetail( );
    }, [ show ])

    return (
        <div>
            <Card
                hoverable
                title={ !!meta ? meta.node_name : name } 
                extra={(<div>
                    <Tooltip
                        title='删除'
                    >
                        <Icon 
                            type='minus' 
                            style={{ margin: '0 3px', color: '#ff7875' }}
                            onClick={ e => { 
                                Modal.confirm({
                                    title: '提示',
                                    content: '确认删除吗？',
                                    onOk: ( ) => {
                                        e.stopPropagation( ); 
                                        !!onDelete && onDelete( )
                                    }
                                })
                            }}
                        />
                    </Tooltip>
                    <Tooltip
                        title='上移'
                    >
                        <Icon 
                            type='arrow-up' 
                            style={{ margin: '0 3px', color: '#40a9ff' }}
                            onClick={ e => { e.stopPropagation( ); !!onUp && onUp( )}}
                        />
                    </Tooltip>
                    <Tooltip
                        title='下移'
                    >
                        <Icon 
                            type='arrow-down' 
                            style={{ margin: '0 3px', color: '#40a9ff' }}
                            onClick={ e => { e.stopPropagation( ); !!onDown && onDown( )}}
                        />
                    </Tooltip>
                    
                </div>)} 
                style={{ width: '100%' }}
                onClick={( ) => show$( true )}
            >
                { meta ? showContent( meta.output ) : defaultContent }
            </Card>

            {/* 配置 */}
            <Drawer
                width={ 500 }
                title={ !!meta ? meta.node_name : name }
                visible={ show }
                onClose={( ) => show$( false )}
            >

                <PtrConfTitle 
                    title='话题触发'
                    tips={[
                        `规则配置：`,
                        '如果比较的范围是意图，则需要在内容里面填入判断意图的一个置信度（分数），例如80。 系统在判断用户的意图时，总会返回一个置信度（分数）。当大于或者小于该分数时触发本规则。',
                        `直接执行：`,
                        `无需任何条件或者规则，只要到达该节点即自动执行。`,
                        `执行子话题：`,
                        `跳过本节点，执行后面的节点/子话题。`
                    ]}
                />

                {
                    !!meta && (
                        <NlpPtrConditionRel 
                            ref={ relRef }
                            abilityId={ abilityId }
                            types={[ 'conf', 'true' ]}
                            defaultValue={{ operator: 'true', ...( JSON.parse( meta.front_field || '{ }').conditions || { })}}
                        />
                    )
                }

                <PtrConfTitle 
                    title='回复内容'
                    tips={[
                        `意图回复:`,
                        `使用用户选择的[意图]的[默认回复]进行回复。`
                    ]}
                />

                {
                    !!meta && (
                        <PtrCustomAnswer 
                            label=''
                            ref={ customRef }
                            abilityId={ abilityId }
                            type={ meta.output.show_type }
                            defaultValue={( meta.output || { }).content || { }}
                            types={[ 'text' , 'rich_text' , 'image' , 'my_option' , 'human_agent' , 'intent' ]}
                        />
                    )
                }

                <PtrConfTitle 
                    title='上下文设置' 
                />

                <NlpCtxSetter 
                    abilityId={ abilityId }
                    value={ ctx }
                    onChane={ ctx$ }
                    placeholder={{
                        key: '字段名',
                        value: '字段值，可使用表达式'
                    }}
                />

                <PtrConfTitle 
                    title='话题跳转'
                    tips={[
                        `回复后， 用户下一次请求，将会直接跳转到你选择的子话题。`
                    ]}
                />

{
                    !!meta && (
                        <NlpJumpFrame 
                            ref={ jumpRef }
                            abilityId={ abilityId }
                            defaultStep={( meta.next_step || { }).step_type }
                            defaultFrame={( meta.next_step || { }).jump_frame_id }
                        />
                    )
                }

                <Button
                    block
                    type='primary'
                    style={{ marginTop: 50 }}
                    onClick={ onModify }
                >
                    确认
                </Button>
            </Drawer>
        </div>
    )
}

type NlpPtrResponseV2 = {
    name?: any 
    abilityId?: any 
    node_id?: any
    frames: any[ ]
    defaultContent?: string | ReactNode
    onUp?: ( ) => void
    onDown?: ( ) => void
    onDelete?: ( ) => void
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
    frame = 'frame'
}