import { Button, Drawer } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { MyForm } from '@cvte/ai-web-util/components';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PtrConfTitle, NlpCtxSetter, NlpJumpFrame } from '../index';

const IndentForm = MyForm('indent-form')

/**
 * 
 * @description
 * 
 * 流程图 · 结束节点 · 第二个版本
 */
export const NlpPtrEndV2 = ({ abilityId = '', node_id = '', frames = [ ]}: NlpPtrStartV2 ) => {

    const jumpRef = useRef< any >( null );

    /** 展示弹框 */
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
        if ( !meta ) return;

        jumpRef.current.getData( )
            .then( jumpData => {
                const jump_frame = jumpData.data;

                let reqData: any = {
                    ...meta,
                    jump_frame,
                    next_step: jump_frame,
                    context: ctx.map( x => ({
                        filed_name: x.key,
                        value: x.value,
                        type: 'context'
                    }))
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
                });
            });
    }

    // didMount赋值
    useEffect(( ) => {
        if ( !meta ) return;
        const { context } = meta;
        ctx$(
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
                结束
            </Button>

            {/* 结束节点 */}
            <Drawer
                width={ 500 }
                title='结束'
                visible={ show }
                onClose={( ) => show$( false )}
            >
                
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
    frames: any[ ]
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