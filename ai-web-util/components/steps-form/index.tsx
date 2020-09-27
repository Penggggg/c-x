import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Steps, Button } from 'antd';
import { MyForm } from '../my-form';

type TStepsForm = {
    // 表单
    forms: {
        title: string,
        formItems: any[ ]
    }[ ],
    // 表单名称
    formName: string
    // 最后一步的回调
    onOk?: ( e: any ) => void,
    // 表单变更
    onChange?: ( e: any, current: number ) => void
    // 表单的默认值
    defaultValue?: any,
    // 表单的确定按钮
    isLoading?: boolean
}

const { Step } = Steps;
export const StepsForm = ({ forms, formName, onOk, onChange, defaultValue, isLoading = false }: TStepsForm ) => {

    /** 表单 */
    const formRef: any = useRef( null );

    /** 表单答案列表 */
    const answersRef = useRef< any >([ ]);

    /** 组件内部的forms */
    const formsRef = useRef< any >([ ]);

    /** 当前下标 */
    const [ current, current$ ] = useState( 0 );

    /** 下一步 */
    const goNext = ( ) => {

        const form: any = formRef.current;
        const lastCurrent = current + 1;

        // 表单校验
        form.validateFields(( err: any, value: any ) => {

            if ( !!err ) { return; }

            // 跳页、设置表单值
            if ( current < forms.length - 1 ) {
                current$( lastCurrent );
            }
        })
    }

    /** 上一步 */
    const goPre = ( ) => {

        const lastCurrent = current - 1;

        // 跳页、设置表单值
        current$( lastCurrent );
    }

    /** 监听表单 */
    const onFormChange = ( e: any) => {
        let answers = answersRef.current;
        answers[ current ] = e;
        answersRef.current = [ ...answers ];

        let result = { };
        answers.map(( answerItem: any ) => {
            result = {
                ...result,
                ...answerItem
            }
        });
        !!onChange && onChange( result, current );
    }

    /** 最终确认 */
    const onSure = ( ) => {

        let result = { };
        let answers = answersRef.current;
        const form: any = formRef.current;

        // 表单校验
        form.validateFields(( err: any, value: any ) => {

            if ( !!err ) { return; }
            answers.map(( answerItem: any ) => {
                result = {
                    ...result,
                    ...answerItem
                }
            });
            !!onOk && onOk( result );
        })
    }

    /** 表单组件 */
    const CustomForm = useMemo(( ) => MyForm( formName ), [ formName ]);

    /** 表单值 */
    const formItems$ = useMemo(( ) => {

        let answers = answersRef.current;
            // 用户通过StepForm填的
        const filled = answers[ current ];

        const r = forms[ current ]
            .formItems.map( f => {

                // 用户通过StepForm填的
                const v1 = ( filled || { })[ f.key ];

                // defaultValue的
                const v2 = ( defaultValue || { })[ f.key ];

                // 另一个defaultValue的
                const v3 = f.defaultValue;

                let defaultVal = v1 !== undefined ?
                    v1 :
                    v2 !== undefined ?
                        v2 :
                        v3 || undefined;

                return {
                    ...f,
                    defaultValue: defaultVal
                }
            });
        return r;
    }, [ current, defaultValue ]);

    /** didMount */
    useEffect(( ) => {
        current$( 0 );
        answersRef.current = [ ];
        formsRef.current = forms;
    }, [ ]);

    return (
        <div className="animated fadeIn">
            
            {/* 步骤 */}
            <Steps
                size="default"
                current={ current }
            >
                {
                    forms.map(( f, k ) => (
                        <Step 
                            key={ k }
                            title={ f.title } 
                        />
                    ))
                }
            </Steps>

            {/* 表单 */}
            <div style={{ marginTop: 40 }}>
                <CustomForm 
                    ref={ formRef }
                    onChange={ onFormChange }
                    formItems={ formItems$ }
                />
            </div>
            
            {/* 按钮 */}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
                {
                    current !== 0 && (
                        <Button 
                            ghost
                            type="primary"
                            icon="arrow-left"
                            style={{ marginRight: 10 }}
                            onClick={ goPre }
                        />
                    )
                }

                {
                    current < forms.length - 1 && (
                        <Button 
                            type="primary" 
                            onClick={ goNext }
                        >
                            下一步
                        </Button>
                    )
                }

                {
                    current === forms.length - 1 && (
                        <Button 
                            type="primary" 
                            onClick={ onSure }
                            loading={ isLoading }
                        >
                            确定
                        </Button>
                    )
                }
            </div>

        </div>
    )
}