import React, { useEffect } from 'react';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { ImgLabelTag } from '@cvte/ai-web-util/components'
import { notification } from 'antd';

export const MyImgLabelTag = ({ type, height, canAction, src, defaultSelected, taskId, file = { }, onChange }: MyImgLabelTag ) => {

    /** 标签 */
    const [ tags, tags$ ] = useFetch<any>({
        url: `/t-apis/admin/labeltask/tag`,
        initVal: {
            default: [ ]
        }
    })

    /** 获取标签 */
    const getTags = ( ) => {
        tags$.load(`?label_task_id=${taskId}`)
    }

    /** 创建标签 */
    const onCreateTag = name => {
        if ( !name ) { return; }
        http.post({
            data: {
                name,
                label_task_id: taskId,
                label_propertie: 'default'
            },
            successMsg: '创建成功',
            url: `/t-apis/admin/labeltask/tag`
        }).then( res => {
            res.status === 200 && getTags( );
        })
    }

    /** 删除标签 */
    const onDelete = ( tag: any ) => {
        const { id } = tag;
        http.delete({
            data: {
                label_id: id
            },
            successMsg: '删除成功',
            url: `/t-apis/admin/labeltask/tag`
        }).then( res => {
            res.status === 200 && getTags( );
        })
    }

    /** 确认提交 */
    const onSave = ( e ) => {
        const values = e.map( x => ({ label: x.id }));
        const data = {
            values,
            data_id: file.id,
            label_task_id: taskId
        };

        if ( values.length === 0 ) {
            return notification.info({
                message: '提示',
                description: '请至少选择一个标签'
            })
        }

        http.post({
            data,
            successMsg: '提交成功',
            url: `/t-apis/admin/labeltask/commit_label`
        }).then( res => {
            if ( res.status === 200 ) { 
                !!onChange && onChange( data, true );
            }
        })
    }

    /** 刷新标签 */
    useEffect(( ) => {
        getTags( );
    }, [ src ]);

    return (
        <ImgLabelTag 
            src={ src }
            type={ type }
            tags={ tags.default }
            height={ height }
            onSave={ onSave }
            onDelete={ onDelete }
            canAction={ canAction }
            onCreate={ onCreateTag }
            defaultSelected={ defaultSelected || [ ]}
        />
    )
}

type MyImgLabelTag = {
    src: string,
    height: number,
    taskId: string,
    canAction: boolean
    type: 'single' | 'multipul'
    defaultSelected?: string[ ],
    file?: any,
    onChange?:  ( changeData: any, shouldNext: boolean ) => void
}
