import { http } from '@cvte/ai-web-util/util';
import { Card, Drawer, Button, Tooltip, notification, Icon } from 'antd';
import { MyForm, MulvalueActiveForm } from '@cvte/ai-web-util/components';
import React, { useState, useRef, useMemo, createRef, useEffect, ReactNode } from 'react';
import { PtrConfTitle, NlpPtrConditionRel, NlpPtrFetchParams, NlpCtxSetter } from '../index';

import { fixCondition, fixInParams } from '../../util/nlp';
const FetchBase = MyForm('nlp-ptr-slot-base');

export const NlpPtrFetchV2 = ({ name, defaultContent = '', abilityId = '', node_id = '', onUp, onDelete, onDown }: NlpPtrSlotV2 ) => {

    const relRef = useRef< any >( null );
    const baseRef = useRef< any >( null );

    /** 默认值 */
    const [ df, df$ ] = useState< any >([ ]);

    /** 节点原内容 */
    const [ meta, meta$ ] = useState< Ptr | null >( null );

    /** 出参 */
    const [ outParams, outParams$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 入参数 */
    const [ inParams, inParams$ ] = useState< React.RefObject<any>[ ]>([ createRef( )]);

    /** 上下文设置 */
    const [ ctxStart, ctxStart$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 弹框 */
    const [ show, show$ ] = useState( false );

    /** 提示 */
    const tips = description => {
        notification.info({
            description,
            message: '提示'
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

    /** 删除入惨 */
    const onDelParam = Index => {
        const temp1 = [ ...df ];
        const temp2 = [ ...inParams ];
        temp1.splice( Index, 1 )
        temp2.splice( Index, 1 )

        df$( temp1 );
        inParams$( temp2 );
    }

    /** 增加入参 */
    const onAddParam = ( ) => {
        inParams$([ ...inParams, createRef( )]);
    }

    /** 更新节点 */
    const onUpdate =  ( ) => {
        if ( !meta ) return;
        relRef.current.getData( )
            .then( relData => {
                baseRef.current.validateFields(( e1, baseData ) => {
                    Promise.all(
                        inParams.map( r => r.current.getData( ))
                    ).then( forms => {

                        const e2 = relData.err;
                        const err = e1 || e2 || forms.some( x => !x )
                        if ( err ) {
                            tips('请完善表单');
                        }

                        if ( err ) {
                            return;
                        }
            
                        let front_field = JSON.parse( meta.front_field || '{}');

                        let reqData = {
                            ...meta,
                            config_info: {
                                ...baseData,
                                in_params: forms.map( fixInParams ),
                                out_params: outParams.map( x => ({
                                    name: x.key,
                                    value: x.value
                                })),
                            },
                            condition: fixCondition( relData.data ),
                            front_field: JSON.stringify({ // 前端字段
                                ...front_field,
                                outParams,
                                inParams: forms,
                                conditions: relData.data
                            }),
                            context: ctxStart.map( x => ({
                                filed_name: x.key,
                                value: x.value,
                                type: 'context'
                            })),
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
                })
            })
    }

    /** 基本信息 */
    const fetchBase$ = useMemo(( ) => {
        return [
            {
                key: 'url',
                label: '请求地址',
                type: 'input',
                placeholder: '请填写请求地址',
                rules: [ 
                    { required: true, message: '请填写请求地址' } 
                ]
            }, {
                key: 'request_method',
                label: '请求方法',
                type: 'select',
                placeholder: '请选择请求方法',
                options: [{
                    label: 'GET',
                    value: 'GET'
                }, {
                    label: 'POST',
                    value: 'POST'
                }],
                rules: [{ required: true, message: '请选择请求方法' }]
            }, {
                key: 'error_return',
                label: '异常处理',
                type: 'input',
                placeholder: '如：查询出错，请联系工作人员',
                rules: [ 
                    { required: true, message: '请填写异常处理' } 
                ]
            }
        ]
    }, [ ]);

    useEffect(( ) => {
        if ( !meta || !meta.config_info ) return;
        let front_field = JSON.parse( meta.front_field || '{}');
        const { outParams, inParams } = front_field;
        const { url, request_method, error_return, in_params } = meta.config_info

        /** ctx */
        if ( Array.isArray( meta.context )) {
            ctxStart$(
                ( meta.context || [ ])
                .filter(( x: any ) => !x.type || x.type === 'context' )
                .map( x => ({
                    key: x.filed_name,
                    value: x.value
                }))
            )
        };

        /** 返回配置 */
        outParams$(( outParams || [ ]));

        /** 传入参数 */
        inParams$(
            ( in_params || [ ]).map( x => createRef( ))
        );

        /** 传入参数 */
        df$( inParams || [ ]);

        /** 表单 */
        setTimeout(( ) => {
            baseRef.current.setFieldsValue({
                url, request_method, error_return
            });
        }, 100 );
    }, [ meta ]);

    useEffect(( ) => {
        !!show && fetchDetail( );
    }, [ show ])

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
                { meta ? ( meta.config_info || { }).url : defaultContent }
            </Card>

            {/* 配置 */}
            <Drawer
                width={ 500 }
                title='资源调用'
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
                    title='基本信息' 
                />

                <FetchBase 
                    ref={ baseRef }
                    formItems={ fetchBase$ }
                />

                <PtrConfTitle 
                    title='传入参数' 
                />
                {
                    inParams.map(( r, k ) => (
                        <Card
                            key={ k }
                            style={{ margin: 12 }}
                            title={`参数-${ k + 1 }`}
                            extra={(<a onClick={( ) => onDelParam( k )}>删除</a>)}
                        >
                            <NlpPtrFetchParams 
                                abilityId={ abilityId }
                                wrappedComponentRef={ r }
                                defaultValue={( df[ k ]|| { })}
                            />
                        </Card>
                    ))
                }
                <div style={{ textAlign: 'right' }}>
                    <Tooltip
                        title='添加传入参数'
                    >
                        <Button 
                            icon='plus' 
                            size='small'
                            type='primary' 
                            shape='circle' 
                            style={{ margin: 10 }}
                            onClick={ onAddParam }
                        />
                    </Tooltip>
                </div>

                <PtrConfTitle 
                    title='返回配置' 
                    tips={[
                        `资源接口返回数据必须为json格式。把调用资源返回的数据拆解存放到变量中，以方便后续使用。`,
                        `例如接口返回json数据为：  {"status":0, "data":{"name":"xiaoxin", "age":20}} `,
                        `如果想把 返回数据中 data下面的 name参数的值 保存在系统变量 user_name 中, 提供给后面的流程/节点使用， 则 下方填写为:`,
                        `user_name = data.name`
                    ]}
                />

                <MulvalueActiveForm 
                    value={ outParams }
                    onChane={ outParams$ }
                    placeholder={{
                        key: '变量名',
                        value: '返回数据的属性名'
                    }}
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
                    style={{ marginTop: 50 }}
                    onClick={ onUpdate }
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