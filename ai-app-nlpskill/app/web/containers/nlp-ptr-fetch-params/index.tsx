import { http } from '@cvte/ai-web-util/util';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { useFetch, useList } from '@cvte/ai-web-util/hooks';
import React, { useMemo, useImperativeHandle, useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Cascader, Switch, Icon, Tooltip } from 'antd';
import { findDic } from '../../util/dic';

const { Option } = Select;
export const NlpPtrFetchParams: any = Form.create({ name: String( Date.now( ))})(
    React.forwardRef(({ form, abilityId = '', defaultValue = { }}: NlpPtrFetchParams, ref ) => {

        /** 值的类型：自定义、槽位 */
        const [ type, type$ ] = useState('');

        /** 参数位置 */
        const [ pos, pos$ ] = useState('');

        /** 技能里面的意图 */
        const [ indentInSkill, indentInSkill$ ] = useState< any >({ });

        /** 意图里面的槽位 */
        const [ slotInIndent, slotInIndent$ ] = useState< any >({ });

        /** 技能列表 */
        const [ skills, skills$ ] = useFetch({
            url: `/t-apis/v1/nlp/skill/${abilityId}`
        });

        /** 上下文 */
        const [ ctx, ctx$ ] = useList< string >({
            listUrl: `/t-apis/v1/nlp/dialog/context/${abilityId}`
        })

        /** 类型选择 */
        const onSelect = ( key, val) => {
            if ( key === 'type' ) {
                type$( val );
            } else if ( key === 'pos' ) {
                pos$( val )
            }
        }

        /** 槽位选择 */
        const onSlotChange = ( key, val ) => {
            if ( key !== 'value' ) return;
            const skill = ( val || [ ])[ 0 ] || '';
            const intent =  ( val || [ ])[ 1 ] || '';
            
            // 加载意图
            if ( !val[ 1 ] && skill !== null && !indentInSkill[ skill ]) {
                fetchIndent( skill );

            // 加载槽位
            } else if ( !val[ 2 ] && intent !== null && !slotInIndent[ intent ]) {
                fetchSlot( intent );
            }
        }

        /** 获取意图 */
        const fetchIndent = skill => {
            if ( skill === null || skill === undefined ) return;
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

        const fetchSlot = intent => {
            if ( intent === undefined || intent === null ) return
            http.get< any >({
                params: {
                    page: 1,
                    size: 9999
                },
                url: `/t-apis/v1/nlp/intention/${abilityId}/${intent}`
            }).then(({ status, data }) => {
                if ( status !== 200 ) return;
                slotInIndent$({
                    ...slotInIndent,
                    [ intent ]: ( data.slots || [ ]).map( x => ({
                        value: x.slot_id,
                        label: `槽位:${x.slot_name}`
                    }))
                });
            })
        }

        /** 根据key，生成一行表单 */
        const generateFormItem = ( type: Partial< keyof typeof key2Form$ >) => {
            const meta = key2Form$[ type ];
            return (
                <Row 
                    gutter={ 16 }
                >
                    <Col 
                        span={ 6 }
                        style={{ lineHeight: '30px' }}
                    >
                        { meta.label }
                        <Tooltip
                            title={ meta.tips }
                        >
                            {
                                !!meta.tips && (
                                    <Icon 
                                        type='question-circle' 
                                        style={{ marginLeft: 5 }}
                                    />
                                )
                            }
                        </Tooltip>
                    </Col>
                    {
                        meta.forms.map(( f, k ) => (
                            <Col
                                key={ f.key }
                                span={
                                    meta.forms.length === 3 ?  
                                        6 :
                                        meta.forms.length === 2 ?
                                            9 :
                                            18
                                }
                            >
                                <Form.Item>
                                {
                                    form.getFieldDecorator< any >( f.key, {
                                        rules: f.rules || [ ], 
                                        valuePropName: f.type === 'switch' ? 'checked' : 'value'
                                    })(
                                        f.type === 'input' ?
                                                <Input 
                                                    placeholder={ f.placeholder }
                                                /> : 
                                                f.type === 'select' ?
                                                    <Select
                                                        onChange={ e => onSelect( f.key, e )}
                                                        placeholder={ f.placeholder }
                                                    >
                                                        {
                                                            f.options.map(( o, kk ) => (
                                                                <Option 
                                                                    key={ kk }
                                                                    value={ o.value }
                                                                >
                                                                    { o.label }
                                                                </Option>
                                                            ))
                                                        }
                                                    </Select> :
                                                    f.type === 'cascader' ?
                                                        <Cascader 
                                                            changeOnSelect
                                                            options={ f.options }
                                                            expandTrigger='click'
                                                            placeholder={ f.placeholder }
                                                            onChange={ e => onSlotChange( f.key, e )}
                                                        /> :
                                                        f.type === 'options' ?
                                                            <Select
                                                                placeholder={ f.placeholder }
                                                            >
                                                                {
                                                                    (f.options || [ ]).map(( x, k ) => (
                                                                        <Select.Option
                                                                            key={ k }
                                                                            value={ x.value }
                                                                        >
                                                                            { x.labe }
                                                                        </Select.Option>
                                                                    ))
                                                                }
                                                            </Select> :
                                                            f.type === 'switch' ?
                                                                <Switch 
                                                                /> :
                                                                null
                                    )
                                }
                                </Form.Item>
                            </Col>
                        ))
                    }
                </Row>
            )
        }

        const key2Form$ = useMemo<{[ key: string ]: { label: string, tips?: any, forms: any[ ]}}>(( ) => { 

            const empty = [{
                label: ' ',
                value: ''
            }]

            const skillArr = skills.instances || [ ];
            const slotOpts = skillArr.map( x => {
                return {
                    value: x.skill_id,
                    label: `技能:${x.skill_name}`,
                    children: !!indentInSkill[ x.skill_id ] ?
                        indentInSkill[ x.skill_id ].map( x => ({
                            ...x,
                            children: !!slotInIndent[ x.value ] ?
                                slotInIndent[ x.value ] : 
                                empty
                        })) : 
                        empty
                }
            });

            return {
                base: {
                    label: '参数名',
                    forms: [
                        {
                            key: 'name',
                            type: 'input',
                            placeholder: '请填写字段名称',
                            rules: [ 
                                { required: true, message: '请填写字段名称' } 
                            ]
                        }, {
                            key: 'type',
                            type: 'select',
                            placeholder: '请选择参数位置',
                            options: findDic('nlp.form.paramType'),
                            rules: [ 
                                { required: true, message: '请选择请选择参数位置' } 
                            ]
                        }
                    ]
                },
                pos: {
                    label: '参数位置',
                    forms: [
                        {
                            key: 'pos',
                            type: 'select',
                            placeholder: '请选择参数位置',
                            options: findDic('nlp.form.paramPos'),
                            rules: [ 
                                { required: true, message: '请选择请选择参数位置' } 
                            ]
                        }
                    ]
                },
                'val-custom': {
                    label: '自定义',
                    forms: [
                        {
                            key: 'value',
                            type: 'input',
                            placeholder: '请填写字段的值',
                            rules: [ 
                                { required: true, message: '请填写字段的值' } 
                            ]
                        }
                    ]
                },
                'val-slot': {
                    label: '槽位:',
                    forms: [
                        {
                            key: 'value',
                            label: '意图',
                            type: 'cascader',
                            placeholder: '请选择词槽',
                            rules: [ 
                                { required: true, message: '请选择词槽' } 
                            ],     
                           options: slotOpts
                        }
                    ]
                },
                'val-context': {
                    label: '上下文',
                    forms: [
                        {
                            key: 'value',
                            type: 'select',
                            options: ctx.map( x => ({
                                label: x,
                                value: x 
                            })),
                            placeholder: '请选择上下文',
                            rules: [ 
                                { required: true, message: '请选择上下文' } 
                            ]
                        }
                    ]
                },
                conf: {
                    label: '封装参数',
                    tips: (
                        <div>
                            <p>举例：'name': [{`{'value': '张三'}, {'value': '李四'}`}]</p>
                            <p>当参数来源为【上下文】且参数位置为【请求体body】时才有这个选项</p>
                            <p>不封装参数，请求只发送值列表中的第一个元素，如：'value': '张三'</p>
                            <p>封装参数，请求会完整发送值列表，如：{`{'value': '张三'}, {'value': '李四'}`}</p>
                        </div>
                    ),
                    forms: [
                        {
                            key: 'need_deal',
                            type: 'switch',
                            defaultValue: false,
                            rules: [ ]
                        }
                    ]
                }
            }
        }, [ skills, indentInSkill, slotInIndent, ctx ]);

        /** 对外暴露接口 */
        useImperativeHandle( ref, ( ) => ({
            getData: ( ) => new Promise( r => {

                form.validateFields(( err, val ) => {
                    if ( !!err ) {
                        return r( null );
                    }

                    // 加上中文
                    let cnList: any[ ] = [ ];
                    const { type, value } = val;

                    const findCN = ( skillId, indentId, slotId? ) => {
                        let result: any[ ] = [ ];
                        if ( skillId !== undefined && skillId !== null ) {
                            const s = ( skills.instances || [ ]).find( x => x.skill_id === skillId )
                            result.push( s.skill_name )
                        } 
                        if ( !!skillId && indentId !== undefined && indentId !== null ) {
                            const i = ( indentInSkill[ skillId ] || [ ]).find( x => x.value === indentId )
                            result.push( i.label.slice( 3 ))
                        }
                        if ( !!indentId && slotId !== undefined && slotId !== null ) { 
                            const s = ( slotInIndent[ indentId ] || [ ]).find( x => x.value === slotId )
                            const label = s.label.slice( 3 );
                            result.push( label.split('@')[ 0 ])
                        }
                        return result;
                    }

                    if ( type === 'slot' ) {
                        const [ skillId, indentId, slotId ] =  value;
                        cnList = findCN( skillId, indentId, slotId );
                    }

                    r({
                        ...val,
                        cnList,
                        value: val.value
                    })
                })
            })
        }))

        useEffect(( ) => {
    
            const { type, value, pos } = defaultValue;
            if ( !Object.keys( defaultValue ).length ) return;

            console.log(`FetchParams默认值`, defaultValue );

            pos$( pos );
            type$( type );
            setTimeout(( ) => {
                let _defaultValue: any = { }
                Object.entries( defaultValue || { })
                    .map(([ k, v ]) => {
                        _defaultValue[ k ] = v;
                    });
                
                /** 设置表单 */
                form.setFieldsValue( _defaultValue );

                /** 拉取意图、槽位 */
                if ( type === 'slot' && !!value ) {
                    fetchSlot( value[ 1 ]);
                    fetchIndent( value[ 0 ]);
                }
            }, 50 );

        }, [ defaultValue ]);

        useEffect(( ) => {
            form.setFieldsValue({
                value: type === 'slot' ? [ ] : ''
            });
        }, [ type ])

        useEffect(( ) => {
            ctx$.load('');
            skills$.load({
                params: {
                    page: 1,
                    size: 9999
                }
            });
        }, [ ]);
        
        return (
            <div>
                <Form>
                    { generateFormItem('base')}
                    { generateFormItem('pos')}
                    { !!type && generateFormItem(`val-${type}`)}
                    { ( pos === 'body' && type === 'context' ) && generateFormItem('conf')}
                </Form>
            </div>
        )
    })
)

type NlpPtrFetchParams = {
    abilityId?: any
    defaultValue?: any
    form: WrappedFormUtils
}