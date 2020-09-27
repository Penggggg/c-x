import { Link } from 'react-router-dom';
import { MyForm } from '@cvte/ai-web-util/components';
import { useList, useQuery, useFetch } from '@cvte/ai-web-util/hooks';
import { createColumns, http } from '@cvte/ai-web-util/util';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Table, Button, Tooltip, Modal, Steps, Select, notification, Upload, Icon } from 'antd';
import { transferTime2CN } from '../../../util/time';

const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;
const ButtonGroup = Button.Group;
const ImportForm = MyForm('ImportForm');
const EntityForm = MyForm('EntityForm');

/**
 * 
 * @description
 * 语音识别 - 字典
 */
export const SpeechDic = ( ) => {

    const [ query, queryStr ] = useQuery( );

    /** 展示列表 */
    const [ list, list$ ] = useList< any >({
        listUrl: `/t-apis/v1/voice/dictionary`
    });

    /** 能力列表 */
    const [ alg, alg$ ] = useFetch< any >({
        url: `/t-apis//v1/alglib`
    })

    const importRef = useRef< any >( null );
    const entityRef = useRef< any >( null );
    
    const [ step, step$ ] = useState( 0 );
    const [ editing, editing$ ] = useState('');
    const [ importing, importing$ ] = useState( false );
    const [ showImport, showImport$ ] = useState( false );
    const [ showCreate, showCreate$ ] = useState( false );
    const [ entityFormData, entityFormData$ ] = useState< any >({ });
    const [ importFormData, importFormData$ ] = useState< any >({ });
    const [ entityInAbility, entityInAbility$ ] = useState< any >({ });

    /** 选择类型 */
    const [ type, type$ ] = useState< null | ImportType >( null );

    /** 提示 */
    const onTips = description => {
        notification.info({
            message: '提示',
            description
        })
    }

    /** 下一步 */
    const onNext = ( ) => {
        if ( type === null ) {
            onTips('请选择导入方式')
            return;
        }
        step$( 1 );
    }

    /** 获取列表 */
    const fetchList = ( ) => {
        const { abilityId } = query;
        !!abilityId && list$.load(`?ability_id=${abilityId}`)
    }

    /** 上传校验 */
    const onBeforeUpload = ( ) => {
        const { name, description } = importFormData;
        if ( !name.trim( ) || !description.trim( )) {
            onTips('请完善表单')
            return false;
        }
        return true;
    }

    /** 词典上传 */
    const onDicUpload = ( e ) => {
        const { status, response } = e.file;
        
        if ( status !== 'done' ) return;
        if ( response.status !== 200 ) return;

        importRef.current.resetFields( );

        step$( 0 );
        type$( null );
        showImport$( false );
        importFormData$({ });
        fetchList( );
    }

    /** 创建或编辑 */
    const onSure = ( ) => {
        importRef.current.validateFields(( err, data ) => {
            if ( err ) {
                onTips('请完善表单');
                return;
            }
            if ( editing ) {
                onEdit( data )
            } else {
                onCreate( data )
            }
        })
    }

    /** 创建 */
    const onCreate = data => {
        http.post< any >({
            data: {
                ...data,
                ability_id: query.abilityId
            },
            successMsg: '创建成功',
            url: `/t-apis/v1/voice/dictionary`
        }).then(({ status }) => {
            if ( status !== 200 ) return;

            importRef.current.resetFields( );
            showCreate$( false );
            fetchList( );
        })
    }

    /** 删除 */
    const onDelete = item => {
        Modal.confirm({
            title: '确认删除？',
            onOk: ( ) => {
                http.delete< any >({
                    data: {
                        dict_id: item.id
                    },
                    successMsg: '删除成功',
                    url: `/t-apis/v1/voice/dictionary`
                }).then(({ status }) => {
                    if ( status !== 200 ) return;
                    fetchList( );
                    editing$('');
                })
            }
        })
    }

    /** 编辑 */
    const readyEdit = item => {
        const { id, name, description } = item;
        editing$( id )
        showCreate$( true );
        setTimeout(( ) => {
            importRef.current.setFieldsValue({
                name,
                description
            })
        }, 100 );
    }

    /** 编辑 */
    const onEdit = data => {
        http.put< any >({
            data: {
                ...data,
                dict_id: editing
            },
            successMsg: '编辑成功',
            url: `/t-apis/v1/voice/dictionary`
        }).then(({ status }) => {
            if ( status !== 200 ) return;

            importRef.current.resetFields( );
            showCreate$( false );
            fetchList( );
            editing$('');
        })
    }

    /** 能力、实体表单 */
    const onEntityChange = e => {
        const { abilityId } = e;
        entityFormData$( e );
        if ( !abilityId || !!entityInAbility[ abilityId ]) return;
        http.get< any >({
            params: {
                page: 0,
                size: 999
            },
            url: `/t-apis/v1/nlp/entity/${abilityId}`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            entityInAbility$({  
                ...entityInAbility,
                [ abilityId ]: data.instances
            });
        })
    }

    const listTable$ = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            name: {
                title: '名称',
                fixed: 'left',
                render: item => (
                    <Link to={`/speech/words${queryStr}&dicId=${item.id}`}>{ item.name }</Link>
                )
            },
            create_time: {
                title: '创建时间',
                render: item => (
                    <span>{ transferTime2CN( item.create_time )}</span>
                )
            },
            update_time: {
                title: '更新时间',
                render: item => (
                    <span>{ transferTime2CN( item.update_time )}</span>
                )
            },
            description: '描述'
        }, {
            edit: readyEdit,
            delete: onDelete
        }), [ list ]
    );

    /** 导入类型 */
    const typeOpt$ = useMemo(( ) => {
        return [{
            label: '从意图对话控制台导入',
            value: ImportType.intent
        }, {
            label: '从文件导入',
            value: ImportType.file
        }]
    }, [ ])

    /** 词典创建、编辑表单 */
    const forms$ = useMemo(( ) => {
        return [{
            key: 'name',
            label: '词典名称',
            type: 'input',
            placeholder: '请填写词典名称',
            rules: [ 
                { required: true, message: '请填写词典名称' } 
            ]
        }, {
            key: 'description',
            label: '描述备注',
            type: 'input',
            placeholder: '请填写描述备注',
            rules: [ 
                { required: true, message: '请填写描述备注' } 
            ]
        }]
    }, [ ]);

    /** 选择意图表单 */
    const forms2$ = useMemo(( ) => {
        let ability: any = [ ];
        Object.keys( alg )
            .map( classify => {
                ability = ability.concat( alg[ classify ].algorithmns || [ ])
            });
        return [{
            key: 'abilityId',
            label: '选择能力',
            type: 'select',
            options: ability.map( x => ({
                value: x.algorithmn_id,
                label: x.algorithmn_name
            })),
            placeholder: '请选择能力',
            rules: [ 
                { required: true, message: '请选择能力' } 
            ]
        }, {
            key: 'entityId',
            label: '选择实体',
            type: 'select',
            options: (entityInAbility[ entityFormData.abilityId ] || [ ]).map( x => ({
                value: x.entity_id,
                label: x.entity_name
            })),
            placeholder: '请选择实体',
            rules: [ 
                { required: true, message: '请选择实体' } 
            ]
        }]
    }, [ alg, entityInAbility, entityFormData ])

    useEffect(( ) => {
        if ( type === ImportType.intent ) {
            alg$.load('')
        }
    }, [ type ]);

    useEffect(( ) => {
        fetchList( );
    }, [ query ]);

    return (
        <div>

            <ButtonGroup
                style={{ marginBottom: 25 }}
            >
                <Tooltip
                    title='从意图或文件导入'
                >
                    <Button
                        type='primary'
                        onClick={( ) => showImport$( true )}
                    >
                        导入词典
                    </Button>
                </Tooltip>
                <Button
                    onClick={( ) => showCreate$( true )}
                >
                    新建词典
                </Button>
            </ButtonGroup>

            <Table 
                { ...listTable$ }
                scroll={{ x: 1000, y: 550 }}
                pagination={{ pageSize: 5 }}
                loading={ list$.isLoading }
            />

            <Modal
                title='导入'
                footer={ null }
                visible={ showImport }
                onCancel={( ) => showImport$( false )}
            >
                <div
                    style={{ padding: '0 35px' }}
                >
                    
                    {/* 进度提示 */}
                    <div
                        style={{ marginBottom: 50 }}
                    >
                        <Steps 
                            current={ step }
                        >
                            <Step title='选择方式' />
                            <Step title='数据导入' />
                        </Steps>
                    </div>

                    {/* 选择类型表单 */}
                    <div>
                        {
                            step === 0 && (
                                <div>
                                    <Select 
                                        value={ type }
                                        onChange={ e => type$( e )}
                                        style={{ width: '100%' }} 
                                    >
                                        {
                                            typeOpt$.map( x => (
                                                <Option 
                                                    key={ x.value }
                                                    value={ x.value }
                                                >
                                                    { x.label }
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                    <div
                                        style={{ textAlign: 'right', marginTop: 50 }}
                                    >
                                        <Button 
                                            type='primary'
                                            onClick={ onNext }
                                        >
                                            下一步
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {/* 选择实体 */}
                    {
                        step === 1 && type === ImportType.intent && (
                            <div>
                                <EntityForm 
                                    align='left'
                                    ref={ entityRef }
                                    formItems={ forms2$ }
                                    onChange={ onEntityChange }
                                />
                            </div>
                        )
                    }
                        
                    {/* 文件导入 */}
                    {
                        ( step === 1 && type === ImportType.file ) && (
                            <div>
                                <ImportForm 
                                    align='left'
                                    ref={ importRef }
                                    formItems={ forms$ }
                                    onChange={ importFormData$ }
                                />
                                <Dragger 
                                    name='dict_file'
                                    beforeUpload={ onBeforeUpload }
                                    onChange={ e => onDicUpload( e )}
                                    data={{ ability_id: query.abilityId, ...importFormData }}
                                    action={`/t-apis/v1/voice/dictionary/import_file`}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <Icon type="inbox" />
                                    </p>
                                    <p className="ant-upload-text">点击或把文件拖拽于此</p>
                                </Dragger>
                            </div>
                        )
                    }

                    {/* 第二步按钮 */}
                    {
                        step === 1 && (
                            <div style={{ marginTop: 50, textAlign: 'right' }}>
                                <Button 
                                    ghost
                                    type='primary'
                                    icon="arrow-left"
                                    onClick={( ) => step$( 0 )}
                                    style={{ marginRight: 10 }}
                                />
                                {
                                    type === ImportType.intent && (
                                        <Button 
                                            type='primary'
                                            loading={ importing }
                                        >
                                            完成
                                        </Button>
                                    )
                                }
                            </div>
                        )
                    }

                </div>                
            </Modal>

            <Modal
                onOk={ onSure }
                visible={ showCreate }
                title={ editing ? '编辑' : '创建' }
                onCancel={( ) => showCreate$( false )}
            >
                <div
                    style={{ padding: '0 35px' }}
                >
                    <ImportForm 
                        align='left'
                        ref={ importRef }
                        formItems={ forms$ }
                    />
                </div>
            </Modal>
        </div>
    )
}

enum ImportType {
    intent,
    file
}