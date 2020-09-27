import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react-lite';
import { useFetch } from '@cvte/ai-web-util/hooks';
import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, Icon, Col, Row, Pagination, Spin, notification } from 'antd';

import { useStore } from '../../../store';
import { templte2Front } from '../../../util/const';
import { TaskItem, LabelTaskCreate } from '../../../containers';

export const Entry = ( ) => {

    const pageSize = 9;

    const history = useHistory( );
    const { User } = useStore( );

    /** 定时器 */
    const clockRef = useRef< any >( null );

    /** 任务列表 */
    const tasksRef = useRef< any >({ });
    const [ tasks, tasks$ ] = useFetch< any >({ 
        url: `/t-apis/admin/labeltask/list`
    });

    /** 创建标注任务 */
    const [ showCreate, showCreate$ ] = useState( false );

    /** 拉取任务列表 */
    const fetchTask = ( page_num = 1 ) => {
        tasks$.load({
            params: {
                page_num,
                page_size: pageSize,
            }
        }).then( data => tasksRef.current = data );
    }

    /** 刷新当前列表 */
    const reFreshTask = ( ) => {
        const tasks = tasksRef.current;
        if ( !tasks ) { return; }

        const { page_num } = tasks.pagination;
        fetchTask( page_num );
    }

    /** 跳到任务详情 */
    const goDetail = ( key: number ) => {
        const { id, status, name, label_template } = tasks.results[ key ];
        const frontTemplate = templte2Front[ label_template ];
        
        if ( status === 0 ) {
            return notification.info({
                message: '提示',
                description: '任务初始化中，请稍等'
            })
        }

        if ( !frontTemplate ) {
            return notification.error({
                message: '提示',
                description: '暂无对应模板，请联系工程组'
            })
        }

        history.push(`/label/working?taskId=${id}&name=${name}&template=${frontTemplate}`);
    }

    /** 关闭创建弹框 */
    const closeCreate = ( ) => {
        reFreshTask( );
        showCreate$( false );
    }

    /** didMount */
    useEffect(( ) => {
        fetchTask( )
        // 定时刷新
        clockRef.current = setInterval( reFreshTask, 8000 );

        return ( ) => {
            const clock = clockRef.current;
            !!clock && clearInterval( clock );
        }
    }, [ ]);

    return useObserver(( ) =>(
        <div className="animated fadeIn p-base-entry">

            {/* 头部 */}
            <PageHeader
                title="标注任务"
                subTitle={<div>
                    <Icon 
                        theme="twoTone"
                        type="info-circle"
                        style={{ marginRight: 5, marginLeft: 0 }}
                    />
                    
                    {( tasks.results || [ ]).length > 0 ? '点击任务，进入标注' : '点击「创建」'}
                </div>}
            />

            {/* 数据集列表 */}
            <Spin
                spinning={ tasks$.isLoading }
            >
                <div
                    style={{ padding: '20px 20px 0' }}
                >
                    <Row gutter={[ 30, 30 ]}>

                        {/* 创建标注任务 */}
                        <Col span={8}>
                            <TaskItem 
                                title="创建" 
                                desc="新的标注任务" 
                                bg={require('../../../assets/img/bg-1.jpg').default}
                                center={
                                    <Icon 
                                        type="plus"
                                        style={{ fontSize: 40 }} 
                                    />
                                }
                                onClick={( ) => showCreate$( true )}
                            />
                        </Col>
                        
                        {/* 个人的标注任务 */}
                        {
                            ( tasks.results|| [ ])
                                .filter( t => t.role > 0 )
                                .map(( t, k ) => (
                                    <Col 
                                        span={ 8 }
                                        key={ k }
                                    >
                                        <TaskItem 
                                            id={ t.id }
                                            title={ t.name } 
                                            onDelete={ reFreshTask }
                                            onClick={( ) => goDetail( k )}
                                            desc={`类型：${t.label_template}`} 
                                            showAction={ User.account.login_name === t.create_user }
                                        />
                                    </Col>
                            ))
                        }
                    </Row>

                    {/* 分页 */}
                    <div 
                        style={{ 
                            width: '100%', 
                            display: 'flex', 
                            marginTop: 50,
                            justifyContent: 'center',
                        }}
                    > 
                        {
                            !!tasks.pagination && (
                                <Pagination 
                                    simple 
                                    defaultCurrent={ 1 } 
                                    pageSize={ pageSize }
                                    onChange={ fetchTask }
                                    total={ tasks.pagination.total }
                                />
                            )
                        }
                    </div>
                </div>
            </Spin>

            {/* 创建标注任务 */}
            <LabelTaskCreate 
                show={ showCreate }
                onCancel={ closeCreate }
            />

        </div>
    ));
}