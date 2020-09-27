import React, { useState } from 'react';
import { useStore } from '../../../store';
import { NlpTopicTreeV2, NlpProcessV2 } from '../../../containers';
import './index.less';

/**
 * 
 * @description
 * 回话配置页面，v2版本
 */
export const FramesV2 = ( ) => {

    const { AbilityC } = useStore( );
    const item = AbilityC.selectAbility;

    const [ frames, frames$ ] = useState< any[ ]>([ ]);
    const [ selecting, selecting$ ] = useState< Ptr | null >( null );

    return (
        <div className='p-base-frames-v2'>
            
            {/* 会话树 */}
            <div className='tree-con'>
                <NlpTopicTreeV2 
                    onSelect={ selecting$ }
                    onFramesChange={ frames$ }
                    abilityId={ item.algorithmn_id }
                />
            </div>
            
            {/* 流程配置列表 */}
            {
                !!selecting && (
                    <NlpProcessV2
                        frames={ frames }
                        meta={ selecting }
                        key={ selecting.node_id }
                        abilityId={ item.algorithmn_id }
                    />
                )
            }

        </div>
    )
}

type FramesV2 = { }

type Ptr = {
    node_type: PtrType,
    node_name: string,
    created: number,
    updated: number,
    node_id: string,
    parent_id: string
    step_type?: any
    previous_sibling?: string
    [ key: string ]: any
    children?: Ptr[ ]
}

enum PtrType {
    end = 'end',
    start = 'start',
    frame = 'frame'
}