import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { Radio, Input, InputNumber, Select, Cascader } from 'antd';
import { RichText, MulvalueActiveForm } from '@cvte/ai-web-util/components';
import React, { useMemo, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { findDic } from '../../util/dic';
import './index.less';

/** 总的可选项 */
const optMeta = {
    text: '文本',
    image: '图片',
    pause: '暂停',
    my_option: '选项',
    rich_text: '富文本',
    human_agent: '人工客服',
    intent: '意图回复',
};

const { Option } = Select;

/**
 * 节点里面的自定义回复
 */
export const PtrCustomAnswer = React.forwardRef(({ types = [ ], label = '', abilityId = '', type = undefined, defaultValue = undefined }: PtrCustomAnswer, ref ) => {

    /** 技能列表 */
    const [ skills, skills$ ] = useFetch({
        url: `/t-apis/v1/nlp/skill/${abilityId}`
    });

    /** 技能里面的意图 */
    const [ indentInSkill, indentInSkill$ ] = useState< any >({ });

    /** 当前选择类型 */
    const [ selecting, selecting$ ] = useState< Answer | null >( null );

    /** 文本 */
    const [ textVal, textVal$ ] = useState< string >('');

    /** 富文本 */
    const [ richVal, richVal$ ] = useState< string >('');

    /** 图片 */
    const [ imgVal, imgVal$ ] = useState< string >('');

    /** 选项 */
    const [ optVal, optVal$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 选项提示 */
    const [ optTips, optTips$ ] = useState< string >('');

    /** 暂停 */
    const [ pauseNum, pauseNum$ ] = useState( 0 );

    /** 暂停 */
    const [ pauseTips, pauseTips$ ] = useState('');

    /** 人工客服 */
    const [ humanAgent, humanAgent$ ] = useState({
        text: '',
        url: '',
        get_log: 1
    });

    /** 意图跳转 */
    const searchSkillRef = useRef< any >([ ]);
    const [ searchSkill, searchSkill$ ] = useState< any >([ ]);

    /** 人工客服 */
    const onHunmanAgent = ( type, val ) => {
        humanAgent$({
            ...humanAgent,
            [  type ]: val 
        });
    }

    /** 加载意图 */
    const fetchIndent = skill => {
        if ( skill === undefined || skill === null ) return;
        http.get< any >({
            params: {
                page: 1,
                size: 9999
            },
            url: `/t-apis/v1/nlp/intention/${abilityId}?skill_id=${skill}&size=999&page=1`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            indentInSkill$({
                ...indentInSkill,
                [ skill ]: data.intentions
            });
        })
    }

    /** 技能选择 */
    const onSkillChange = (  val ) => {

        const skill = ( val || [ ])[ 0 ] || '';
        
        // 加载意图
        if ( !val[ 1 ] && skill !== null && !indentInSkill[ skill ]) {
            fetchIndent( skill );
        }

        searchSkill$( val );
        searchSkillRef.current = val;
    }

    /** 校验 */
    const check = ( type: Answer | null ) => {
        if ( !type ) return true;
        if ( type === 'text' ) {
            return !!textVal.trim( );

        } else if ( type === 'rich_text' ) {
            return !!richVal.trim( );

        } else if ( type === 'image' ) {
            return !!imgVal.trim( );

        } else if ( type === 'my_option' ) {
            return Object.keys( optVal ).length > 0;

        } else if ( type === 'pause' ) {
            return !!pauseTips.trim( ) && !!pauseNum

        } else if ( type === 'human_agent' ) {
            return !!humanAgent.text.trim( );

        } else {
            return true;
        }
    }

    /** 类型选项 */
    const opts$ = useMemo(( ) => {
        return types.map( t => ({
            value: t,
            label: optMeta[ t ]
        }))
    }, [ types ]);

    /** 意图选项 */
    const indentOpt$ = useMemo(( ) => {

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
                        value: x.intention_id,
                        label: `意图:${x.intention_name}(${(( x.dialog || [ ])[ 0 ] || { }).answer })`
                    })) : 
                    empty
            }
        });
    }, [ skills, indentInSkill ])

    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {
            const isOk = check( selecting );
            let { searchSkillIntent = '', searchSkillResponse = '' } = defaultValue;

            // 处理意图跳转
            if ( selecting === 'intent' ) {
                if ( skills.instances.length > 0 ) {
                    const [ skillId, intentId ] = searchSkill;
                    const skill: any = ( skills.instances || [ ]).find( x => x.skill_id === skillId );
                    const skillName = skill.skill_name;

                    const intent = indentInSkill[ skillId ].find( x => x.intention_id === intentId );
                    let intentName = intent ? intent.intention_name : '';
                    searchSkillIntent = `#{${skillName}.${intentName}}`;

                    if ( !!intent ) {
                        searchSkillResponse = ( intent.dialog[ 0 ] || { }).answer;
                    }
                }           
            }

            return {
                err: !isOk,
                data: {
                    show_type: selecting,
                    content: selecting === 'text' ? 
                        { 
                            text: textVal 
                        } :
                        selecting === 'rich_text' ?
                            { 
                                text: richVal 
                            } :
                            selecting === 'image' ?
                                { 
                                    title: '',
                                    url: imgVal,
                                    description: ''
                                } :
                                selecting === 'my_option' ?
                                    {
                                        title: optTips,
                                        description: optTips,
                                        my_option: optVal.map( x => ({
                                            ...x,
                                            label: x.key
                                        }))
                                    } : 
                                    selecting === 'pause' ?
                                        {
                                            duration: pauseNum,
                                            tips: pauseTips
                                        } :
                                        selecting === 'human_agent' ?
                                            {
                                                ...humanAgent
                                            } :
                                            selecting === 'intent' ?
                                                {
                                                    val: searchSkill,
                                                    searchSkillIntent,
                                                    searchSkillResponse
                                                } :
                                                null
                }
            }
        }
    }))

    useEffect(( ) => {
        ( !!types[ 0 ] && !type && !selecting ) && selecting$( types[ 0 ])
    }, [ types ]);

    useEffect(( ) => {
        if ( !!type ) {
            selecting$( type );
            if ( !Object.keys( defaultValue ).length ) return;
            if ( !!defaultValue ) {
                const { } = defaultValue.output
                switch ( type ) {
                    case 'text': {
                        textVal$( defaultValue.text );
                        break;
                    }
                    case 'rich_text': {
                        richVal$( defaultValue.text );
                        break;
                    }
                    case 'image': {
                        imgVal$( defaultValue.url );
                        break;
                    }
                    case 'my_option': {
                        optVal$( defaultValue.my_option.map( x => ({
                            ...x,
                            key: x.label
                        })));
                        optTips$( defaultValue.description );
                        break;
                    }
                    case 'pause': {
                        pauseNum$( defaultValue.duration );
                        pauseTips$( defaultValue.tips );
                        break;
                    }
                    case 'human_agent': {
                        humanAgent$({ ...defaultValue });
                        break;
                    }
                    case 'intent': {
                        if ( !!defaultValue.val ) {
                            searchSkill$(( defaultValue.val || [ ]).map( x => String( x )));
                            fetchIndent( String( defaultValue.val[ 0 ]))
                        }
                        break;
                    }
                }
            }
            
        }
    }, [ type ]);

    useEffect(( ) => {
        !!abilityId && skills$.load({
            params: {
                page: 1,
                size: 9999
            }
        });
    }, [ ]);

    return (
        <div className='con-nlp-ptr-custom-answer'>

            {/* 选项 */}
            <div>
                <span>{ label }</span>
                <div className='opt-con'>
                    <Radio.Group 
                        buttonStyle='solid'
                        className='opt-block'
                        value={ selecting }
                        onChange={ e => selecting$( e.target.value )}
                    >
                        {
                            opts$.map(( o, k ) => (
                                <Radio.Button 
                                    key={ k }
                                    value={ o.value }
                                >
                                    { o.label }
                                </Radio.Button>
                            ))
                        }
                    </Radio.Group>
                </div>
            </div>

            {/* 文本类型 */}
            {
                selecting === 'text' && (
                    <Input.TextArea 
                        rows={ 4 }
                        value={ textVal }
                        placeholder='请输入文本信息'
                        onChange={ e => textVal$( e.target.value )}
                    />
                )
            }

            {/* 富文本 */}
            {
                selecting === 'rich_text' && (
                    <RichText 
                        placeholder='请输入...'
                        onChange={ richVal$ }
                        defaultValue={ richVal }
                        uploadUrl='/apis/common/object-upload'
                    />
                )
            }

            {/* 图片 */}
            {
                selecting === 'image' && (
                    <Input 
                        value={ imgVal }
                        placeholder='请输入图片url'
                        onChange={ e => imgVal$( e.target.value )}
                    />
                )
            }

            {/* 选项 */}
            {
                selecting === 'my_option' && (
                    <div>
                        <Input 
                            value={ optTips }
                            placeholder='选项标题'
                            onChange={ e => optTips$( e.target.value )}
                            style={{ marginBottom: 10 }}
                        />
                        <MulvalueActiveForm 
                            showEmpty
                            value={ optVal }
                            onChane={ optVal$ }
                            placeholder={{
                                key: '请输入选项的描述',
                                value: '请输入选项的值（英文或数字）'
                            }}
                        />
                    </div>
                )
            }

            {/* 暂停 */}
            {
                selecting === 'pause' && (
                    <div className='pause-block'>
                        <Input 
                            value={ pauseTips }
                            placeholder='暂停时提示文案'
                            onChange={ e => pauseTips$( e.target.value )}
                        />
                        <InputNumber 
                            value={ pauseNum }
                            placeholder='毫秒'
                            style={{ marginLeft: 15 }}
                            onChange={ e => pauseNum$( e || 0 )}
                            formatter={ v => `${v}毫秒` }
                            parser={ v => ( v || '').replace('毫秒', '')}
                        />
                    </div>
                )
            }

            {/* 人工客服 */}
            {
                selecting === 'human_agent' && (
                    <div>
                        <Input 
                            value={ humanAgent.text }
                            placeholder='请输入客服提示'
                            onChange={ e => onHunmanAgent('text', e.target.value )}
                            style={{ marginBottom: 12 }}
                        />
                        <Input 
                            value={ humanAgent.url }
                            placeholder='请输入人工客服URL'
                            onChange={ e => onHunmanAgent('url', e.target.value )}
                            style={{ marginBottom: 12 }}
                        />
                        <Select
                            value={ humanAgent.get_log }
                            style={{ width: '100%' }}
                            onChange={ e => onHunmanAgent('get_log', e )}
                        >
                            {
                                findDic('nlp.human_agent.log').map(( x, k ) => (
                                    <Option 
                                        key={ k }
                                        value={ x.value }
                                    >
                                        携带聊天记录：{ x.label }
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                )
            }

            {/* 意图跳转 */}
            {
                selecting === 'intent' && (
                    <Cascader 
                        changeOnSelect
                        value={ searchSkill }
                        options={ indentOpt$ }
                        onChange={ onSkillChange }
                        expandTrigger='click'
                        placeholder='请选择意图'
                        style={{ width: '100%' }}
                    />
                )
            }

        </div>
    )
})

type PtrCustomAnswer = { 
    types?: Answer[ ]
    label?: string,
    type?: Answer,
    abilityId?: any
    defaultValue?: any
}

type Answer = Partial< keyof typeof optMeta >