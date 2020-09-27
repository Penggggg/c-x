import { Card, Drawer, Button, Tooltip, notification } from 'antd';
import { MyForm, MulvalueActiveForm } from '@cvte/ai-web-util/components';
import React, { useState, useMemo, useRef, useImperativeHandle, createRef, useEffect } from 'react';
import { PtrConfTitle } from '../ptr-conf-title';
import { NlpPtrFetchParams } from '../nlp-ptr-fetch-params';

const FetchBase = MyForm('nlp-ptr-slot-base');

/**
 * 资源调用节点
 */
export const NlpPtrFetch = React.forwardRef(({ abilityId, defaultValue = { }}: NlpPtrSlot, ref ) => {

    const baseRef = useRef< any >( null );

    /** 节点内容 */
    const ptrDataRef = useRef< any >({ });
    const [ ptrData, ptrData$ ] = useState< any >({ });

    /** 默认值 */
    const [ df, df$ ] = useState< any >([ ]);

    /** 出参 */
    const [ outParams, outParams$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 入参数 */
    const [ inParams, inParams$ ] = useState< React.RefObject<any>[ ]>([ createRef( )]);

    /** 弹窗 */
    const [ showDrawer, showDrawer$ ] = useState( false );

    /** 提示 */
    const tips = description => {
        notification.info({
            description,
            message: '提示'
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

    const onGetData =  ( ) => new Promise( r => {
        baseRef.current.validateFields(( err1, f1 ) => {
            Promise.all(
                inParams.map( r => r.current.getData( ))
            ).then( forms => {
                if ( !!err1 || forms.some( x => !x )) {
                    tips('请完善表单')
                    return r( null );
                }
                r({
                    ...f1,
                    in_params: forms,
                    out_params: outParams.map( x => ({
                        name: x.key,
                        value: x.value
                    }))
                })
            })
        })
    })

    /** 确定 */
    const onSure = async ( ) => {
        const data = await onGetData( );
        if ( !data ) return; 

        ptrData$( data );
        showDrawer$( false );
        ptrDataRef.current = data;
    }

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
            }, , {
                key: 'protocol',
                label: '协议',
                type: 'select',
                placeholder: '请选择协议',
                options: [{
                    label: 'http',
                    value: 'http'
                }],
                rules: [{ required: true, message: '请选择请协议' }]
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

    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {
            return {
                type: 'resource',
                info: ptrDataRef.current
            }
        },
        open: ( ) => {
            showDrawer$( true );
        }
    }))

    useEffect(( ) => {

        if ( !showDrawer || !Object.keys( defaultValue ).length ) return 

        setTimeout(( ) => { 
            console.log(`Nlp-ptr-fetch，默认值 `, defaultValue );
            const { url, request_method, protocol, error_return, out_params, in_params } = ( defaultValue.info || { });

            /** 表单设置 */
            baseRef.current.setFieldsValue({
                url, 
                protocol, 
                error_return,
                request_method, 
            });

            /** 返回配置 */
            outParams$(( out_params || [ ]).map( x => ({
                key: x.name,
                value: x.value
            })));

            /** 传入参数 */
            inParams$(
                ( in_params || [ ]).map( x => createRef( ))
            );
            
        }, 100 );
    }, [ showDrawer ]);

    useEffect(( ) => {
        if ( !Object.keys( defaultValue ).length ) return;
        const { in_params } = ( defaultValue.info || { });
        df$( in_params || [ ]);
        ptrDataRef.current = ( defaultValue.info || { });
    }, [ defaultValue ])

    return (
        <div className='con-nlp-ptr-fetch'>
            <Card
                title={'资源调用'}
                style={{ width: 200 }}
                onClick={( ) => showDrawer$( true )}
            >
                卡片内容
            </Card>

            {/* 右侧弹框 */}
            <Drawer
                width={ 480 }
                title='配置 - 资源调用'
                visible={ showDrawer }
                onClose={( ) => showDrawer$( false )}
            >
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
                    title='出参配置' 
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
                 <Button
                    block
                    type='primary'
                    onClick={ onSure }
                    style={{ marginTop: 50 }}
                >
                    确定
                </Button>
            </Drawer>
        </div>
    )
})

type NlpPtrSlot = { 
    abilityId?: any,
    defaultValue?: any
}