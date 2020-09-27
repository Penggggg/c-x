import { Cascader, Button, Tooltip } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import './index.less';

export const NlpDialogAdjust = ({ abilityId = '', content = '', intent = '', intentScore = 0 }: NlpDialogAdjust ) => {

    /** 最新选择的意图 */
    const [ selectedIntent, selectedIntent$ ] = useState('');

    /** 技能里面的意图 */
    const [ indentInSkill, indentInSkill$ ] = useState< any >({ });

    /** 技能列表 */
    const [ skills, skills$ ] = useFetch({
        url: `/t-apis/v1/nlp/skill/${abilityId}`
    });

    /** 加载意图 */
    const fetchIndent = skill => {
        if ( skill === undefined || skill === null ) return;
        http.get< any >({
            params: {
                page: 1,
                size: 9999
            },
            url: `/t-apis/v1/nlp/intention/${abilityId}?skill_id=${skill}`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            indentInSkill$({
                ...indentInSkill,
                [ skill ]: ( data.intentions || [ ]).map( x => ({
                    value: x.intention_id,
                    label: `意图:${x.intention_name}`
                }))
            });
        })
    }

    /** 意图选择 */
    const onIntent = ( val ) => {

        const skill = ( val || [ ])[ 0 ] || '';
        const intent =  ( val || [ ])[ 1 ] || '';
        
        // 加载意图
        if ( !val[ 1 ] && skill !== null && !indentInSkill[ skill ]) {
            fetchIndent( skill );
        }

        !!intent && selectedIntent$( intent );
    }

    /** 调整 */
    const onAdjustIntent = ( ) => {
        if ( !selectedIntent ) return;
        http.put({
            data: {
                similar_query: String( content )
            },
            successMsg: '调整成功',
            url: `/t-apis/v1/nlp/intention/${abilityId}/${selectedIntent}/update_say`
        })
    }

    /** 意图选择 */
    const opt$ = useMemo(( ) => {
        const empty = [{
            label: ' ',
            value: ''
        }]
        const skillArr = skills.instances || [ ];
        return skillArr.map( x => {
            return {
                value: x.skill_id,
                label: `技能:${x.skill_name}`,
                children: !!indentInSkill[ x.skill_id ] ?
                    indentInSkill[ x.skill_id ].map( x => ({
                        ...x
                    })) : 
                    empty
            }
        })
    }, [ skills, indentInSkill ])

    useEffect(( ) => {
        skills$.load({
            params: {
                page: 1,
                size: 9999
            }
        });
    }, [ ]);

    return (
        <div className='con-nlp-dialog-adjust'>

            {
                !!content && (
                    <div className='content'>
                        { content }
                    </div>
                )
            }

            <div className="intent-block">
                <div>#</div>
                <div className='intent'>
                    <Tooltip 
                        title={ intent }
                    >
                        { intent }
                    </Tooltip>
                </div>
                <div>{ isNaN( Number( intentScore )) ? 0 : Number( Number( intentScore * 100 ).toFixed( 0 )) / 100 }</div>
            </div>

            <div className='adjust-intent'>
                <Cascader 
                    changeOnSelect
                    options={ opt$ }
                    expandTrigger='click'
                    placeholder={`选择新意图并调整`}
                    onChange={ e => onIntent( e )}
                />
                {
                    !!selectedIntent && (
                        <Button 
                            size='small'
                            type='primary'
                            className='intent-btn'
                            onClick={ onAdjustIntent }
                        >
                            ok
                        </Button>
                    )
                }
            </div>
        </div>
    )
}

type NlpDialogAdjust = {
    intent?: any
    abilityId?: any
    intentScore?: number
    content?: string | ReactNode
}