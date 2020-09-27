import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { createColumns } from '@cvte/ai-web-util/util';
import { PageHeader, Table, Button, Modal, Form, Input, Tooltip } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { useList } from '@cvte/ai-web-util/hooks';
import { transferTime2CN } from '../../../../util/time';

type PAlgorithmList = {
    form: WrappedFormUtils
}

type TAlgorithm = {
    id: string,
    create_time: string,
    description: string,
    delete_time: null,
    algorithm_name: string,
    state: null
}

const formName = 'algorithm-list';
export const List = Form.create({ name: formName })(({ form }: PAlgorithmList ) => {

    const prefix = '/base';

    /** 弹窗 */
    const [ modal, modal$ ] = useState( false );

    /** 选中的算法的ID */
    const [ selecting, selecting$ ] = useState('');
    
    /** 列表 */
    const [ list, list$ ] = useList< TAlgorithm[ ]>({
        listUrl: '/t-apis/algorithm/all',
    });

    /** 提交创建、修改算法 */
    const onSubmit = ( ) => {
        form.validateFields(( err, value ) => {
            if ( !!err ) { return; }
            if ( !selecting ) {
                onCreat( value )
            } else {
                onUpdate( value )
            }
        })
    }

    /** 创建算法 */
    const onCreatBtn = ( data: any ) => {
        selecting$('');
        modal$( true );

        form.resetFields( );
    }

    /** 创建算法 */
    const onCreat = ( data: any ) => {
        http.post({
            data,
            successMsg: '创建成功',
            url: '/t-apis/algorithm/create'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }
            // 刷新列表
            onLoad( );
            modal$( false );
            form.resetFields( );
        })
    }

    /** 更新算法 */
    const onUpdate = ( data: any ) => {
        http.post({
            data: {
                ...data,
                id: selecting
            },
            successMsg: '更新成功',
            url: '/t-apis/algorithm/modify'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }

            // 刷新列表
            onLoad( );
            modal$( false );
    
            form.resetFields( );
        })
    }

    /** 编辑算法 */
    const onSelect = ( item: TAlgorithm ) => {

        const { algorithm_name, description } = item;

        modal$( true );
        selecting$( item.id );

        form.setFieldsValue({
            description,
            algorithm_name
        })
    }

    /** 删除算法 */
    const onDelete = ( item: TAlgorithm ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        id: item.id
                    },
                    successMsg: '删除成功',
                    url: '/t-apis/algorithm/delete'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
        
                    // 刷新列表
                    onLoad( );
                })
            }
        })
    }

    /** 加载算法 */
    const onLoad = ( ) => {
        list$.load('');
    }

    /** 列表 */
    const listTable = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            algorithm_name: {
                title: '名称',
                fixed: 'left',
                render: ( item: TAlgorithm ) => (
                    <Link to={`${prefix}/algorithm/model/${item.id}?name=${encodeURIComponent( item.algorithm_name )}`}>{ item.algorithm_name }</Link>
                )
            },
            description: {
                title: '描述',
                render: ( item: any ) => {
                        return <Tooltip title={ item.description }>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                { item.description }
                            </span>
                        </Tooltip>
                }
            },
            create_time: {
                title: '创建时间',
                render: ( item: TAlgorithm ) => (
                    <span>{ transferTime2CN( item.create_time )}</span>
                )
            }
        }, {
            edit: onSelect,
            delete: onDelete,
            customs: [{
                render: ( item: TAlgorithm ) => <Link to={`${prefix}/algorithm/model/${item.id}?name=${encodeURIComponent( item.algorithm_name )}`}>模型</Link>
            }]
        }), [ list ]
    )

    /** 表单 */
    const formItems$ = useMemo(( ) => {
        return [{
            key: 'algorithm_name',
            label: '名称',
            type: 'input',
            placeholder: '请填写算法名称',
            rules: [
                { required: true, message: '请填写算法名称' }
            ]
        }, {
            key: 'description',
            label: '描述',
            type: 'input',
            placeholder: '算法描述',
            rules: [ ]
        }]
    }, [ ]);
    
    /** didMount */
    useEffect(( ) => {
        onLoad( );
    }, [ ]);

    return (
        <div className="animated fadeIn">

            {/* 标题 */}
            <PageHeader title="算法管理" />

            {/* 按钮 */}
            <div 
                style={{ paddingLeft: 20, marginBottom: 20 }}
            >
                <Button 
                    type="primary"
                    onClick={ onCreatBtn }
                >
                    创建算法
                </Button>
            </div>

            {/* 表格 */}
            <Table 
                { ...listTable }
                scroll={{ x: 1300, y: 550 }}
                pagination={{ pageSize: 5 }}
                loading={ list$.isLoading }
            />

            {/* 弹框 */}
            <Modal
                title={ selecting ? '编辑' : '创建' }
                visible={ modal }
                onCancel={ e => modal$( false )}
                onOk={ e => onSubmit( )}
            >
                <Form
                    labelCol={{
                        sm: { span: 4 },
                        xs: { span: 4 },
                    }}
                    wrapperCol={{
                        sm: { span: 20 },
                        xs: { span: 20 },
                    }}
                >
                {
                    formItems$.map(( formItem: any, k: number ) => (
                        <Form.Item
                                key={ k }
                            label={ formItem.label }
                        >
                            {
                                form.getFieldDecorator<any>( formItem.key, {
                                    rules: formItem.rules,
                                    valuePropName: formItem.type === 'switch' ? 'checked' : 'value'
                                })(
                                    formItem.type === 'input' ?
                                        <Input 
                                            disabled={ !!formItem.disabled } 
                                            placeholder={ formItem.placeholder || ''} 
                                        /> :
                                        <div></div>
                                )
                            }
                        </Form.Item>
                    ))
                }
                </Form>
            </Modal>

        </div>
    );
}) as any