import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Form, Input, Select, Cascader, InputNumber, Popover, Checkbox, Row, Col, Radio } from 'antd';
import { CvterSearch } from '../cvter-search';

const { Option } = Select;
export const MyForm = ( formName: string ) => 
    Form.create({ name: formName })( React.forwardRef(( props: TPMyForm, ref ) => {

        /** selectInput类型的select value */
        const selectInputsRef = useRef<{[ key: string ]: any }>({ })
        const [ selectInputsState, selectInputsState$ ] = useState<{[ key: string ]: any }>({ });
        
        /** 表单任意值进行变化 */
        const onChange = ( ) => {
            setTimeout(( ) => {
                const selectInputs = selectInputsRef.current;

                /** 一开始的表单值 */
                let normalForm = props.form.getFieldsValue( );

                /** 混合到selectInput的值 */
                props.formItems.map(( x,k ) => {
                    if ( x.type === 'selectInput' ) {
                        normalForm = {
                            ...normalForm,
                            [ x.key ]: [ selectInputs[ x.key ], normalForm[ x.key ]]
                        }
                    }
                });

                !!props.onChange && props.onChange({ ...normalForm })
            }, 0 )
        }

        /** selectInput类型表单发生变化 */
        const onSelectInput = ( e: any, formKey: any ) => {
            const selectInputsVal = selectInputsRef.current;
            const lastSelectVal = {
                ...selectInputsVal,
                [ formKey ]: e 
            };
            selectInputsState$( lastSelectVal );
            selectInputsRef.current = lastSelectVal;
            onChange( );
        }

        /** 生成Popover */
        const generatePopover = ( formItem: any, origin: any ) => {
            if ( !!formItem.popover ) {
                return <Popover 
                    title="Tips"
                    trigger="focus"
                    placement="right"
                    content={ formItem.popover }
                >
                    { origin }
                </Popover>
            }
            return origin
        }

        /** ref引用 */
        useImperativeHandle( ref, ( ) => ({

        }))

        /** 对selectInput的select进行默认值 */
        useEffect(( ) => {
            let selectInputDefault = selectInputsRef.current;
            props.formItems
                .filter( x => x.type === 'selectInput' ) 
                .map(( x, k ) => {
                    selectInputDefault = {
                        ...selectInputDefault,
                        [ x.key ]: x.options[ 0 ].value
                    }
                });
                selectInputsState$( selectInputDefault );
                selectInputsRef.current = selectInputDefault;
        }, [ props.formItems ]);

        /** didMount，初始化配置表单项值里面的defaultValue */
        useEffect(( ) => {
            props.formItems
                .map(( x, k ) => {

                    if ( x.defaultValue === undefined ) { return; }
                    const selectInputsVal = selectInputsRef.current;

                    // 正常表单项
                    if ( x.type !== 'selectInput' ) {
                        props.form.setFieldsValue({
                            [ x.key ]: x.defaultValue
                        })
                    }

                    // 特殊处理，selectInput
                    if ( x.type === 'selectInput' ) {
                        props.form.setFields({
                            [ x.key ]: {
                                value: x.defaultValue[ 1 ]
                            }
                        });
                        const lastSelectInputsVal = {
                            ...selectInputsVal,
                            [ k ]: x.defaultValue[ 0 ]
                        };
                        selectInputsState$( lastSelectInputsVal );
                        selectInputsRef.current = lastSelectInputsVal;
                    }

                })
        }, [ props.formItems ]);

        return (
            <Form
                labelAlign={ props.align || 'right' }
                layout={ props.layout || 'horizontal' }
                labelCol={{
                    sm: { span: props.labelCol || 6 },
                    xs: { span: props.labelCol || 6 },
                }}
                wrapperCol={{
                    sm: { span: props.wrapperCol || 18 },
                    xs: { span: props.wrapperCol ||18 },
                }}
            >
                {
                    props.formItems.map(( formItem: any, k: number ) => (
                        <Form.Item
                            key={ k }
                            label={ formItem.label }
                            extra={ formItem.extra || '' }
                        >
                            {
                            generatePopover( formItem, 
                                props.form.getFieldDecorator<any>( formItem.key, {
                                    rules: formItem.rules,
                                    valuePropName: formItem.type === 'switch' ? 'checked' : 'value'
                                })(
                                    formItem.type === 'input' ?
                                        <Input 
                                            onChange={ onChange }
                                            disabled={ !!formItem.disabled } 
                                            placeholder={ formItem.placeholder || ''} 
                                        /> :
                                        formItem.type === 'select' ?
                                            <Select
                                                onChange={( e: any ) => onChange( )}
                                                disabled={ !!formItem.disabled }
                                                placeholder={ formItem.placeholder || ''} 
                                                style={{ minWidth: 150 }}
                                            >
                                                {
                                                    ( formItem.options || [ ]).map(( opt: any, k: any ) => (
                                                        <Option 
                                                            key={ k }
                                                            value={ opt.value }
                                                        >
                                                            { opt.label }
                                                        </Option>
                                                    ))
                                                }
                                            </Select> :
                                            formItem.type === 'cascader' ?
                                                <Cascader 
                                                    changeOnSelect
                                                    onChange={ onChange }
                                                    disabled={ !!formItem.disabled } 
                                                    options={ formItem.options || [ ]}
                                                    placeholder={ formItem.placeholder || ''} 
                                                    expandTrigger={ formItem.expandTrigger || 'hover' }
                                                /> :
                                                formItem.type === 'number' ?
                                                    <InputNumber 
                                                        onChange={ onChange }
                                                        disabled={ !!formItem.disabled } 
                                                        placeholder={ formItem.placeholder || ''} 
                                                        min={ formItem.min !== undefined ? formItem.min : -999999999 }
                                                        formatter={ v => formItem.formatter ? formItem.formatter( v ) : v }
                                                        parser={ v => formItem.parser ? formItem.parser( v ) : v }
                                                    /> :
                                                    formItem.type === 'textarea' ?
                                                        <Input.TextArea 
                                                            rows={ 5 }
                                                            onChange={ onChange }
                                                            disabled={ !!formItem.disabled } 
                                                            placeholder={ formItem.placeholder || ''} 
                                                        /> :
                                                        formItem.type === 'checkbox' ?
                                                            <Checkbox.Group 
                                                                style={{ width: '100%' }}
                                                                onChange={ onChange }
                                                            >
                                                                <Row>
                                                                {
                                                                    ( formItem.options || [ ]).map(( o: any, k: any ) => (
                                                                        <Col 
                                                                            key={ k }
                                                                            span={ 24 }
                                                                        >
                                                                            <Checkbox 
                                                                                value={ o.value }
                                                                            >
                                                                                { o.label }
                                                                            </Checkbox>
                                                                        </Col>
                                                                    ))
                                                                }
                                                                </Row>
                                                            </Checkbox.Group> :
                                                            formItem.type === 'selectInput' ?
                                                                <Input 
                                                                    onChange={ onChange }
                                                                    placeholder={ formItem.placeholder || ''} 
                                                                    disabled={ !!(formItem.disabled || [ ])[ 1 ] || false } 
                                                                    addonBefore={(
                                                                        <Select 
                                                                            style={{ minWidth: 100 }}
                                                                            value={ selectInputsState[ formItem.key ]}
                                                                            disabled={ !!(formItem.disabled || [ ])[ 0 ] || false } 
                                                                            onChange={( e: any ) => onSelectInput( e, formItem.key )}
                                                                        >
                                                                            {
                                                                                ( formItem.options || [ ]).map(( o: any, kkk: any ) => (
                                                                                    <Select.Option
                                                                                        key={ kkk }
                                                                                        value={ o.value }
                                                                                    >
                                                                                        { o.label }
                                                                                    </Select.Option>
                                                                                ))
                                                                            }
                                                                        </Select>
                                                                    )}
                                                                /> :
                                                                formItem.type === 'cvtersearch' ?
                                                                    <CvterSearch
                                                                        url={ formItem.url || ''} 
                                                                        query={ formItem.query || ''} 
                                                                        multipul={ !!formItem.multipul }
                                                                        nameKey={ formItem.nameKey || ''} 
                                                                        accountKey={ formItem.accountKey || ''} 
                                                                        placeholder={ formItem.placeholder || ''} 
                                                                    /> :
                                                                    formItem.type === 'radio' ?
                                                                    <Radio.Group 
                                                                        name={ formItem.key }
                                                                        onChange={ onChange }
                                                                        disabled={ !!formItem.disabled }
                                                                    >
                                                                        {
                                                                            ( formItem.options || [ ]).map(( opt: any, k: any ) => (
                                                                                <Radio 
                                                                                    key={ k }
                                                                                    value={ opt.value }
                                                                                    style={{
                                                                                        display: ( !!formItem.horizon || formItem.horizon === undefined ) ? 
                                                                                            'inline-block' : 'block',
                                                                                        marginBottom: ( !!formItem.horizon || formItem.horizon === undefined || k === formItem.options.length - 1 ) ? 
                                                                                            0 : 15
                                                                                    }}
                                                                                >
                                                                                    { opt.label }
                                                                                </Radio>
                                                                            ))
                                                                        }
                                                                    </Radio.Group> :
                                        <div></div>
                                ))
                            }
                        </Form.Item>
                    ))
                }
            </Form>
        )
    })) as any

type TPMyForm = {
    layout?: 'horizontal'|'vertical'|'inline',
    formItems: any[ ]
    form: WrappedFormUtils
    onChange?: ( data: any ) => void
    labelCol?: number
    wrapperCol?: number
    align?: 'left' | 'right'
}