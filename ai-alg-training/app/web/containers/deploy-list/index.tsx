import yaml from 'js-yaml';
import React, { useEffect, useMemo } from 'react';
import { useList } from '@cvte/ai-web-util/hooks';
import { Table, Tooltip, notification } from 'antd';
import { http, createColumns, openWindowWithPost } from '@cvte/ai-web-util/util';

import { findDicCN } from '../../util/dic';

type TDeploy =  {
    id: string,
    create_time: null,
    description: string,
    delete_time: null,
    state: number,
    update_time: null,
    api_address: string,
    config: string,
    deploy_type: number,
    model_version_id: string,
    deploy_project_id: string,
    replicas: number,
    gpu_need: number,
    mem_limit: number,
    cpu_limit: number,
    service_name: string
}

type TConDeployList = {
    url: string
}

/**
 * 2个角色都有的部署列表
 */
export const DeployList = ({ url }: TConDeployList ) => {

    /** 列表 */
    const [ list, list$ ] = useList< TDeploy >({  listUrl: '' });

    /** 获取接口文档 */
    const getConfig = ( item: TDeploy ) => {
        const str = `/t-apis/deploy/api_config?deploy_id=${item.id}`;
        window.open(`/base/swagger/main?q=${encodeURIComponent( str )}`)
    }

    /** 跳到服务管理 */
    const goService = ( item: TDeploy ) => {
        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        const target = isProd ? 
            `http://server.research.cvte.cn/projectEnvironment?id` :
            `http://10.22.21.27:8090/projectEnvironment?id=`;
        window.open(`${target}${item.deploy_project_id}`);
        
    }

    /** 跳到在线测试服务 */
    const goPulbicService = ( item: TDeploy ) => {

        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        // 在线测试服务
        const target = isProd ? 
            `http://ai-public-service.research.cvte.cn:30040/apis/docking/train-model/img` :
            `http://ai-public-service.research.cvte.cn:30040/apis/docking/train-model/img`;

        notification.info({
            description: '提示',
            message: '准备中....'
        })

        // 获取swagger
        http.get<string>({
            url: `/t-apis/deploy/api_config?deploy_id=${item.id}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            try {

                let url = '';
                let tmiAuth = { };
                let base64_key = '';
                let method = 'post';
                let customparams = '';
                const { schemes, host, basePath, paths } = yaml.load( data );

                // 拼接url
                url = host + basePath;
                if ( schemes.find( x => x.includes( 'https' ))) {
                    url = `https://${url}`;
                } else {
                    url = `http://${url}`;
                }

                // 获得第一个接口
                const [ apiUrl, apiDetail ] = Object.entries( paths )[ 0 ];
                url += `${apiUrl}`;

                // 获得接口的方法
                const [ _method, detail ] = Object.entries( apiDetail as any )[ 0 ];
                method = _method;

                const { parameters } = ( detail as any) ;
                const bodies = parameters.filter( x => x.in === 'body' );
                const headers = parameters.filter( x => x.in === 'header' );

                // 头部校验
                headers.map( h => {
                    tmiAuth = {
                        ...tmiAuth,
                        [ h.name ]: h.default
                    }
                });

                // 参数
                bodies.map( body => {
                    Object.entries( body.schema.properties || { })
                        .map(([ k, d ]) => {
                            
                            // base64头部
                            if ( k.startsWith('base64')) {
                                base64_key = k

                            // 自定义参数
                            } else {
                                customparams += `${k},`
                            }
                        })
                });

                // 跳转
                openWindowWithPost( target, {
                    url,
                    method,
                    more: 1,
                    base64_key,
                    customparams,
                    'tmi-auth': tmiAuth
                });
            } catch ( e ) {
                notification.error({
                    description: '提示',
                    message: `解析错误，请联系开发` 
                });
                console.log( yaml.load( data ));
                console.log( e );
            }
        })
    }

    /** 表格 */
    const listTable = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            service_name: {
                title: '服务名称',
                fixed: 'left',
                render: ( item: TDeploy ) => (
                    <a onClick={ e => goService( item )}>{ item.service_name }</a>
                )
            },
            state: {
                title: '状态',
                render: ( item: TDeploy ) => (
                    <span>{ findDicCN('deploy.state', item.state )}</span>
                )
            },
            replicas: '实例个数',
            deploy_type: {
                title: '类型',
                render: ( item: TDeploy ) => (
                    <span>{ findDicCN('deploy.type', item.deploy_type )}</span>
                )
            },
            api_address: {
                title: 'api地址',
                render: ( item: any ) => {
                        return <Tooltip title={ item.api_address }>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                { item.api_address }
                            </span>
                        </Tooltip>
                }
            },
            config: {
                title: '配置',
                render: ( item: any ) => {
                        return <Tooltip title={ item.config }>
                            <span 
                                style={{ 
                                    width: 120,
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    display: 'inline-block'
                                }}
                            >
                                { item.config }
                            </span>
                        </Tooltip>
                }
            },
            gpu_need: 'gpu( GiB )',
            mem_limit: '内存( MiB )',
            cpu_limit: 'cpu( Core )'
        }, {
            customs: [{
                render: ( item: TDeploy ) => item.state === 2 ?
                    <a onClick={ e => goPulbicService( item )}>在线测试</a> :
                    ''
            }, {
                render: ( item: TDeploy ) => <a onClick={ e => getConfig( item )}>接口文档</a>
            }, {
                render: ( item: TDeploy ) => <a onClick={ e => goService( item )}>服务管理</a>
            }]
        }), [ list ]
    );

    useEffect(( ) => {
        if ( !!url ) {
            list$.load( decodeURIComponent( url ));
        }
    }, [ url ]);

    return (
        <Table 
            { ...listTable }
            scroll={{ x: 2000, y: 550 }}
            pagination={{ pageSize: 5 }}
            loading={ list$.isLoading }
        />
    );
}