import { notification } from 'antd';
import React, { useEffect } from 'react';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { ImgLabelDetectTag } from '@cvte/ai-web-util/components'

export const MyImgDetectTag = ({ type, height, canAction, src, taskId, file = { }, defaultValues = [ ], onChange }: MyImgDetectTag ) => {

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
    const onSave = ( kuangArr ) => {
        const values = kuangArr.map( kuang => {
            const { abs, labels } = kuang;
            const { x, y, w, h } = abs;
            return {
                points: [ x, y, w, h ],
                label: (labels || [ ]).join(',')
            }
        });
        const data = {
            values,
            data_id: file.id,
            label_task_id: taskId
        };

        if ( values.length === 0 ) {
            return notification.info({
                message: '提示',
                description: '请至少勾出一个框'
            })
        }

        http.post({
            data,
            successMsg: '提交成功',
            url: `/t-apis/admin/labeltask/commit_label`
        }).then( res => {
            if ( res.status === 200 ) { 
                !!onChange && onChange( data, false );
            }
        })
    }

    /** 刷新标签 */
    useEffect(( ) => {
        getTags( );
    }, [ src ]);

    return (
        <ImgLabelDetectTag
            src={ src }
            tags={ tags.default }
            type={ type }
            height={ height }
            onSave={ onSave }
            onDelete={ onDelete }
            canAction={ canAction }
            onCreate={ onCreateTag }
            defaultValues={ defaultValues }
        />
    )
}

type MyImgDetectTag = {
    file?: any,
    src: string,
    height: number,
    taskId: string,
    canAction: boolean
    onChange?: ( changeData: any, shouldNext: boolean ) => void
    type: 'single' | 'multipul'
    defaultValues?: TDefaultValues[ ]
}

type TDefaultValues = {
    id: any,
    x: number,
    y: number,
    w: number,
    h: number,
    labels: string[ ]
}
