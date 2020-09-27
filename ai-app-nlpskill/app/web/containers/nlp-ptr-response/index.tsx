import { MyForm } from '@cvte/ai-web-util/components';
import { Card, Drawer, Button, notification } from 'antd';
import React, { useState, useEffect, useRef, useImperativeHandle, useMemo } from 'react';
import { PtrConfTitle } from '../ptr-conf-title';
import { PtrCustomAnswer } from '../nlp-ptr-custom-answer';
import { NlpPtrConditionRel } from '../nlp-ptr-condition-rel'

const IndentForm = MyForm('indent-form')

/**
 * 回复节点
 */
export const NlpPtrRes = React.forwardRef(({ abilityId = '', defaultValue = { }, frames = [ ]}: NlpPtrRes, ref ) => {

    const conRef = useRef< any >( null );
    const customRef = useRef< any >( null );
    const indentRef = useRef< any >( null );

    const [ showDrawer, showDrawer$ ] = useState( false );

    /** 节点内容 */
    const ptrDataRef = useRef< any >({ });
    const [ ptrData, ptrData$ ] = useState< any >({ });

    /** 获取数据 */
    const onGetData =  ( ) => new Promise( r => {
        const cons = conRef.current;
        const custom = customRef.current;
        cons.getData( )
            .then( consData => {
                custom.getData( )
                    .then( customData => {
                        const e1 = consData.err;
                        const e2 = customData.err;
                        const d1 = consData.data;
                        const d2 = customData.data;
                        
                        if ( e1 || e2 ) {
                            notification.info({
                                message: '提示',
                                description: '请完善表单'
                            })
                            return r( null );
                        }

                        indentRef.current.validateFields(( err1, f1 ) => {
                            const { next_step } = f1;

                            r({
                                next_step,
                                output: d2,
                                conditions: d1
                            });
                        });

                    })
            });
    })

    /** 确定 */
    const onSure = async ( ) => {
        const data = await onGetData( );
        if ( !data ) return; 

        ptrData$( data );
        showDrawer$( false );
        ptrDataRef.current = data;
    }

    /** 话题跳转 */
    const indentForm$ = useMemo(( ) => {
        return [{
            key: 'next_step',
            type: 'select',
            placeholder: '请选择话题',
            options: frames.map( f => ({
                label: f.name,
                value: f.id
            })),
            rules: [ ]
        }]
    }, [ frames ]);

    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {
            return {
                type: 'response_condition',
                ...ptrDataRef.current
            }
        },
        open: ( ) => {
            showDrawer$( true );
        }
    }))

    useEffect(( ) => {
        if ( !Object.keys( defaultValue ).length || !showDrawer ) return;
        console.log(`NlpPtrResponse: `, defaultValue )
        ptrDataRef.current = {
            type: defaultValue.type || '',
            output: defaultValue.output || { },
            next_step: defaultValue.next_step || '',
            conditions: defaultValue.conditions || { },
        };
        /** 表单设置 */
        const { next_step } = defaultValue;
        if ( !!next_step ) {
            setTimeout(( ) => {
                indentRef.current.setFieldsValue({
                    next_step
                });
            }, 100 );
        }
    }, [ showDrawer, defaultValue ])

    return (
        <div className='con-nlp-ptr-fetch'>
            <Card
                title={'回复'}
                style={{ width: 200 }}
                onClick={( ) => showDrawer$( true )}
            >
                卡片内容
            </Card>

            {/* 右侧弹框 */}
            <Drawer
                width={ 480 }
                title='配置 - 回复'
                visible={ showDrawer }
                onClose={( ) => showDrawer$( false )}
            >
                <PtrConfTitle 
                    title='规则配置'
                    tips={[
                        `规则配置：`,
                        '如果比较的范围是意图，则需要在内容里面填入判断意图的一个置信度（分数），例如80。 系统在判断用户的意图时，总会返回一个置信度（分数）。当大于或者小于该分数时触发本规则。',
                        `直接执行：`,
                        `无需任何条件或者规则，只要到达该节点即自动执行。`
                    ]}
                />
                <NlpPtrConditionRel 
                    ref={ conRef }
                    types={[ 'true', 'conf' ]}
                    abilityId={ abilityId }
                    defaultValue={(( defaultValue || { }).conditions || { })}
                />
                <PtrConfTitle 
                    title='回复'
                    tips={[
                        `意图回复:`,
                        `使用用户选择的[意图]的[默认回复]进行回复。`
                    ]}
                />
                <PtrCustomAnswer 
                    label=''
                    ref={ customRef }
                    abilityId={ abilityId }
                    types={[ 'text', 'rich_text', 'image', 'my_option', 'human_agent', 'intent' ]}
                    type={(( defaultValue || { }).output || { }).show_type || '' }
                    defaultValue={(( defaultValue || { }).output || { }).content || { }}
                />
                <PtrConfTitle 
                    title='话题跳转'
                    tips={[
                        `回复后， 用户下一次请求，将会直接跳转到你选择的子话题。`
                    ]}
                />
                <IndentForm 
                    ref={ indentRef }
                    formItems={ indentForm$ }
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

type NlpPtrRes = { 
    abilityId?: any
    defaultValue?: any
    frames?: {
        id?: any,
        name?: any
    }[ ]
}