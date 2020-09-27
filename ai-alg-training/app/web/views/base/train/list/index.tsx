import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PageHeader, Table, Modal, Card } from 'antd';
import { createColumns } from '@cvte/ai-web-util/util';
import { http } from '@cvte/ai-web-util/util';
import { findDic, findDicCN } from '../../../../util/dic';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';

type TTrain = {
    train_id: string,
    combination_name: string,
    dataset_id: string,
    model_version_id: string,
    state: string,
    result_model_version_id: string,
    base_version_name: string,
    start_time: string,
    end_time: string
}

type TAlgorithmModel =  {
    id: string,
    model_name: string,
    description: string,
    algorithm_id: string,
    state: number,
    image_tag: string,
    create_time: string,
    update_time: string,
    dataset_path: string,
    manage_login_name: string,
    result_check_file_local: string,
    train_cmd: string,
    deploy_cmd: string,
    config_tmpl: string,
    api_mook_tmpl: string
}

const FilterForm = MyForm('train-list-filter')

export const List = ( props: RouteComponentProps ) => {

    const formRef = useRef( null );

    /** 列表查询filter的默认值 */
    const [ defaultVal, defaultVal$ ] = useState({ state: 3 });

    /** 日志信息 */
    const [ logMsg, logMsg$ ] = useState('');
    
    /** 日志弹框 */
    const [ logModal, logModal$ ] = useState( false );

    /** 列表 */
    const [ list, list$ ] = useList< TTrain >({
        listUrl: '/t-apis/train/list',
    });

    /** 列表 */
    const [ models, models$ ] = useList< TAlgorithmModel >({
        listUrl: '/t-apis/model/src_models',
    });

    /** 停止训练 */
    const onStop = ( item: TTrain ) => {
        const { train_id } = item;
        Modal.confirm({
            title: '提示',
            content: '确认停止训练吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        train_id
                    },
                    successMsg: '停止成功',
                    url: '/t-apis/train/stop'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
        
                    // 刷新列表
                    list$.load({
                        params: defaultVal
                    });
                })
            }
        })
    }

    /** 获取日志 */
    const onFetchLog = ( item: TTrain ) => {

        logMsg$('');
        logModal$( true );

        http.get({
            url: `/t-apis/train/log?train_id=${item.train_id}`
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }

            logMsg$(( res.data as any ));
        })
    }

    /** 删除 */
    const onDelete = ( item: TTrain ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        train_id_list: [ item.train_id ]
                    },
                    successMsg: '删除成功',
                    url: '/t-apis/train/del_record'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
        
                    // 刷新列表
                    list$.load({
                        params: defaultVal
                    });
                })
            }
        })
    }

    /** 表单变更 */
    const onFormChange = ( e ) => {
        defaultVal$( e );
        list$.load({ params: e });
    }

    /** 表单 */
    const formItems$ = useMemo(( ) => {
        return [{
            key: 'state',
            label: '状态',
            type: 'select',
            placeholder: '请选择状态',
            defaultValue: defaultVal['state'],
            options: findDic('train.state'),
            rules: [ ]
        }, {
            key: 'model_id',
            label: '模型',
            type: 'select',
            options: (models || [ ]).map( x => ({
                value: x.id,
                label: x.model_name
            })),
            rules: [ ]
        }]
    }, [ defaultVal, models ]);

    /** 表格 */
    const listTable = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            dataset_name: {
                title: '名称',
                fixed: 'left',
                render: ( item: TTrain ) => (
                    <a>{ item.combination_name }</a>
                )
            },
            base_version_name: '基础模型版本',
            state: {
                title: '状态',
                render: ( item: TTrain ) => (
                    <a>{ findDicCN('train.state', item.state )}</a>
                )
            },
            start_time: '创建时间',
            end_time: '结束时间',
        }, {
            customs: [
                {
                    render: item => <a onClick={ e => onFetchLog( item )}>查看日志</a>
                }, {
                    render: item => <a onClick={ e => onDelete( item )}>删除</a>
                }, {
                    render: item => ( item.state === 0 || item.state === '0' || item.state === 1 || item.state === '1' ) ? 
                        <a onClick={ e => onStop( item )}>停止训练</a> : 
                        ''
                }
            ]
        }), [ list ]
    );
    
    /** didMount */
    useEffect(( ) => {
        models$.load('');
        list$.load({
            params: defaultVal
        });
    }, [ ]);

    return (
        <div className="animated fadeIn">
            <PageHeader title="训练管理" />

            {/* 筛选条件 */}
            <Card
                style={{ marginBottom: 35 }}
            >
                <FilterForm 
                    ref={ formRef }
                    layout="inline"
                    formItems={ formItems$ }
                    onChange={ onFormChange }
                />
            </Card>

            {/* 表单 */}
            <Table 
                { ...listTable }
                scroll={{ x: 1300, y: 550 }}
                pagination={{ pageSize: 5 }}
                loading={ list$.isLoading }
            />

            <Modal
                width={ 1000 }
                footer={ null }
                title="训练日志"
                visible={ logModal }
                onCancel={( ) => logModal$( false )}
                bodyStyle={{ background: '#000' }}
            >
                <pre 
                    style={{ minHeight: 280, maxHeight: 450, overflow: 'auto', color: '#fff', whiteSpace: 'pre-line' }}
                >
                    { logMsg }
                </pre>
            </Modal>
        </div>
    );
}