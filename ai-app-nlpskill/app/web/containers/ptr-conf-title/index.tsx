import React from 'react';
import { Icon, Tooltip } from 'antd';
import './index.less';

export const PtrConfTitle = ({ title, tips = [ ]}: PtrConfTitle ) => {
    return (
        <div className='com-ptr-conf-title'>
            { title }
            {
                !!tips.length && (
                    <Tooltip
                        title={(
                            tips.map(( t, k ) => (
                                <p key={ k }>{ t }</p>
                            ))
                        )}
                    >
                        <Icon 
                            type='question-circle'
                            style={{
                                marginLeft: 5,
                                color: '#999',
                                cursor: 'pointer'
                            }}
                        />
                    </Tooltip>
                )
            }
        </div>
    )
}

type PtrConfTitle = {
    title: string,
    tips?: string[ ]
}