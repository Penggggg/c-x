import React from 'react';
import { http } from '@cvte/ai-web-util/util';
import { Card, Button, Modal, Tooltip } from 'antd';
import './index.less';

type TConTaskItem = {
    id?: string
    bg?: string
    desc: string
    center?: any
    title: string
    showAction?: boolean
    onClick?: ( ) => void
    onDelete?: ( ) => void
}

export const TaskItem = ({ id, title, bg, desc, onClick, onDelete, center, showAction }: TConTaskItem ) => {

    /** 删除 */
    const ongoDelete = ( e ) => {
        e.stopPropagation( );
        Modal.confirm({
            title: '提示',
            content: '确定删除吗？',
            onOk: ( ) => {
                http.post({
                    data: {
                        label_task_id: id || ''
                    },
                    successMsg: '删除成功',
                    url: `/t-apis/admin/labeltask/delete`
                }).then( res => {
                    const { status } = res;
                    if ( status !== 200 ) { return; }
                    !!onDelete && onDelete( );
                })
            }
        })
    }

    return (
        <div
            className={`con-label-task-item ${ showAction ? 'showAction' : '' }`}
            onClick={( ) => !!onClick && onClick( )}
        >
            <Card 
                hoverable
                className="label-task-item"
                cover={
                    <div className="cover">
                        <img 
                            src={ bg || require('../../assets/img/bg-2.jpg').default }
                        />
                        <div className="cover-text">
                            { center || title[ 0 ]}
                        </div>
                    </div>
                }
            >
                <Card.Meta 
                    title={(
                        <Tooltip
                            title={ title }
                        >
                            <div>{ title }</div>
                        </Tooltip>
                    )} 
                    description={ desc } 
                />
            </Card>

            <div className="action-block">
                <Button 
                    type="danger"
                    onClick={ e => ongoDelete( e )}
                >
                    删除
                </Button>
            </div>
        </div>
    );
}