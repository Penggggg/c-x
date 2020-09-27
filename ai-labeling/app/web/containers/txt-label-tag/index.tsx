import React, { useEffect } from 'react';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { TextLabelTag } from '@cvte/ai-web-util/components'
import { notification } from 'antd';

export const MyTxtLabelTag = ({ canAction = true, params, defaultValues, taskId, file = { }, onChange }: MyTxtLabelTag ) => {

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

        const values = e;
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
    }, [ params ]);

    return (
        /** 这里要把tag倒序输出 */
        <TextLabelTag 
            tags={ 
                tags.default.reverse( )
                    .map( x => ({
                        id: x.id,
                        val: x.name
                    }))
            }
            params={ params }
            onSure={ onSave }
            onDelete={ onDelete }
            canAction={ canAction }
            onCreate={ onCreateTag }
            defaultValue={ defaultValues || [ ]}
        />
    )
}

type MyTxtLabelTag = {
    params: string[ ]
    taskId: string,
    canAction: boolean
    defaultValues: {
        paramKey: number,
        offset: number,
        length: number,
        tagId: string | number
    }[ ]
    file?: any,
    onChange?:  ( changeData: any, shouldNext: boolean ) => void
}
