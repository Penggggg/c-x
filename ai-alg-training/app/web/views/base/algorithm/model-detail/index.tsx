import { http } from '@cvte/ai-web-util/util';
import { useList } from '@cvte/ai-web-util/hooks';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { useInterval } from '@cvte/ai-web-util/hooks';
import { RouteComponentProps } from 'react-router-dom';
import { createColumns } from '@cvte/ai-web-util/util';
import { StepsForm } from '@cvte/ai-web-util/components';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageHeader, Table, Button, Modal, Tooltip, Tag } from 'antd';
import { findDicCN } from '../../../../util/dic';
import { transferTime2CN } from '../../../../util/time';
import { TrainModel } from '../../../../containers/train-model';
import { DeployModel } from '../../../../containers/deploy-model';
import { AlgorithmScene } from '../../../../containers/algorithm-scene';

type PAlgorithmModelDetail = {
    form: WrappedFormUtils
} & RouteComponentProps

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
    model_shelves: number
    scenarios_ids: string
}

type TAlgotithmModelVersion = {
    id: string,
    create_time: string,
    description: string,
    delete_time: string,
    model_version_name: string,
    state: number,
    update_time: string,
    result_model_remote: string,
    result_check_file_path: string,
    offline_tar_path: string,
    model_id: string,
    tar_error_msg: string
}


export const modelDetail = ( props: PAlgorithmModelDetail ) => {

    const formRef = useRef( null );

    /** 选中的模型的ID */
    const selectingRef = useRef('');

    /** 选中版本的ID */
    const seletingVersionRef = useRef('');

    /** 算法id */
    const [ algorithmId, algorithmId$ ] = useState('');

    /** 选中的模型的ID */
    const [ selecting, selecting$ ] = useState('');

    /** 编辑中模型的表单值 */
    const [ modelValues, modelValues$ ] = useState({ });

    /** 选中版本的ID */
    const [ seletingVersion, seletingVersion$ ] = useState('');

    /** 打包日志 */
    const [ tarLog, tarLog$ ] = useState('');

    /** 训练-抽屉 */
    const [ drawer, drawer$ ] = useState( false );

    /** 部署-抽屉 */
    const [ deploy, deploy$ ] = useState( false );

    /** 弹窗 */
    const [ modal, modal$ ] = useState( false );

    /** 版本弹窗 */
    const [ versionModal, versionModal$ ] = useState( false );

    /** 打包日志弹窗 */
    const [ tarLogModal, tarLogModal$ ] = useState( false );

    /** 定时器 */
    const [ versionInterval ] = useInterval( versionModal, 8000 );

    /** 定时器2 */
    const [ tarLogInterval ] = useInterval( tarLogModal, 5000 );

    /** 列表 */
    const [ sceneList, sceneList$ ] = useList< any >({ listUrl: `/t-apis/scenarios/all` })

    /** 列表 */
    const [ list, list$ ] = useList< TAlgorithmModel[ ]>({
        listUrl: '/t-apis/model/src_models',
    });

    /** 版本列表 */
    const [ versions, versions$ ] = useList< TAlgotithmModelVersion[ ]>({
        listUrl: '/t-apis/model/versions',
    });

    /** 拉取列表 */
    const fetchList = ( id?: string ) => {
        list$.load(`?algorithm_id=${ id || algorithmId }`)
    }

    /** 拉取版本列表 */
    const fetchVersion = ( id?: string ) => {
        versions$.load({
            successMsg: false,
            params: {
                model_id: `${id || selectingRef.current}`
            },
            listUrl: `/t-apis/model/versions`
        })
    }

    /** 提交创建、修改模型 */
    const onSubmit = value => {
        const { scenarios_ids } = value;
        let data = { ...value };

        if ( Array.isArray( scenarios_ids )) {
            data = {
                ...data,
                scenarios_ids: scenarios_ids.join(',')
            }
        }

        if ( !selecting ) {
            onCreat({
                ...data,
                algorithm_id: algorithmId
            })
        } else {
            onUpdate( data )
        }
    }

    /** 更新模型 */
    const onUpdate = ( data: any ) => {
        http.post({
            data: {
                ...data,
                model_id: selecting,
                algorithm_id: algorithmId
            },
            successMsg: '更新成功',
            url: '/t-apis/model/modify'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }
            // 刷新列表
            setTimeout(( ) => {
                fetchList( );
                modal$( false );
            }, 20 );
        })
    }

    /** 编辑模型 */
    const onSelect = ( item: TAlgorithmModel ) => {

        const meta = { ...item };
        const { scenarios_ids } = meta;
        delete meta.id;

        modal$( true );
        selecting$( item.id );
        selectingRef.current = item.id;

        modelValues$({
            ...meta,
            scenarios_ids: ( scenarios_ids || '').split(',')
        });
        sceneList$.load(`?algorithm_id=${algorithmId}`);
    }

    /** 创建模型 */
    const onCreatBtn = ( data: any ) => {

        modal$( true );
        selecting$('');
        modelValues$({ });
        selectingRef.current = '';
        sceneList$.load(`?algorithm_id=${algorithmId}`);
    }

    /** 创建模型 */
    const onCreat = ( data: any ) => {
        http.post({
            data: {
                ...data,
                algorithm_id: algorithmId
            },
            successMsg: '创建成功',
            url: '/t-apis/model/upload'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }
            // 刷新列表
            fetchList( );
            modal$( false );
        })
    }

    /** 删除模型 */
    const onDelete = ( item: TAlgorithmModel ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        model_id: item.id,
                        algorithm_id: algorithmId
                    },
                    successMsg: '删除成功',
                    url: '/t-apis/model/del_src_model'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
        
                    // 刷新列表
                    fetchList( );
                })
            }
        })
    }

    /** 查看版本号 */
    const onCheckVersion = ( item: TAlgorithmModel ) => {
        versionModal$( true );
        selecting$( item.id );
        fetchVersion( item.id );
        selectingRef.current = item.id;
    }

    /** 训练模型 */
    const onTrain = ( item: TAlgorithmModel ) => {
        drawer$( true );
        selecting$( item.id );
        selectingRef.current = item.id;
    }

    /** 部署模型 */
    const onDeploy = ( item: TAlgorithmModel ) => {
        deploy$( true );
        selecting$( item.id );
        selectingRef.current = item.id;
    }

    /** 离线打包 、下载离线包  */
    const onDeployTar = ( item: TAlgotithmModelVersion ) => {
        const { state } = item;

        // state: 4，打包成功，下载打包
        if ( state === 4 ) { return onDownLoadTar( item );}

        // state: 2，训练成功，离线部署打包
        http.post({
            data: {
                model_version_id: item.id
            },
            successMsg: '正在打包',
            url: '/t-apis/deploy/offline_tar'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }
            fetchVersion( selecting );
        });
    }

    /** 下载离线包 */
    const onDownLoadTar = ( item: TAlgotithmModelVersion ) => {
        http.get({
            params: {
                model_version_id: item.id
            },
            url: '/t-apis/deploy/offline_tar'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 || !data ) { return; }
            (window as any).location.href = data;
        });
    }

    /** 获取打包日志 */
    const onGetTarLog = ( item: TAlgotithmModelVersion ) => {
        
        if ( !( item.state === 3 || item.state === 4 || item.state === 5 )) { return; }

        tarLogModal$( true );
        seletingVersion$( item.id );
        seletingVersionRef.current = item.id;

        onFetchTarLog( );
    }

    /** 获取打包日志 */
    const onFetchTarLog = ( ) => {
        http.get({
            successMsg: false,
            params: {
                model_version_id: seletingVersionRef.current
            },
            url: '/t-apis/deploy/offline_log'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 || !data ) { return; }
            tarLog$(( data as any ));
        });
    }

    /** 删除版本 */
    const onDeleteVersion = ( item: TAlgotithmModelVersion ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        version_id: item.id
                    },
                    successMsg: '删除成功',
                    url: '/t-apis/model/del_version'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
                    fetchVersion( );
                })
            }
        })
    }

    /** 上架、下架模型 */
    const onShelves = ( item: TAlgorithmModel ) => {

        const url = item.model_shelves === 1 ?
            `/model/take_off` : `/model/shelves`;

        const action = item.model_shelves === 1 ?
            `下架` : `上架`

        Modal.confirm({
            title: '提示',
            content: `确定${action}吗？`,
            onOk: ( ) => {
                http.post({
                    data: {
                        model_id: item.id
                    },
                    successMsg: `${action}成功`,
                    url: `/t-apis${url}`
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }

                    // 刷新列表
                    fetchList( );
                }) 
            }
        })
    }

    /** 分布表单 */
    const formItems$ = useMemo(( ) => {
        return [{
            title: '基本信息',
            formItems: [
                {
                    key: 'model_name',
                    label: '名称',
                    type: 'input',
                    placeholder: '请填写模型名称',
                    rules: [
                        { required: true, message: '请填写模型名称' }
                    ]
                }, {
                    key: 'train_cmd',
                    label: '训练命令',
                    type: 'input',
                    placeholder: '请填写训练命令',
                    rules: [
                        { required: true, message: '请填写训练命令' }
                    ]
                }, {
                    key: 'image_tag',
                    label: '镜像标签',
                    type: 'input',
                    placeholder: '请填写镜像标签',
                    rules: [
                        { required: true, message: '请填写镜像标签' }
                    ]
                }, {
                    key: 'dataset_path',
                    label: '数据集路径',
                    type: 'input',
                    placeholder: '容器内绝对路径，开头为：/ ',
                    rules: [
                        { required: true, message: '请填写数据集路径' },
                        { pattern: /^\//, message: `绝对路径以 / 为开头`}
                    ]
                }, {
                    key: 'model_path',
                    label: '模型保存路径',
                    type: 'input',
                    placeholder: '容器内绝对路径，开头为：/ ',
                    rules: [
                        { required: true, message: '请填写模型保存路径' },
                        { pattern: /^\//, message: `绝对路径以 / 为开头`}
                    ]
                }, {
                    key: 'result_check_file_local',
                    label: '文件输出路径',
                    type: 'input',
                    placeholder: '容器内绝对路径，开头为：/ ',
                    rules: [
                        { required: true, message: '请填写文件输出路径' },
                        { pattern: /^\//, message: `绝对路径以 / 为开头`}
                    ]
                }
            ]
        }, {
            title: '部署设置',
            formItems: [
                {
                    key: 'deploy_cmd',
                    label: '部署命令',
                    type: 'input',
                    placeholder: '请填写部署命令',
                    rules: [
                        { required: true, message: '请填写部署命令' }
                    ]
                }, {
                    key: 'cpu_limit',
                    label: 'cpu限制',
                    type: 'select',
                    placeholder: '请选择cpu限制',
                    options: [{
                        value: 0.25,
                        label: '0.25Core'
                    }, {
                        value: 0.5,
                        label: '0.5Core'
                    }, {
                        value: 1,
                        label: '1Core'
                    }, {
                        value: 2,
                        label: '2Core'
                    }, {
                        value: 4,
                        label: '4Core'
                    }, {
                        value: 8,
                        label: '8Core'
                    }, {
                        value: 12,
                        label: '12Core'
                    }, {
                        value: 16,
                        label: '16Core'
                    }, {
                        value: 32,
                        label: '32Core'
                    }, {
                        value: 64,
                        label: '64Core'
                    }],
                    rules: [{ required: true, message: '请选择cpu限制' }]
                }, {
                    min: 0,
                    key: 'gpu_need',
                    label: 'gpu限制',
                    type: 'number',
                    placeholder: '请填写gpu限制',
                    rules: [
                        { required: true, message: '请填写gpu限制' }
                    ],
                    formatter: value => `${value}GiB`,
                    parser: value => value.replace('GiB', '')
                }, {
                    min: 0,
                    key: 'mem_limit',
                    label: '内存限制',
                    type: 'number',
                    placeholder: '请填写内存限制',
                    rules: [
                        { required: true, message: '请填写内存限制' }
                    ],
                    formatter: value => `${value}MiB`,
                    parser: value => value.replace('MiB', '')
                }
            ]
        }, {
            title: '其他',
            formItems: [
                {
                    key: 'scenarios_ids',
                    label: '应用场景',
                    type: 'checkbox',
                    rules: [ ],
                    options: sceneList.map( x => ({
                        value: x.id,
                        label: x.scenarios
                    }))
                }, {
                    key: 'description',
                    label: '描述',
                    type: 'input',
                    placeholder: '请填写描述',
                    rules: [ ]
                }, {
                    key: 'config_tmpl',
                    label: '配置模版',
                    type: 'textarea',
                    placeholder: '请填写配置模版',
                    rules: [ ]
                }, {
                    key: 'api_mook_tmpl',
                    label: '接口mock模板',
                    type: 'textarea',
                    placeholder: '请填写接口mock模板',
                    rules: [ ]
                }
            ]
        }]
    }, [ sceneList ]);

    /** 模型 - 列表 */
    const listTable = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            model_name: {
                title: '名称',
                render: item => !item.img_exist ? 
                    <Tooltip title="镜像创建失败，请联系工程组">
                        <Tag color="red">
                            { item.model_name }
                        </Tag>
                    </Tooltip> : 
                    <span>{ item.model_name }</span>
            },
            model_shelves: {
                title: '上下架',
                render: item => <span>{ findDicCN('model.shelves', item.model_shelves )}</span>
            },
            dataset_path: '数据集',
            train_cmd: '训练命令',
            deploy_cmd: '发布命令'
        }, {
            edit: onSelect,
            delete: onDelete,
            customs: [
                {
                    render: item => item.img_exist ? <a onClick={ e => onTrain( item )}>训练</a> : ''
                }, {
                    render: item => item.img_exist ? <a onClick={ e => onDeploy( item )}>部署</a> : ''
                }, {
                    render: item => item.model_shelves === 0 && item.img_exist ? <a onClick={ e => onShelves( item )}>上架</a> : ''
                }, {
                    render: item => item.model_shelves === 1 && item.img_exist ? <a onClick={ e => onShelves( item )}>下架</a> : ''
                }, {
                    render: item => <a onClick={ e => onCheckVersion( item )}>版本</a>
                }
            ]
        }), [ list ]
    )

    /** 版本 - 列表 */
    const versionTable = useMemo(
        ( ) => createColumns( versions, versions[ 0 ], {
            model_version_name: {
                title: '名称',
                fixed: 'left',
                render: ( item: TAlgotithmModelVersion ) => (
                    <a>{ item.model_version_name }</a>
                )
            },
            state: {
                title: '状态',
                render: ( item: TAlgotithmModelVersion ) => {
                        return item.state === 3 || item.state === 4 || item.state === 5 ?
                            <a onClick={( ) => onGetTarLog( item )}>{ findDicCN('model.version_state', item.state )}</a> :
                            <span>{ findDicCN('model.version_state', item.state )}</span>
                }
            },
            result_model_remote: {
                title: '远程结果',
                render: ( item: TAlgotithmModelVersion ) => {
                        return <Tooltip title={ item.result_model_remote }>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                { item.result_model_remote }
                            </span>
                        </Tooltip>
                }
            },
            tar_error_msg: {
                title: '镜像错误信息',
                render: ( item: TAlgotithmModelVersion ) => {
                        return <Tooltip title={ item.tar_error_msg }>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                { item.tar_error_msg }
                            </span>
                        </Tooltip>
                }
            },
            create_time: '创建时间'
        }, {
            customs: [{
                render: ( item: TAlgotithmModelVersion ) => {
                    return item.state === 2 || item.state === 4 ?
                        <a onClick={ e => onDeployTar( item )}>获取离线包</a> :
                        ''
                }
            }, {
                render: ( item: TAlgotithmModelVersion ) => <a onClick={ e => onDeleteVersion( item )}>删除</a>
            }]
        }), [ versions ]
    )

    /** didMount3 */
    useEffect(( ) => {
        tarLogInterval(( ) => onFetchTarLog( ))
    }, [ ]);

    /** didMount2 */
    useEffect(( ) => {
        versionInterval(( ) => fetchVersion( ))
    }, [ ]);

    /** didMount */
    useEffect(( ) => {
        const id = ( props.match.params as any).id
        fetchList( id );
        algorithmId$( id );
    }, [ ]);

    return (
        <div className="animated fadeIn">

            {/* 标题 */}
            <PageHeader 
                title="模型管理" 
                subTitle={ `算法 ${decodeURIComponent( ((props.location.search || '').split('=')[ 1 ] || ''))}`}
            />

            {/* 场景 */}
            <div
                style={{ padding: '10px 20px 30px' }}
            >
                <AlgorithmScene 
                    aid={ algorithmId }
                />
            </div>

            {/* 按钮 */}
            <div 
                style={{ paddingLeft: 20, marginBottom: 20 }}
            >
                <Button 
                    type="primary"
                    onClick={ onCreatBtn }
                >
                    创建模型
                </Button>
            </div>

            {/* 表格 */}
            <Table 
                { ...listTable }
                scroll={{ x: 1600, y: 550 }}
                pagination={{ pageSize: 5 }}
                loading={ list$.isLoading }
                expandedRowRender={
                    (record: any ) => <div>
                        【镜像标签】{ record.image_tag }【创建时间】{ transferTime2CN( record.create_time )} 【更新时间】{ transferTime2CN( record.create_time )} 【描述】{ record.description || '暂无' }
                    </div>
                }
            />

            {/* 弹框 - 创建、编辑模型 */}
            <Modal
                width={ 700 }
                footer={ null }
                visible={ modal }
                onCancel={ e => modal$( false )}
                title={ selecting ? '编辑模型' : '创建模型' }
            >
                <div style={{ padding: '0 100px' }}>
                    <StepsForm 
                        onOk={ onSubmit }
                        forms={ formItems$ }
                        defaultValue={ modelValues }
                        formName="algorithm-model-detail"
                    />
                </div>
            </Modal>

            {/* 弹框 - 模型的版本 */}
            <Modal
                title='版本'
                width={ 950 }
                footer={ null }
                visible={ versionModal }
                onCancel={ e => versionModal$( false )}
            >
                {/* 表格 */}
                <Table 
                    { ...versionTable }
                    scroll={{ x: 1300, y: 520 }}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>

            {/* 弹框 - 打包日志 */}
            <Modal
                width={ 900 }
                title='打包日志'
                footer={ null }
                visible={ tarLogModal }
                onCancel={ e => tarLogModal$( false )}
                bodyStyle={{ background: '#000' }}
            >
                <pre 
                    style={{ minHeight: 280, maxHeight: 450, overflow: 'auto', color: '#fff', whiteSpace: 'pre-line' }}
                >
                    { tarLog }
                </pre>
            </Modal>

            {/* 弹框 - 训练 */}
            <TrainModel 
                show={ drawer }
                modelId={ selecting }
                onClose={( ) => drawer$( false )}
            />

            {/* 发布、部署 */}
            <DeployModel 
                show={ deploy }
                modelId={ selecting }
                onClose={( ) => deploy$( false )}
            />

        </div>
    );
}