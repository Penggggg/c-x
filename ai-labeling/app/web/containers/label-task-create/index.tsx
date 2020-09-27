import { http } from '@cvte/ai-web-util/util';
import { Modal, Spin, Alert, Icon } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useList, useFetch } from '@cvte/ai-web-util/hooks';
import { StepsForm } from '@cvte/ai-web-util/components';
import { systems, fileType2Mime } from '../../util/const';

/**
 * @description
 * 创建标注任务的model
 */
export const LabelTaskCreate = ({ show, onCancel }: TConLabelTaskCreate ) => {

    /** 创建中 */
    const [ creating, creating$ ] = useState( false );

    /** 源数据列表 */
    const [ srcDataList, srcDataList$ ] = useList<any>({ 
        listUrl: `/t-apis/admin/srcdata/list` 
    });

    /** 标注模板列表 */
    const [ tempList, tempList$ ] = useFetch<any>({ 
        url: `/t-apis/admin/templates` 
    });

    /** 到数据集管理系统 */
    const goDataset = ( ) => { 
        window.open( systems.Datasets )
    }

    /** 创建 */
    const onCreate = ( values ) => {
        const { name, description, fileType, label_template, src_data } = values;

        const data = {
            name,
            label_template,
            src_data_path: src_data[ 1 ],
            description: description || '',
            src_data_group_id: src_data[ 0 ],
            file_type_list: fileType2Mime[ fileType ],
            src_data_bucket: `dataset-${srcDataList.find( x => x.group_id === src_data[ 0 ]).matter_id}`
        };

        creating$( true );
        http.post({
            data,
            successMsg: '创建成功',
            url: `/t-apis/admin/labeltask/new`
        }).then( res => {
            const { status } = res;

            creating$( false );
            status === 200 && onCancel( );
        })
    }

    /** 创建表单 */
    const formItems$ = useMemo(( ) => {
        return [{
            title: '基础信息',
            formItems: [{
                key: 'name',
                label: '任务名称',
                type: 'input',
                placeholder: '请填写任务名称',          
                rules: [ 
                    { required: true, message: '请填写任务名称' } 
                ]
            }, {
                key: 'description',
                label: '描述',
                type: 'textarea',
                placeholder: '请填写描述',               
                rules: [ ]
            }]
        }, {
            title: '标注相关',
            formItems: [{
                key: 'fileType',
                label: '文件类型',
                type: 'select',
                placeholder: '请选择标注类型',
                rules: [ 
                    { required: true, message: '请选择标注类型' } 
                ],     
               options: Object.keys( fileType2Mime ).map( x => ({
                   label: x,
                   value: x
               }))
            }, {
                key: 'label_template',
                label: '标注模板',
                type: 'select',
                placeholder: '请选择标注类型',
                rules: [ 
                    { required: true, message: '请选择标注类型' } 
                ],     
               options: Object.keys( tempList ).map( x => ({
                   label: x,
                   value: x
               }))
            }, {
                key: 'src_data',
                label: '数据目录',
                type: 'selectInput',
                disabled: [ false, true ],
                placeholder: '请选择数据目录',
                defaultValue: [ undefined, 'data' ],
                options: srcDataList.map( x => ({
                    label: x.group_name,
                    value: x.group_id
                })),
                extra: <div 
                    onClick={ goDataset }
                    style={{ cursor: 'pointer' }}
                >
                    <Icon 
                        theme="twoTone"
                        type="info-circle"
                        style={{ marginRight: 8 }}
                    />
                    查看我的数据集
                </div>,     
                rules: [ ]
            }]
        }]
    }, [ tempList, srcDataList ]);

    /** 加载数据 */
    useEffect(( ) => {
        if ( show ) {
            tempList$.load('')
            srcDataList$.load('');
        }
    }, [ show ]);

    return (
        <Modal
            title="创建标注任务"
            width={ 700 }
            footer={ null }
            visible={ show }
            onCancel={ onCancel }
        >
            <Spin
                size="large"
                spinning={ srcDataList$.isLoading }
            >
                <div>

                    {/* 暂无源数据 */}
                    {
                        srcDataList.length === 0 && (
                            <div>
                                <Alert
                                    showIcon
                                    type="info"
                                    message="提示"
                                    description={
                                        <div 
                                            onClick={ goDataset }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div>标注任务，需要源数据，点击马上创建</div>
                                        </div>
                                    }
                                />
                            </div>
                        )
                    }

                    {/* 标注表单 */}
                    {
                        srcDataList.length > 0 && (
                            <div style={{ padding: '0 120px' }}>
                                <StepsForm 
                                    onOk={ onCreate } 
                                    forms={ formItems$ }
                                    isLoading={ creating }
                                    formName="label-task-create"
                                />
                            </div>
                        )
                    }
                    

                </div>
            </Spin>
        </Modal>
    )
}

type TConLabelTaskCreate = {
    show: boolean
    onCancel: ( ) => void
};