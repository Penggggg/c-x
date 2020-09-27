import React from 'react';
import { useStore } from '../../../store';
import { NlpProcess, NlpTopicTree } from '../../../containers';
import './index.less';

export const Entry = ( ) => {

    const { AbilityC } = useStore( );
    const item = AbilityC.selectAbility;

    return (
        <div className='animated fadeIn p-base-entry'>
            {
                !!item && (
                    <NlpTopicTree 
                        abilityId={ item.algorithmn_id }
                    />
                )
            }
            
        </div>
    );
}