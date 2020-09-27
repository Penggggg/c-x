import { InputNumber, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { PtrConfTitle } from '../../../containers';
import { http } from '@cvte/ai-web-util/util';
import { useQuery } from '@cvte/ai-web-util/hooks';

/**
 * 
 * @description
 * 语音识别 - 设置
 */
export const SpeechSetting = ( ) => {

    const [ query ] = useQuery( );
    const [ val, val$ ] = useState< any >( 0 );

    const init = ( ) => {
        const { abilityId } = query;
        if ( !abilityId ) return;
        http.get< any >({
            url: `/t-apis/v1/voice/weights?ability_id=${abilityId}`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            val$( data.percentage || 0 );
        })
    }

    const onSave = ( ) => {
        if ( val === undefined ) return;
        http.post< any >({
            data: {
                description: '',
                ability_id: query.abilityId
            },
            successMsg: '保存成功',
            url: `/t-apis/v1/voice/version`
        })
    }

    useEffect(( ) => {
        init( );
    }, [ query ])

    return (
        <div>
            <PtrConfTitle 
                title='权重'
            />
            <div
                style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}
            >
                基础模型占比权重：
                <InputNumber 
                    min={ 0 }
                    max={ 100 }
                    value={ val }
                    onChange={ e => val$( e )}
                    formatter={ v => `${v}%` }
                    parser={ v => ( v || '').replace('%', '')}
                />
            </div>
            <Button
                type='primary'
                onClick={ onSave }
            >
                保存
            </Button>
        </div>
    )
}