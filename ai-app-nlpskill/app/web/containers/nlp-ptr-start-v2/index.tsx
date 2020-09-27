import { http } from '@cvte/ai-web-util/util';
import { Button, Drawer, notification } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PtrConfTitle, NlpPtrConditionRel, NlpCtxSetter } from '../index';
import { fixCondition } from '../../util/nlp';

/**
 * 
 * @description
 * 
 * 流程图 · 开始节点 · 第二个版本
 */
export const NlpPtrStartV2 = ({ abilityId = '', node_id = '', name = '开始' }: NlpPtrStartV2 ) => {

    const relRef = useRef< any >( null );

    /** 节点原内容 */
    const [ meta, meta$ ] = useState< Ptr | null >( null );

    /** 展示弹框 */
    const [ show, show$ ] = useState( false );

    /** 上下文设置 */
    const [ ctxStart, ctxStart$ ] = useState<{ key: string, value: string }[ ]>([ ]);

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
        if ( !rel || !meta ) return;

        rel.getData( )
            .then(({ err, data }) => {
                if ( err ) {
                    return notification.info({
                        message: '提示',
                        description: '请完善配置'
                    })
                }

                let front_field = JSON.parse( meta.front_field || '{}')
                let reqData: any = {
                    ...meta,
                    condition: fixCondition( data ),
                    context: ctxStart.map( x => ({
                        filed_name: x.key,
                        value: x.value,
                        type: 'context'
                    })),
                    front_field: JSON.stringify({ // 前端字段
                        ...front_field,
                        conditions: data
                    })
                };
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
    }

    // didMount赋值
    useEffect(( ) => {
        if ( !meta ) return;
        const { context } = meta;

        ctxStart$(
            ( context || [ ])
                .filter(( x: any ) => !x.type || x.type === 'context' )
                .map( x => ({
                    key: x.filed_name,
                    value: x.value
                }))
        )
    }, [ meta ])

    useEffect(( ) => {
        !!show && fetchDetail( );
    }, [ show ])

    return (
        <div className='con-nlp-ptre-start-v2'>

            {/* 显示的按钮 */}
            <Button 
                icon='bulb'
                type='primary'
                onClick={( ) => show$( true )}
            >
                { name }
            </Button>

            {/* 开始节点 */}
            <Drawer
                width={ 500 }
                title='开始'
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
                            types={[ 'conf', 'true', 'null' ]}
                            defaultValue={{ operator: 'conf', ...( JSON.parse( meta.front_field || '{ }').conditions || { })}}
                        />
                    )
                }

                <PtrConfTitle 
                    title='上下文设置'
                />

                <NlpCtxSetter 
                    abilityId={ abilityId }
                    value={ ctxStart }
                    onChane={ ctxStart$ }
                    placeholder={{
                        key: '字段名',
                        value: '字段值，可使用表达式'
                    }}
                />

                <Button
                    block
                    type='primary'
                    onClick={ onModify }
                    style={{ marginTop: 50 }}
                >
                    确认
                </Button>
            </Drawer>

        </div>
    )
}

type NlpPtrStartV2 = { 
    abilityId: any
    node_id: any
    name?: string
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