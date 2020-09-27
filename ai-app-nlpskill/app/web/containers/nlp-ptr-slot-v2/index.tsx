import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';
import { Card, Drawer, notification, Button, Icon, Tooltip } from 'antd';
import React, { useState, useRef, useMemo, useEffect, ReactNode } from 'react';

import { findDic } from '../../util/dic';
import { fixSayList, showSlot } from '../../util/nlp';
import { PtrConfTitle, NlpPtrMulCustomAnswer, NlpCtxSetter } from '../index'

const ButtonGroup = Button.Group;
const SlotBase = MyForm('nlp-ptr-slot-base');
const SlotClarify = MyForm('nlp-ptr-slot-clarify');

export const NlpPtrSlotV2 = ({ name, defaultContent = '', abilityId = '', onDelete, onDown, onUp, node_id = '' }: NlpPtrSlotV2 ) => {

    const baseRef = useRef< any >( null );
    const clarifyRef = useRef< any >( null );

    /** 弹框 */
    const [ show, show$ ] = useState( false );

    /** 节点原内容 */
    const [ meta, meta$ ] = useState< Ptr | null >( null );

    /** 正在选中的实体 */
    const [ entitying, entitying$ ] = useState('');

    /** 实体里面的槽点 */
    const [ slotInEntity, slotInEntity$ ] = useState< any >({ }); 

    /** 话术列表 */
    const [ say_type, say_type$ ] = useState< any >('text');
    const [ say_list, say_list$ ] = useState< any[ ]>([ ]);

    /** 上下文设置 */
    const [ ctxStart, ctxStart$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 系统实体列表 */
    const [ sysEntity, sysEntity$ ] = useFetch({
        url: `/t-apis/v1/nlp/sysEntity/${abilityId}`
    });

    /** 实体列表 */
    const [ entities, entities$ ] = useFetch({
        url: `/t-apis/v1/nlp/entity/${abilityId}`
    });

    /** 提示 */
    const tips = description => {
        notification.info({
            description,
            message: '提示'
        })
    }

    /** 基本信息 表单变更 */
    const onBase = e => {
        const { entity_id } = e;
        fetchSlot( entity_id );
        entitying$( entity_id );
    }

    /** 获取嘈点 */
    const fetchSlot = ( entity ) => {
        if ( entity === undefined || entity === null || entity === '' ) return;
        if ( !!slotInEntity[ entity ]) return;
        http.get< any >({
            url: `/t-apis/v1/nlp/slot/${abilityId}/${entity}`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            slotInEntity$({
                ...slotInEntity$,
                [ entity ]: data
            });
        })
    }

    /** 获取详情 */
    const fetchDetail = ( ) => {
        http.get< Ptr >({
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}`
        }).then(({ data, status }) => {
            if ( status !== 200 ) return;
            meta$( data );
        })
    }

    /** 获取节点数据 */
    const onUpdate =  ( ) => new Promise( r => {

        if ( !meta ) return;

        const baseForm = baseRef.current;
        const clarifyForm = clarifyRef.current;
        baseForm.validateFields(( err1, f1 ) => {
            clarifyForm.validateFields(( err3, f3 ) => {

                if ( !!err1 || !!err3 ) {
                    tips('请完善表单');
                    return r( null )
                };

                if ( !say_list.length ) {
                    tips('请完善话术');
                    return r( null )
                }

                let front_field = JSON.parse( meta.front_field || '{}');
                let slot_context = {
                    ...f1,
                    ...f3,
                    say_list: fixSayList( say_type, say_list ).map( x => JSON.stringify( x ))
                };

                if ( !!f1.slot_id ) {

                    let slot_name = '';
                    const { entity_id } = f1;
                    if ( !!entity_id && slotInEntity[ entity_id ]) {
                        const target = slotInEntity[ entity_id ].find( x => x.slot_id === f1.slot_id[ 1 ])
                        if ( !!target ) {
                            slot_name = target.slot_name;
                        }
                    }

                    slot_context = {
                        ...slot_context,
                        slot_name,
                        slot_id: f1.slot_id[ 1 ],
                        intent_id: f1.slot_id[ 0 ],
                    }
                }

                const { entity_id, context_slot_name } = f1;
                const context = ctxStart.map( x => ({
                    filed_name: x.key,
                    value: x.value,
                    type: 'context'
                })).concat([{
                    filed_name: context_slot_name,
                    value: String( entity_id || '' ),
                    type: 'slot'
                }]);

                if ( Array.from( new Set( context.map( x => x.filed_name ))).length < context.length ) {
                    tips('上下文的字段名不能相同');
                    return r( null )
                }
                
                let reqData: any = {
                    ...meta,
                    slot_context,
                    context,
                    front_field: JSON.stringify({ // 前端字段
                        ...front_field,
                        say_type,
                        say_list
                    }),
                }
                delete reqData.children;

                http.put< any >({
                    data: reqData,
                    successMsg: '修改完成',
                    url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}`
                }).then(({ status }) => {
                    if ( status !== 200 ) return;
                    show$( false );
                    // meta$( reqData );
                    fetchDetail( );
                })
            });
        }); 
    });

    const slotBase$ = useMemo(( ) => {

        const slotOpt: any[ ] = [ ];
        const slots = ( slotInEntity[ entitying ] || [ ]);

        slots.map( x => {
            const isExited = slotOpt.find( y => y.value === x.intention_refer );

            if ( !isExited ) {
                // 第一层是意图、第二层是槽点
                slotOpt.push({
                    value: x.intention_refer,
                    label: x.slot_name.split('#')[ 1 ],
                    children: [{
                        value: x.slot_id,
                        label: x.slot_name.split('@')[ 0 ]
                    }]
                })
            } else {
                isExited.children.push({
                    value: x.slot_id,
                    label: x.slot_name.split('@')[ 0 ]
                })
            }
        })    

        return [{
                key: 'entity_id',
                label: '实体',
                type: 'select',
                placeholder: '请选择实体',
                expandTrigger: 'click',
                options: ( sysEntity.instances || [ ])
                    .filter( x => !!x.is_open )
                    .concat(( entities.instances || [ ]))
                    .map( x => ({
                        label: x.entity_name,
                        value: x.entity_id
                    })),
                rules: [{ required: true, message: '请选择是否必填' }]
            }, {
                key: 'slot_id',
                label: '槽位',
                type: 'cascader',
                placeholder: '请选择槽位',
                expandTrigger: 'click',
                options: slotOpt,
                rules: [ ]
            }, {
                key: 'required',
                label: '是否必填',
                type: 'select',
                placeholder: '请选择是否必填',
                options: findDic('nlp.form.required'),
                rules: [{ required: true, message: '请选择是否必填' }]
            }, {
                key: 'context_slot_name',
                label: '上下文字段',
                type: 'input',
                placeholder: '请填写上下文字段',
                rules: [ 
                    { required: true, message: '请填写上下文字段' } 
                ]
            }
        ]
    }, [ sysEntity, entities, entitying, slotInEntity ]);

    const slotClarify$ = useMemo(( ) => {
        return [
            {
                key: 'say_mod',
                label: '返回方式',
                type: 'select',
                placeholder: '请选择返回方式',
                options: findDic('nlp.form.sayMode'),
                rules: [{ required: true, message: '请选择返回方式' }]
            }, {
                min: 0,
                key: 'clarify_times',
                label: '澄清次数',
                type: 'number',
                placeholder: '请填写澄清次数',
                rules: [
                    { required: true, message: '请填写澄清次数' }
                ]
            }
        ]
    }, [ ]);

    useEffect(( ) => {
        if ( !meta || !meta.slot_context ) return;
        const { context } = meta;
        let front_field = JSON.parse( meta.front_field || '{}');
        const { required, say_mod, clarify_times, context_slot_name } = meta.slot_context;
        const entity_id = String( meta.slot_context.entity_id || '' );
        const intent_id = String( meta.slot_context.intent_id || '' );
        const slot_id = String( meta.slot_context.slot_id || '' );

        fetchSlot( entity_id )
        entitying$( entity_id );

        say_type$( front_field.say_type || '' );
        say_list$( front_field.say_list || [ ]);

        ctxStart$(
            ( context || [ ])
                .filter(( x: any ) => !x.type || x.type === 'context' )
                .map( x => ({
                    key: x.filed_name,
                    value: x.value
                }))
        )

        setTimeout(( ) => {
            let origin: any = {
                entity_id, 
                required,
                context_slot_name
            }
            if ( !!intent_id && !!slot_id ) {
                origin = {
                    ...origin,
                    slot_id: [ intent_id, slot_id ], 
                }
            }
            baseRef.current.setFieldsValue({
                ...origin
            })
            clarifyRef.current.setFieldsValue({
                say_mod, clarify_times
            })
        }, 100 );
    }, [ meta ]);

    useEffect(( ) => {
        !!show && fetchDetail( );
    }, [ show ])

    useEffect(( ) => {
        entities$.load({
            page: 1,
            size: 999
        });
        sysEntity$.load({
            page: 1,
            size: 999
        });
    }, [ ]);

    return (
        <div>
            <Card
                hoverable
                title={ name } 
                extra={(<div>
                    <Tooltip
                        title='删除'
                    >
                        <Icon 
                            type='minus' 
                            style={{ margin: '0 3px', color: '#ff7875' }}
                            onClick={ e => { e.stopPropagation( ); !!onDelete && onDelete( )}}
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
                { meta ? showSlot( meta.slot_context ) : defaultContent }
            </Card>

            {/* 配置 */}
            <Drawer
                width={ 500 }
                title='词槽收集'
                visible={ show }
                onClose={( ) => show$( false )}
            >
                <PtrConfTitle 
                    title='基本信息' 
                />
                <SlotBase 
                    ref={ baseRef }
                    onChange={ onBase }
                    formItems={ slotBase$ }
                />
                <PtrConfTitle 
                    title='澄清话术' 
                />
                <NlpPtrMulCustomAnswer 
                    type={ say_type }
                    value={ say_list }
                    types={['text', 'image', 'my_option']}
                    onChange={ e => { 
                        say_list$( e.data ); say_type$( e.type )
                    }}
                />
                <SlotClarify 
                    align='left'
                    ref={ clarifyRef }
                    formItems={ slotClarify$ }
                />
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
                    onClick={ onUpdate }
                    style={{ marginTop: 50 }}
                >
                    确认
                </Button>
            </Drawer>
        </div>
    )
}

type NlpPtrSlotV2 = { 
    name?: string
    abilityId?: any
    node_id?: any
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