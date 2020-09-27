import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { Card, Drawer, Button, notification } from 'antd';
import { MyForm, MulInput } from '@cvte/ai-web-util/components';
import React, { useState, useImperativeHandle, useMemo, useEffect, useRef } from 'react';
import { NlpPtrMulCustomAnswer, PtrConfTitle } from '../index';
import { findDic } from '../../util/dic';
import './index.less';

const SlotBase = MyForm('nlp-ptr-slot-base');
const SlotDetail = MyForm('nlp-ptr-slot-detail');
const SlotClarify = MyForm('nlp-ptr-slot-clarify');

/**
 * 词曹收集节点
 */
export const NlpPtrSlot = React.forwardRef(({ abilityId = '', defaultValue = { }}: NlpPtrSlot, ref ) => {

    const baseRef = useRef< any >( null );
    const detailRef = useRef< any >( null );
    const clarifyRef = useRef< any >( null );

    /** 系统实体列表 */
    const [ sysEntity, sysEntity$ ] = useFetch({
        url: `/t-apis/v1/nlp/sysEntity/${abilityId}`
    });

    /** 实体列表 */
    const [ entities, entities$ ] = useFetch({
        url: `/t-apis/v1/nlp/entity/${abilityId}`
    });

    /** 所有的表单数据 */
    const ptrDataRef = useRef< any >({ });
    const [ ptrData, ptrData$ ]  = useState< any >({ });

    /** 是否已经初始化过节点数据 */
    const [ isInit, isInit$ ] = useState( false );

    /** 正在选中的实体 */
    const [ entitying, entitying$ ] = useState('');

    /** 话术列表 */
    const [ say_type, say_type$ ] = useState< any >('text');
    const [ say_list, say_list$ ] = useState< any[ ]>([ ]);

    /** 弹框 */
    const [ showDrawer, showDrawer$ ] = useState( false );

    /** 实体里面的槽点 */
    const [ slotInEntity, slotInEntity$ ] = useState< any >({ }); 

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

    const fetchSlot = ( entity ) => {
        if ( entity === undefined || entity === null ) return;
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

    /** 获取节点数据 */
    const onGetData =  ( ) => new Promise( r => {
        const baseForm = baseRef.current;
        const detailForm = detailRef.current;
        const clarifyForm = clarifyRef.current;
        baseForm.validateFields(( err1, f1 ) => {
            detailForm.validateFields(( err2, f2 ) => {
                clarifyForm.validateFields(( err3, f3 ) => {

                    if ( !!err1 || !!err2 || !!err3 ) {
                        tips('请完善表单');
                        return r( null )
                    };

                    if ( !say_list.length ) {
                        tips('请完善话术');
                        return r( null )
                    }

                    r({
                        ...f1,
                        ...f2,
                        ...f3,
                        say_list,
                        say_type
                    })

                });
            });
        }); 
    });

    /** 确定 */
    const onSure = async ( ) => {
        const data = await onGetData( );
        if ( !data ) return; 

        ptrData$( data );
        showDrawer$( false );
        ptrDataRef.current = data;
    }

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
            }
        ]
    }, [ sysEntity, entities, entitying, slotInEntity ]);

    const slotDetail$ = useMemo(( ) => {
        return [
            {
                key: 'field_name',
                label: '字段名称',
                type: 'input',
                placeholder: '请填写字段名称',
                rules: [ 
                    { required: true, message: '请填写字段名称' } 
                ]
            }
        ]
    }, [ entities ])

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

    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {

            const { entity_id, slot_id } = ptrDataRef.current;

            // 返回名称
            let intent = ptrDataRef.current.intent || '';
            let slot_name = ptrDataRef.current.slot_name || ''

            let entity = (( sysEntity.instances || [ ])
                .filter( x => !!x.is_open )
                .concat(( entities.instances || [ ]))
                .find( x => x.entity_id === entity_id ) || { }).entity_name || '';

            entity = entity || ptrDataRef.current.entity;

            if ( !!slot_id ) {
                let slot = ( slotInEntity[ entity_id ] || [ ]).find( x => x.slot_id === slot_id[ 1 ]);
                if ( !!slot ) {
                    slot_name = slot.slot_name.split('@')[ 0 ];
                    intent = slot.slot_name.split('#')[ 1 ] || '';
                } else {
                    slot_name = defaultValue.slot || '';
                    intent = defaultValue.intent || '';
                }
            }

            intent = intent || ptrDataRef.current.intent;
            slot_name = slot_name || ptrDataRef.current.slot_name;

            const slot_context = {
                ...ptrDataRef.current,
                entity,
                intent,
                slot_name
            };

            return {
                type: 'slot',
                slot_context
            }
        },
        open: ( ) => {
            showDrawer$( true );
        }
    }))

    useEffect(( ) => {

        if ( !showDrawer || isInit ) return;
        isInit$( true );
        setTimeout(( ) => { 
            console.log(`PtrSlot，默认值: `, defaultValue )
            const { 
                entity_id, slot_id, required, say_list, say_type,
                field_name, say_mod, clarify_times
             } = ( defaultValue.slot_context || { });
            
            /** 设置表单 */
            baseRef.current.setFieldsValue({
                entity_id,
                slot_id, 
                required
            });

            detailRef.current.setFieldsValue({
                field_name, 
            });

            clarifyRef.current.setFieldsValue({
                say_mod, 
                clarify_times
            });

            say_type$( say_type );
            say_list$( say_list );
            entitying$( entity_id );
            fetchSlot( entity_id );
            
        }, 100 );
    }, [ showDrawer ]);

    useEffect(( ) => {
        if ( !Object.keys( defaultValue ).length ) return;
        console.log(`NlpPtrSlot： `, defaultValue )
        ptrDataRef.current = ( defaultValue.slot_context || { });
    }, [ defaultValue ])

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
        <div className='con-nlp-ptr-slot'>
            <Card
                title={'词槽收集'}
                style={{ width: 200 }}
                onClick={( ) => showDrawer$( true )}
            >
                卡片内容
            </Card>

            {/* 右侧弹框 */}
            <Drawer
                width={ 480 }
                title='配置 - 词槽节点'
                visible={ showDrawer }
                onClose={( ) => showDrawer$( false )}
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
                    title='上下文信息' 
                />
                <SlotDetail 
                    align='left'
                    ref={ detailRef }
                    formItems={ slotDetail$ }
                />
                <PtrConfTitle 
                    title='澄清话术' 
                />
                {/* <NlpPtrMulCustomAnswer 
                    type={ say_type }
                    value={ say_list }
                    types={['text', 'image', 'my_option']}
                    onChange={ e => { 
                        say_list$( e.data ); say_type$( e.type )
                    }}
                /> */}
                <MulInput 
                    value={ say_list }
                    onChane={ say_list$ }
                    placeholder='请输入澄清话术'
                />
                <SlotClarify 
                    align='left'
                    ref={ clarifyRef }
                    formItems={ slotClarify$ }
                />
                <Button
                    block
                    type='primary'
                    style={{ marginTop: 50 }}
                    onClick={ onSure }
                >
                    确定
                </Button>
            </Drawer>
        </div>
    )
})

type NlpPtrSlot = { 
    abilityId?: any
    defaultValue?: any
}