import { useHistory } from 'react-router-dom';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { ImgPreview } from '@cvte/ai-web-util/components'
import React, { useRef, useEffect, useState } from 'react';
import { Card, Col, Row, Pagination, Badge, Icon, Spin, notification, Tooltip, message } from 'antd';

import { useStore } from '../../../../store';
import { ETaskRole } from '../../../../util/enum';
import { parseQuery } from '../../../../util/query';
import { TaskItem } from '../../../../containers/label-task-item';
 
export const All = ({ taskId }: PImgtagAll ) => {

    /** 间隔 */
    const gutter = 30;
    const pageSize = 12;

    const history = useHistory( );
    const { LabelImg, User } = useStore( );

    /** 当前的模板类型 */
    const [ template, template$ ] = useState('');

    /** 计算图片宽度 */
    const [ imgWidth, imgWidth$ ] = useState( 0 );

    /** 图片列表 */
    const [ list, list$ ] = useFetch({
        url: `/t-apis/admin/labeltask/get_data`
    })

    /** 容器的元素 */
    const conRef: any = useRef( null );

    /** 获取图片列表 */
    const fetchList = ( page_num = 1 ) => {
        list$.load({
            params: {
                page_num,
                data_type: 'all',
                page_size: pageSize,
                label_task_id: taskId
            }
        })
    }

    /** 设置图片宽度 */
    const setImgWidth = ( ) => {
        try {
            const { offsetWidth } = conRef.current;
            imgWidth$((( offsetWidth - gutter * 3 ) / 4 ));
        } catch ( e ) { }
    }

    /** 点击图片，进入已完成或待标注 */
    const goDetail = file => {

        const isUndone = !file.values || ( Array.isArray( file.values ) && file.values.length === 0 );

        /** 无权限 */
        if ( User.taskRole === ETaskRole.read || 
            User.taskRole === ETaskRole.noRole ) {
                return notification.info({
                    message: '提示',
                    description: '暂无权限，请联系任务创建者'
                })
        }

        /** 正在被锁 */
        if (!!file.current_lock_user && ( file.current_lock_user !== User.account.login_name )) {
            return notification.info({
                message: '提示',
                description: '正在被标注，请稍等'
            })
        }

        const { pathname, search } = history.location;
        const { taskId, name, template } = parseQuery( search );

        LabelImg.setselectedEntryFile( file );
        const go = ( ) => history.replace(`${pathname}?taskId=${taskId}&name=${name}&type=${ isUndone ? 'undone' : 'finished' }&template=${template}`);

        /** 如果是跳去未完成，则需要先上锁 */
        if ( isUndone ) {
            message.info('进入中...');
            http.post({
                data: {
                    label_task_id: taskId,
                    data_id_list: [ file.id ]
                },
                url: `/t-apis/admin/labeltask/lock_data`
            }).then( res => {
                res.status === 200 && go( );
            })
        } else {
            go( );
        }
    }

    /** didMount1，设置图片 */
    useEffect(( ) => {
        setTimeout( setImgWidth, 100 );
        window.addEventListener('resize', setImgWidth );
    }, [ ]);

    /** didMount2，拉取列表，获取当前的template */
    useEffect(( ) => {
        const { template } = parseQuery( history.location.search );

        fetchList( );
        template$( template );
    }, [ ]);

    return (
        <div 
            ref={ conRef }
            style={{ paddingTop: 20 }}
        >
            <Spin
                size='large'
                spinning={ list$.isLoading }
            >
                {/* 图片列表 */}
                <Row gutter={[ gutter, gutter ]}>
                    {
                        ( list.results || [ ]).map(( l, k ) => (
                            <Col 
                                key={ k }
                                span={ 6 }
                            >
                                <Badge 
                                    count={(
                                        <div>
                                            {/* 是否已经标注 */}
                                            {
                                                ( !l.values || ( Array.isArray( l.values ) && l.values.length === 0 )) &&
                                                    <Tooltip title='待标注'>
                                                        <Icon 
                                                            type="info-circle" 
                                                            style={{ color: '#f5222d' }} 
                                                        />
                                                    </Tooltip>
                                            }
                                            {/* 是否已经上了锁 */}
                                            {
                                                (!!l.current_lock_user && ( l.current_lock_user !== User.account.login_name )) &&
                                                    <Tooltip title='正在被标注，请稍等'>
                                                        <Icon 
                                                            type="user" 
                                                            style={{ color: '#f5222d', marginLeft: 5 }} 
                                                        />
                                                    </Tooltip>
                                            }

                                        </div>
                                    )}
                                    style={{ right: 5 }}
                                >
                                    {/* 图片标注 */}
                                    {
                                        ( template === 'img-tag' || template === 'detection-tag' ) && (
                                            <div
                                                onClick={( ) => goDetail( l )}
                                            >
                                                <Card
                                                    hoverable
                                                    cover={(
                                                        <ImgPreview 
                                                            height={ 150 }
                                                            width={ imgWidth }
                                                            src={ l.file_url }
                                                        /> 
                                                    )}
                                                    bodyStyle={{ padding: 0 }}
                                                >
                                                </Card>
                                            </div>
                                        )
                                    }
                                    {/* 音频标注 */}
                                    {
                                        template === 'voice' && (
                                            <TaskItem 
                                                desc={''} 
                                                showAction={ false }
                                                onClick={( ) => goDetail( l )}
                                                title={ l.file_url.split('/')[ l.file_url.split('/').length - 1 ]} 
                                            />
                                        )
                                    }
                                    {/* 文本 */}
                                    {
                                        template === 'txt' && (
                                            <TaskItem 
                                                desc={''} 
                                                showAction={ false }
                                                onClick={( ) => goDetail( l )}
                                                title={ l.content } 
                                            />
                                        )
                                    }
                                </Badge>
                            </Col>
                        ))
                    }
                </Row>

                {/* 分页 */}
                {
                    !!list.pagination && (
                        <div 
                            style={{ 
                                marginTop: 50,
                                width: '100%', 
                                display: 'flex', 
                                justifyContent: 'center',
                            }}
                        > 
                            <Pagination 
                                simple 
                                defaultCurrent={ 1 } 
                                pageSize={ pageSize }
                                onChange={ fetchList }
                                total={ list.pagination.total }
                            />
                        </div>
                    )
                }
            </Spin>            
        </div>
    );
}

type PImgtagAll = {
    taskId: string
} 