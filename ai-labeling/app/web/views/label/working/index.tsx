import { http } from '@cvte/ai-web-util/util';
import { useList, useFetch } from '@cvte/ai-web-util/hooks';
import { useObserver, useComputed } from 'mobx-react-lite';
import React, { useMemo, useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { PageHeader, Badge, Tabs, Empty, Spin, Button, Tooltip } from 'antd';

import { All } from './all';
import { Undone } from './undone';
import { Finished } from './finished';
import { useStore } from '../../../store';
import { parseQuery } from '../../../util/query';
import { ETaskRole } from '../../../util/enum';

const { TabPane } = Tabs;

/**
 * @description
 * 标注工作流程模块
 * 
 * query参数
 * 
 * name
 * taskId
 * template: img-tag | voice
 * 
 * type?: all| finished | undone
 */
export const Working = ({ location }: TPImgtag ) => {

    const history = useHistory( );
    const { LabelImg, User } = useStore( );

    /**  任务id */
    const [ taskId, taskId$ ] = useState('');

    /** 任务成员 */
    const [ taskUsers, taskUsers$ ] = useList<any>({
        listUrl: `/t-apis/admin/labeltask/users`
    });

    /** 任务详情 */
    const [ task, task$ ] = useFetch({
        url: `/t-apis/admin/labeltask/detail`
    })

    /** 
     * 点击tabs
     * 设置最新的url 
     * 并重置
     */
    const resetUrl = type => {
        const { pathname, search } = location;
        const { name, taskId, template } = parseQuery( search ); 

        LabelImg.setselectedEntryFile( null );
        history.replace(`${pathname}?taskId=${taskId}&name=${name}&type=${type}&template=${template}`)
    }

    /** 去任务成员管理 */
    const goTaskRoles = ( ) => {
        const { taskId } = parseQuery( location.search );
        history.push(`/task/roles?taskId=${taskId}`);
    }

    /** 数据变更 */
    const dataChange = ( ) => {
        http.post({
            data: {
                label_task_id: taskId
            },
            successMsg: '变更成功',
            url: `/t-apis/admin/labeltask/sync_src_data`
        })
    }

    /** 生成数据集 */
    const createDataset = ( ) => {
        http.post({
            data: {
                label_task_id: taskId
            },
            successMsg: '数据集生成中...',
            url: `/t-apis/admin/labeltask/generate_dataset`
        })
    }

    /** 任务名称 */
    const taskName$ = useMemo(( ) => {
        const { name } = parseQuery( location.search );
        return decodeURIComponent( name || '' );
    }, [ ]);

    /** 默认的key */
    const activeKey$ = useMemo(( ) => {
        const { type } = parseQuery( location.search );
        return type || 'all'
    }, [ location ]);

    /** 全部、已完成、未标注的数据 */
    const summary$ = useMemo(( ) => {
        const { data_total, labeld_total } = task;
        return {
            total: data_total || 0,
            finished: labeld_total || 0,
            undone: ( data_total || 0 ) - ( labeld_total || 0 )
        }
    }, [ task ]);

    /** 当前用户能否看到界面 */
    const canShowTask$ = useComputed(( ) => {
        const target = taskUsers.find( x => x.user_login_name === User.account.login_name );
        if ( !target || User.taskRole === ETaskRole.noRole ) {
            return false;
        }
        return true;
    }, [ taskUsers, User.account, User.taskRole ])

    /** 用户是否为当前任务的管理员 */
    const isAdm$ = useComputed(( ) => {
        const target = taskUsers.find( x => x.user_login_name === User.account.login_name );
        return !!target && target.role === ETaskRole.use
    }, [ taskUsers, User.account ]);

    /** 设置用户在当前任务的角色 */
    useEffect(( ) => {
        const target = taskUsers.find( x => x.user_login_name === User.account.login_name );
        if ( !target ) {
            return User.setRole( ETaskRole.noRole );
        }
        User.setRole( target.role );
    }, [ taskUsers ]);    

    /** didMount 任务详情、检查权限 */
    useEffect(( ) => {
        const { taskId } = parseQuery( location.search );
        const query = `?label_task_id=${taskId}`;
        
        taskId$( taskId );

        task$.load( query );
        taskUsers$.load( query );
    }, [ ])

    return useObserver(( ) => (
        <div className="animated fadeIn p-label-img-tag">

            {/* 头部 */}
            <PageHeader
                title={ taskName$ }
                onBack={( ) => history.goBack( )}
                subTitle={(
                    isAdm$ ?
                        <div style={{ paddingLeft: 20 }}>
                            <Tooltip title="成员管理">
                                <Button 
                                    size="small"
                                    type="primary" 
                                    icon="team" 
                                    shape="circle"
                                    style={{ marginRight: 8 }}
                                    onClick={ goTaskRoles }
                                />
                            </Tooltip>
        
                            <Tooltip title={ task.status > 0 ? `标注任务同步源数据变更` : `标注任务同步源数据变更（但数据未就绪）`}>
                                <Button     
                                    ghost
                                    size="small"
                                    type="primary" 
                                    icon="retweet" 
                                    shape="circle"
                                    onClick={ dataChange }
                                    style={{ marginRight: 8 }}
                                    disabled={ !( task.status > 0 )}
                                />
                            </Tooltip>

                            <Tooltip title={ ( task.labels_file_status === 0 || task.labels_file_status === 3 ) ? `生成数据集` : `生成数据集（数据集正在导出或已存在）` }>
                                <Button 
                                    ghost
                                    size="small"
                                    type="primary" 
                                    icon="arrow-down" 
                                    shape="circle"
                                    style={{ marginRight: 8 }}
                                    onClick={ createDataset }
                                    disabled={ !( task.labels_file_status === 0 || task.labels_file_status === 3 )}
                                />
                            </Tooltip>
                        </div> :
                        <div></div>
                )}
            />

            {/* 标签tab、子路由 */}
            {
                ( !taskUsers$.isLoading && canShowTask$ ) && (
                    <Tabs
                        onChange={ resetUrl }
                        activeKey={ activeKey$ }
                    >
                        <TabPane 
                            key='all'
                            tab={`全部（${summary$.total}）`}
                        >
                            {
                                activeKey$ === 'all' && (
                                    <All 
                                        taskId={ taskId }
                                    />
                                )
                            }
                        </TabPane>
                        <TabPane
                            key='finished'
                            tab={`已完成（${summary$.finished}）`}
                            disabled={ User.taskRole === ETaskRole.read }
                        >
                            {
                                activeKey$ === 'finished' && (
                                    <Finished 
                                        taskId={ taskId }
                                    />
                                )
                            }
                        </TabPane>
                        <TabPane
                            key='undone'
                            disabled={ User.taskRole === ETaskRole.read }
                            tab={
                                <Badge 
                                    count={ summary$.undone }
                                    style={{ right: -13 }}
                                >
                                    待标注 
                                </Badge>
                            }
                        >
                            {
                                activeKey$ === 'undone' && (
                                    <Undone 
                                        taskId={ taskId }
                                        onChange={( ) => task$.load(`?label_task_id=${taskId}`)}
                                    />
                                )
                            }
                        </TabPane>
                    </Tabs>
                )
            }

            {/** 无权查看 */}
            {
                ( !taskUsers$.isLoading && !canShowTask$ ) && (
                    <div 
                        style={{ paddingTop: 20 }}
                    >
                        <Empty 
                            description='暂无权限'
                        />
                    </div>
                )
            }

            {/* 加载中 */}
            {
                taskUsers$.isLoading && (
                    <div 
                        style={{ paddingTop: 20 }}
                    >
                        <Spin size="large" />
                    </div>
                )
            }
            
        </div>
    ));
};

type TPImgtag = { } & RouteComponentProps;