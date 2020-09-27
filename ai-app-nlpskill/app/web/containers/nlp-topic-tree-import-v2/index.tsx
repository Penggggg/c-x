import { v4 } from 'uuid';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import React, { useEffect, useState } from 'react';
import { Modal, Select, Checkbox, Switch, InputNumber } from 'antd';

const { Option } = Select;

/**
 * 
 * @description
 * 批量导入节点
 */
export const NlpTopicTreeImportV2 = ({ show, onClose, abilityId = '', onOk }: NlpTopicTreeImport ) => {

    /** 选中的技能 */
    const [ skilling, skilling$ ] = useState< any >('');

    /** 选中的意图 */
    const [ intentings, intentings$ ] = useState< any[ ]>([ ]);

    /** 置信度 */
    const [ confidence, confidence$ ] = useState( 50 );

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
        !!onOk && onOk( skilling, intentings, confidence )
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
                            style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}
                        >
                            全选：
                            <Switch 
                                size='small' 
                                onChange={ e => selectAll( e )}
                                style={{ margin: '0 15px' }}
                            />
                            置信度：
                            <InputNumber 
                                value={ confidence }
                                style={{ margin: '0 15px' }}
                                onChange={ e => confidence$( e || 0 )}
                            />
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
    abilityId?: any
    onClose: ( ) => void,
    onOk?: ( skill, intents, confidence ) => void
}