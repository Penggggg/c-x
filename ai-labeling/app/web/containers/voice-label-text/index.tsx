import { notification } from 'antd';
import React, { useEffect } from 'react';
import { http } from '@cvte/ai-web-util/util';
import { AudioWaveLabel } from '@cvte/ai-web-util/components'

export const MyVoiceLabelText = ({ canAction, src, defaultValues, taskId, file = { }, onChange }: MyVoiceLabelText ) => {


    /** 确认提交 */
    const onSave = ( e ) => {

        const values = e.map( x => (
            { 
                label: x.label,
                'end-time': x.end,
                'start-time': x.start,
            }
        ));
        const data = {
            values,
            data_id: file.id,
            label_task_id: taskId
        };

        if ( values.length === 0 ) {
            return notification.info({
                message: '提示',
                description: '请至少标注一个音段'
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

    return (
        <AudioWaveLabel 
            tags={[ ]}
            url={ src }
            onSave={ onSave }
            labeledList={defaultValues }
            canAction= { canAction }
            onCreateLabel={( ) => { }}
            onUpdateLabel={( ) => { }}
            onDeleteLabel={( ) => { }}
        />
    )
}

type MyVoiceLabelText = {
    src: string,
    taskId: string,
    canAction: boolean
    defaultValues: {
        start: number,
        end: number,
        label: string
    }[ ],
    file?: any,
    onChange?: ( changeData: any, shouldNext: boolean ) => void
}
