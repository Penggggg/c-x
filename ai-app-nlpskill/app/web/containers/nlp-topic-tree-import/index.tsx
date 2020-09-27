import { v4 } from 'uuid';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import React, { useEffect, useState } from 'react';
import { Modal, Select, Checkbox, Switch } from 'antd';

const { Option } = Select;

/**
 * 
 * @description
 * 批量导入节点
 */
export const NlpTopicTreeImport = ({ show, onClose, abilityId = '', frame = { }, onOk }: NlpTopicTreeImport ) => {

    /** 选中的技能 */
    const [ skilling, skilling$ ] = useState< any >('');

    /** 选中的意图 */
    const [ intentings, intentings$ ] = useState< any[ ]>([ ]);

    /** 技能中的意图 */
    const [ indentInSkill, indentInSkill$ ] = useState< any >({ });

    /** 技能列表 */
    const [ skills, skills$ ] = useFetch({
        url: `/t-apis/v1/nlp/skill/${abilityId}`
    });

    /** 加载意图 */
    const fetchIndent = skill => {
        if ( !skill ) return;
        http.get< any >({
            params: {
                skill_id: skill,
                size: 999,
                page: 1
            },
            url: `/t-apis/v1/nlp/intention/${abilityId}`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            indentInSkill$({
                ...indentInSkill,
                [ skill ]: ( data.intentions || [ ])
            });
        })
    }

    /** 确定 */
    const _onOk = ( ) => {

        // frames里面的节点
        let _node2Conf = { };

        // intents 即 frames 节点
        let frames = intentings
            .map( i => indentInSkill[ skilling ].find( x => x.intention_id === i ))
            .map( i => ({
                children: [ ],
                created: Date.now( ),
                updated: Date.now( ),
                node_id: `frame_${v4( )}`,
                node_name: i.intention_name,
                node_type: `frame`,
                parent: frame.node_id
            }));

        frames.map(( f, k ) => {
            const chain = ( frame.children || [ ]);
            const chainEnd = chain[ chain.length - 1 ];
            if ( k === 0 ) {
                f['previous_sibling'] = chainEnd ? chainEnd.node_id : undefined
            } else {
                f['previous_sibling'] = frames[ k - 1 ].node_id
            }
        })

        // 给每个frame生成 start、response_condition、relations
        frames.map(( f, k ) => {

            const skillIntentId = [ skilling, intentings[ k ]];
            const skillIntentCN = [(( skills.instances || [ ]).find( x => x.skill_id === skilling ) || { }).skill_name, f.node_name ];
            const intentResponse = ((( indentInSkill[ skilling ].find( x => x.intention_id === intentings[ k ]) || { }).dialog || [ ])[ 0 ] || { }).answer

            // start
            const start = {
                y: 10,
                x: 250,
                id: v4( ),
                type: 'start',
                val: {
                    conditions: {
                        operator: '',
                        rules: [{
                            operator: '',
                            variables: [{
                                content: '50',
                                range: 'intent',
                                operator: '>=',
                                intent: skillIntentId,
                                cnList: skillIntentCN
                            }]
                        }]
                    }
                }
            };

            // response_condition
            const response_condition = {
                y: 160,
                x: 250,
                id: v4( ),
                type: 'response_condition',
                val: {
                    type: 'response_condition',
                    conditions: {
                        rules: [ ],
                        operator: 'true',
                    },
                    output: {
                        show_type: 'intent',
                        content: {
                            val: skillIntentId,
                            searchSkillResponse: intentResponse,
                            searchSkillIntent: `#{${skillIntentCN.join('.')}}`,
                        }
                    }
                }
            }

            const ptrVal = [ start, response_condition ];
            const relations = [[{
                from: start.id,
                to: response_condition.id
            }]];

            _node2Conf = {
                ..._node2Conf,
                [ f.node_id ]: {
                    ptrVal,
                    relations
                }
            }
        });

        !!onOk && onOk( frame, frames, _node2Conf );
    }

    /** 全选、全不选 */
    const selectAll = all => {
        intentings$(
            all ?
                ( indentInSkill[ skilling ]|| [ ]).map( i => i.intention_id ) :
                [ ]
        )
    }

    useEffect(( ) => {
        intentings$([ ]);
        fetchIndent( skilling );
    }, [ skilling ])

    /** 拉技能列表 */
    useEffect(( ) => {
        skills$.load({
            params: {
                page: 1,
                size: 9999
            }
        });
    }, [ ])

    return (
        <div>

            {/* 批量导入子话题 */}
            <Modal
                onOk={ _onOk }
                visible={ show }
                title='选择要导入的意图'
                onCancel={( ) => onClose( )}
            >

                {/* 选择技能 */}
                <Select 
                    onChange={ skilling$ }
                    placeholder='请选择技能'
                    style={{ width: '100%', marginBottom: 20 }}
                >
                    
                    {
                        ( skills.instances || [ ]).map(( i, k ) => (
                            <Option 
                                key={ k }
                                value={ i.skill_id }
                            >
                                { i.skill_name }
                            </Option>
                        ))
                    }
                </Select>

                {/* 全选 */}
                {
                    !!( indentInSkill[ skilling ] || [ ]).length && (
                        <div 
                            style={{ marginBottom: 10 }}
                        >
                            全选：<Switch size='small' onChange={ e => selectAll( e )}/>
                        </div>
                    )
                }

                {/* 勾选意图 */}
                <Checkbox.Group 
                    value={ intentings }
                    onChange={ intentings$ } 
                    options={( indentInSkill[ skilling ]|| [ ]).map( i => ({
                        label: i.intention_name,
                        value: i.intention_id
                    }))} 
                />
            </Modal>
        </div>
    )
}

type NlpTopicTreeImport = {
    show: boolean
    // 父节点
    frame?: any
    abilityId?: any
    onClose: ( ) => void,
    onOk?: ( frame, childNodes, childConf ) => void
}