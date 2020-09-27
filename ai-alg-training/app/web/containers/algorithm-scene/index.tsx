import { Tag, Icon, Modal, Button } from 'antd';
import { useList } from '@cvte/ai-web-util/hooks';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MyForm } from '@cvte/ai-web-util/components';
import { http } from '@cvte/ai-web-util/util';

type TCAlgorithmScene = {
    aid: string
}

type TAlgorithmScene = {
    id: string,
    create_time: string,
    description: string,
    delete_time: null,
    algorithm_id: string,
    scenarios: string,
    models: any[ ]
}

const SceneForm = MyForm('algorithm-scene');
export const AlgorithmScene = ({ aid }: TCAlgorithmScene ) => {

    const formRef = useRef( null );

    /** 选择 */
    const [ selecing, selecing$ ] = useState('');

    /** modal */
    const [ modal, modal$ ] = useState( false );

    /** 列表 */
    const [ list, list$ ] = useList< TAlgorithmScene >({ listUrl: `/t-apis/scenarios/all` })

    /** 选中 */
    const onChoice = ( item: TAlgorithmScene ) => {
        const { id, scenarios, description } = item;

        modal$( true );
        selecing$( id );
        
        setTimeout(( ) => {
            const form: any = formRef.current;
            form.setFieldsValue({
                scenarios,
                description
            })
        }, 0 )
    }

    /** 提交 */
    const onSure = ( ) => {
        const form: any = formRef.current;
        form.validateFields(( err, value ) => {
            if ( !!err ) { return; }

            let reqData = {
                ...value,
                algorithm_id: aid
            };

            if ( !!selecing ) {
                reqData = {
                    ...reqData,
                    scenarios_id: selecing
                }
            }

            onCreateOrEdit( reqData );
        })
    }

    /** 创建、编辑 */
    const onCreateOrEdit = data => {
        http.post({
            data: {
                config_list: [ data ]
            },
            successMsg: selecing ? '更新成功' : '添加成功',
            url: `/t-apis/scenarios/set_config`
        }).then( res => {
            const { status } = res;
            const form: any = formRef.current;

            if ( status !== 200 ) { return; }
            
            // 刷新
            selecing$( '');
            form.resetFields( );
            
            modal$( false );
            list$.load(`?algorithm_id=${aid}`);
        })
    }

    /** 删除 */
    const onDelete = ( ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除该场景吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        scenarios_id: selecing
                    },
                    successMsg: '删除成功',
                    url: `/t-apis/scenarios/delete`
                }).then( res => {

                    const { status } = res;
                    const form: any = formRef.current;

                    if ( status !== 200 ) { return; }

                    selecing$( '');
                    form.resetFields( );
                    
                    modal$( false );
                    list$.load(`?algorithm_id=${aid}`);
                })
            }
        })
    }

    /** 打开 */
    const onModel = ( sid?: string ) => {
        modal$( true );
        selecing$( sid || '' );
        setTimeout(( ) => {
            const form: any = formRef.current;
            !sid && form.resetFields( );
        }, 0 )
    }

    /** 表单 */
    const formItems$ = useMemo(( ) => {
        return [
            {
                key: 'scenarios',
                label: '场景名称',
                type: 'input',
                placeholder: '请填写场景名称',
                rules: [
                    { required: true, message: '请填写场景名称' }
                ]
            }, {
                key: 'description',
                label: '描述',
                type: 'textarea',
                placeholder: '场景描述',
                rules: [ 
                    { required: true, message: '请填写场景名称' }
                ]
            }
        ]
    }, [ ]);
    
    /** didMount */
    useEffect(( ) => {
        !!aid && list$.load(`?algorithm_id=${aid}`);
    }, [ aid ])

    return (
        <div>
            
            {
                list.map(( s, k ) => (
                    <a 
                        key={ k }
                        onClick={( ) => onChoice( s )}
                    >
                        <Tag 
                            color="cyan"
                        >
                            { s.scenarios }
                        </Tag>
                    </a>
                    
                ))  
            }

            <a onClick={( ) => onModel( )}>
                <Tag 
                    color="blue"
                    style={{ borderStyle: 'dashed' }}
                >
                    <Icon type="plus" /> 应用场景
                </Tag>
            </a>

            <Modal
                title={`${ selecing ? '更新' : '添加' }场景`}
                visible={ modal }
                onCancel={( ) => modal$( false )}
                footer={<div>
                    {
                        selecing && (
                            <Button 
                                ghost
                                type="danger"
                                onClick={ onDelete }
                            >
                                删除
                            </Button>
                        )
                    }
                    <Button
                        type="primary"
                        onClick={ onSure }
                    >
                        确定
                    </Button>
                </div>}
            >
                <SceneForm 
                    ref={ formRef }
                    formItems={ formItems$ }
                />
            </Modal>
        </div>
    )
};