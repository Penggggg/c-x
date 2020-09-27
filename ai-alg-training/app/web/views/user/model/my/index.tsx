import { Table, Modal, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import { createColumns } from '@cvte/ai-web-util/util';
import { http } from '@cvte/ai-web-util/util';
import { useList } from '@cvte/ai-web-util/hooks';
import { findDicCN } from '../../../../util/dic';
import { transferTime2CN } from '../../../../util/time';

import './index.less';

type TPMy = {
    aid: string
    aIndex: any
}

export const My = ( props: TPMy ) => {

    const history = useHistory( );

    /** 算法id */
    const [ aid, aid$ ] = useState('');

    /** 模型列表 */
    const [ list, list$ ] = useList< any >({ listUrl: `/t-apis/public/my_models` })

    // 刷新列表
    const refreshList = ( ) => {
        list$.load(`?algorithm_id=${aid}`)
    }

    /** 停止训练 */
    const onStop = ( item: any ) => {
        const { train_id } = item;
        Modal.confirm({
            title: '提示',
            content: '确认停止训练吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        train_id
                    },
                    url: '/t-apis/train/stop'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
        
                    // 刷新列表
                    refreshList( );
                })
            }
        })
    }

    /** 删除 */
    const onDelete = ( item: any ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        version_id: item.version_id
                    },
                    url: '/t-apis/model/del_version'
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
        
                    // 刷新列表
                    refreshList( );
                })
            }
        })
    }

    /** 跳到服务管理 部署 */
    const goService = ( item: any ) => {
        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        const target = isProd ? 
            `http://server.research.cvte.cn/projectEnvironment?id` :
            `http://10.22.21.27:8090/projectEnvironment?id=`;

        window.open(`${target}${item.deploy_project_id}`);
    }

    /** 部署 */
    const onDeploy = ( item: any ) => {
        const { aid, aIndex } = props;
        history.push(`/user/model/${aid}/${aIndex}/deploy?v=${item.version_id}`)
    }

    /** 离线打包 、下载离线包  */
    const onDeployTar = ( item: any ) => {
        const { state } = item;

        // state: 4，打包成功，下载打包
        if ( state === 4 ) { return onDownLoadTar( item );}

        // state: 2，训练成功，离线部署打包
        http.post({
            data: {
                model_version_id: item.version_id
            },
            url: '/t-apis/deploy/offline_tar'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) { return; }
            refreshList( );
        });
    }

    /** 下载离线包 */
    const onDownLoadTar = ( item: any ) => {
        http.get({
            params: {
                model_version_id: item.version_id
            },
            url: '/t-apis/deploy/offline_tar'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 || !data ) { return; }
            (window as any).location.href = data;
        });
    }

    /** 查看部署列表 */
    const onDeployList = ( item: any ) => {
        const { version_id } = item;
        if ( !version_id ) { return; }

        const { aid, aIndex } = props;
        const url = `/t-apis/public/deploys?model_version_id=${version_id}`
        history.push(`/user/model/${aid}/${aIndex}/deploied?url=${encodeURIComponent( url )}`)
    }

    /** 列表 */
    const listTable = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            version_name: '版本',
            state: {
                title: '状态',
                render: ( item: any ) => <a>{ findDicCN('model.version_state', item.state )}</a>
            },
            c: {
                title: '场景',
                render: ( item: any ) => {
                        const { model_name, description, scenarios_info } = item.src_model_info;
                        return <Tooltip title={`所属模型：${model_name}。详情：${description}`}>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                {( scenarios_info || { }).name }
                            </span>
                        </Tooltip>
                }
            },
            create_time: {
                title: '创建时间',
                render: ( item: any ) => <span>{ transferTime2CN( item.create_time )}</span>
            },
            evaluate: {
                title: '结果',
                render: ( item: any ) => {
                        return <Tooltip title={ item.evaluate }>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                { item.evaluate }
                            </span>
                        </Tooltip>
                }
            }
        }, {
            customs: [{
                render: ( item: any ) => {
                    return item.state >= 2 ?
                        <a onClick={ e => onDeploy( item )}>部署</a> :
                        ''
                }
            }, {
                render: ( item: any ) => <a onClick={ e => onDeployList( item )}>部署详情</a>
            }, {
                render: item => !! item.deploy_project_id ? 
                    <a onClick={ e => goService( item )}>服务管理</a> :
                    ''
            }, {
                render: ( item: any ) => {
                    return item.state === 2 || item.state === 4 ?
                        <a onClick={ e => onDeployTar( item )}>获取离线包</a> :
                        ''
                }
            }, {
                render: item => ( item.state === 0 || item.state === '0' || item.state === 1 || item.state === '1' ) ? 
                    <a onClick={ e => onStop( item )}>停止训练</a> : 
                    ''
            }, {
                render: item => <a onClick={ e => onDelete( item )}>删除</a>
            }]
        }), [ list ]
    )

    /** didMount */
    useEffect(( ) => {
        aid$( props.aid );
        list$.load(`?algorithm_id=${props.aid}`)
    }, [ ]);

    return (
        <div className="p-use-model-my animated fadeIn">

            <div className="title">
                我的模型
            </div>

            {/* 表格 */}
            <Table 
                { ...listTable }
                scroll={{ x: 1600, y: 550 }}
                pagination={{ pageSize: 5 }}
                loading={ list$.isLoading }
                expandedRowRender={
                    (record: any ) => <div>
                        【描述】{ record.description || '暂无' }
                    </div>
                }
            />
            
        </div>
    )
}