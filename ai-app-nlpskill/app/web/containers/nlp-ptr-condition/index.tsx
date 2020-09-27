
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Form, Select, Row, Col, Input, Cascader } from 'antd';
import React, { useState, useMemo, useEffect, useImperativeHandle } from 'react';
import { findDic } from '../../util/dic';

const { Option } = Select;

/**
 * nlp的条件表单
 */
export const NlpPtrCondition: any = Form.create({ name: String( Date.now( ))})(
    React.forwardRef(({ form, abilityId = '', defaultValue = { }}: NlpPtrCondition, ref ) => {

        const [ compareType, compareType$ ] = useState('');

        /** 技能里面的意图 */
        const [ indentInSkill, indentInSkill$ ] = useState< any >({ });

        /** 意图里面的槽位 */
        const [ slotInIndent, slotInIndent$ ] = useState< any >({ });

        /** 技能列表 */
        const [ skills, skills$ ] = useFetch({
            url: `/t-apis/v1/nlp/skill/${abilityId}`
        });

        /** 实体列表 */
        const [ entities, entities$ ] = useFetch({
            url: `/t-apis/v1/nlp/entity/${abilityId}`
        });

        /** 槽位选择 */
        const onSlotChange = ( key, val ) => {

            if ( key !== 'slot' && key !== 'intent' ) return;
            const skill = ( val || [ ])[ 0 ] || '';
            const intent =  ( val || [ ])[ 1 ] || '';
            
            // 加载意图
            if ( !val[ 1 ] && skill !== null && !indentInSkill[ skill ]) {
                fetchIndent( skill );

            // 加载槽位
            } else if ( compareType === 'if-slot' && !val[ 2 ] && intent !== null && !slotInIndent[ intent ]) {
                fetchSlot( intent );
            }
        }

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

        /** 加载槽位 */
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
                        label: `槽位:${x.slot_name.split('@')[ 0 ]}`
                    }))
                });
            })
        }

        /** 监听所选择的类型 */
        const onChange = ( ) => {
            setTimeout(( ) => {
                const { range } = form.getFieldsValue( );
                compareType$(`if-${range}`)
            }, 0 );
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
                    </Col>
                    {
                        meta.forms.map(( f, k ) => (
                            <Col
                                key={ k }
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
                                        valuePropName: 'value'
                                    })(
                                        f.type === 'input' ?
                                                <Input 
                                                    onChange={ onChange }
                                                    placeholder={ f.placeholder }
                                                /> : 
                                                f.type === 'select' ?
                                                    <Select
                                                        onChange={ onChange }
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
                                                            expandTrigger='click'
                                                            options={ f.options }
                                                            placeholder={ f.placeholder }
                                                            onChange={ e => onSlotChange( f.key, e )}
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

        /** key值对表单的映射 */
        const key2Form$ = useMemo<{[ key: string ]: { label: string, forms: any[ ]}}>(( ) => {

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
                                compareType === 'if-slot' ?
                                    empty : 
                                    null
                        })) : 
                        empty
                }
            })

            return {
                range: {
                    label: '比较范围:',
                    forms: [
                        {
                            key: 'range',
                            type: 'select',
                            placeholder: '请选择范围',
                            options: findDic('nlp.compareRange'),
                            rules: [ 
                                { required: true, message: '请选择范围' } 
                            ]
                        }
                    ]
                },
                content: {
                    label: '内容:',
                    forms: [
                        {
                            key: 'content',
                            type: 'input',
                            placeholder: '请填写内容',
                            rules: [ 
                                // { required: true, message: '请填写内容' } 
                            ]
                        }
                    ]
                },
                'if-input': {
                    label: '如果:',
                    forms: [
                        {
                            key: 'type',
                            type: 'select',
                            options: findDic('nlp.if.input'),
                            rules: [ 
                                { required: true, message: '请选择类型' } 
                            ]
                        }, {
                            key: 'operator',
                            type: 'select',
                            options: findDic('nlp.operator.input'),
                            rules: [ 
                                { required: true, message: '请选择比较' } 
                            ]
                        }
                    ]
                },
                'if-intent': {
                    label: '如果:',
                    forms: [
                        {
                            key: 'intent',
                            type: 'cascader',
                            placeholder: '请选择意图',
                            options: slotOpts
                        }, {
                            key: 'operator',
                            type: 'select',
                            placeholder: '请选择比较',
                            options: findDic('nlp.operator.intent'),
                            rules: [ 
                                { required: true, message: '请选择比较' } 
                            ]
                        }
                    ]
                },
                'if-slot': {
                    label: '如果:',
                    forms: [
                        {
                            key: 'slot',
                            type: 'cascader',
                            placeholder: '请选择槽位',
                            options: slotOpts

                        }, {
                            key: 'operator',
                            type: 'select',
                            placeholder: '请选择比较',
                            options: findDic('nlp.operator.slot'),
                            rules: [ 
                                { required: true, message: '请选择比较' } 
                            ]
                        }
                    ]
                },
                'if-entity': {
                    label: '如果:',
                    forms: [
                        {
                            key: 'entity',
                            type: 'select',
                            placeholder: '请选择实体',
                            options: ( entities.instances || [ ]).map( x => ({
                                label: x.entity_name,
                                value: x.entity_id
                            }))
                        }, {
                            key: 'operator',
                            type: 'select',
                            placeholder: '请选择比较',
                            options: findDic('nlp.operator.slot'),
                            rules: [ 
                                { required: true, message: '请选择比较' } 
                            ]
                        }
                    ]
                },
                'if-variable': {
                    label: '如果:',
                    forms: [
                        {
                            key: 'variable',
                            type: 'input',
                            placeholder: '请填写变量名',
                            rules: [ 
                                { required: true, message: '请填写变量名' } 
                            ]
                        }, {
                            key: 'operator',
                            type: 'select',
                            placeholder: '请选择比较',
                            options: findDic('nlp.operator.variable'),
                            rules: [ 
                                { required: true, message: '请选择比较' } 
                            ]
                        }
                    ]
                }
            }
        }, [ skills, indentInSkill, slotInIndent, compareType, defaultValue, entities ]);

        /** 对外暴露接口 */
        useImperativeHandle( ref, ( ) => ({
            getData: ( ) => new Promise( r => {
                form.validateFields(( err, formVal ) => {

                    // 加上中文
                    let cnList: any[ ] = [ ];
                    const { range, slot, intent, entity } = formVal;

                    // 技能-意图-槽位的中文
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

                    if ( range === 'slot' ) {
                        const [ skillId, indentId, slotId ] =  slot;
                        cnList = findCN( skillId, indentId, slotId );
                    }

                    if ( range === 'intent') {
                        const [ skillId, indentId ] =  intent;
                        cnList = findCN( skillId, indentId );
                    }

                    if ( range === 'entity' ) {
                        cnList = [((( entities.instances || [ ]).find( x => x.entity_id === entity ) || { }).entity_name || '' )]
                    }

                    r({
                        err,
                        data: { 
                            ...formVal,
                            // 这里还要加上slot或indent时的中文
                            cnList
                        }
                    })
                })
            })
        }))

        useEffect(( ) => {
            form.setFieldsValue({
                content: '',
                operator: null
            })
        }, [ compareType ])

        useEffect(( ) => {
            
            if ( !Object.keys( defaultValue ).length ) return;

            const { range, intent, slot } = defaultValue;
            console.log(`Condition默认值`, defaultValue );

            /** 先设置比较范围 */
            if ( !!range ) {
                compareType$(`if-${range}`)
            }
            
            setTimeout(( ) => {
                let _defaultValue: any = { }
                Object.entries( defaultValue || { })
                    .map(([ k, v ]: any ) => {
                        _defaultValue[ k ] = Array.isArray( v ) ?
                            v.map( x => String( x )) :
                            String( v )
                    });
                
                /** 设置表单 */
                form.setFieldsValue( _defaultValue );

                /** 拉取意图、槽位 */
                if ( !!slot ) {
                    fetchSlot( String( slot[ 1 ]) || '' );
                    fetchIndent( String( intent[ 0 ]) || '' );
                }
                if ( !!intent ) {
                    fetchIndent( String( intent[ 0 ]) || '' );
                }

            }, 200 );

        }, [ defaultValue ]);

        useEffect(( ) => {
            skills$.load({
                params: {
                    page: 1,
                    size: 9999
                }
            });
            entities$.load({
                page: 1,
                size: 999
            })
        }, [ ]);

        return (
            <Form>
                { generateFormItem('range')}
                { !!compareType && generateFormItem( compareType )}
                { !!compareType && generateFormItem('content')}
            </Form>
        )
    })
)

type NlpPtrCondition = {
    abilityId?: any
    form: WrappedFormUtils
    defaultValue?: any
}

