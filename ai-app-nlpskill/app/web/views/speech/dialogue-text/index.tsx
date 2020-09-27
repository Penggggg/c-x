import { http, createColumns } from '@cvte/ai-web-util/util';
import { MyForm, SentenceLabel } from '@cvte/ai-web-util/components';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useFetch, useList } from '@cvte/ai-web-util/hooks';
import { Input, Button, Tooltip, notification, Modal, Checkbox, Row, Switch, Table } from 'antd';
import { PtrConfTitle } from '../../../containers';
import { transferTime2CN } from '../../../util/time';
import './index.less';

const ButtonGroup = Button.Group;
const EditForm = MyForm('EditForm');

/**
 * 
 * @description
 * 语音识别 - 对话范例 - 文本范例
 */
export const SpeechDialogueText = ( ) => {

    const pageSize = 8;
    const [ query ] = useQuery( );

    /** 展示列表 */
    const [ list, list$ ] = useFetch< any >({
        url: `/t-apis/v1/voice/text`
    });

    /** 展示列表 */
    const [ dic, dic$ ] = useList< any >({
        listUrl: `/t-apis/v1/voice/dictionary`
    });

    const formRef = useRef< any >( null );
    const [ page, page$ ] = useState( 1 );
    const [ input, input$ ] = useState('');
    const [ ing, ing$ ] = useState( false );
    const [ showNlp, showNlp$ ] = useState( false );
    const [ showEdit, showEdit$ ] = useState( false );
    const [ showLabel, showLabel$ ] = useState( false );
    const [ labelStr, labelStr$ ] = useState(''); // 标注的临时数据
    const [ selecting, selecting$ ] = useState< any >( null );
    const [ suggesting, suggesting$ ] = useState< any[ ]>([ ]);
    const [ suggestions, suggestions$ ] = useState< string[ ]>([ ]);
    const [ selectedRowKeys, selectedRowKeys$ ] = useState< any[ ]>([ ]);

    const tips = description => {
        return notification.info({
            description,
            message: '提示'
        });
    }

    /** 获取字典 */
    const fetchDic = ( ) => {
        const { abilityId } = query;
        !!abilityId && dic$.load(`?ability_id=${abilityId}`)
    }

    /** 获取列表 */
    const fetchList = ( page = 1 ) => {
        const { typeId } = query;
        !!typeId && list$.load(`?text_type_id=${typeId}&page_size=${pageSize}&page_index=${page}`)
    }

    /** 生成 */
    const nlpGenerate = ( ) => {
        let txt = input.trim( );
        if ( !txt ) return tips('请输入用户可能会说的话');

        showNlp$( true );
        http.post< any >({
            data: {
                id: 1,
                texts: [ txt ]
            },
            url: `/t-nlp/encode`,
            successMsg: '生成成功'
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;

            suggesting$([ ]);
            suggestions$( 
                Array.from( new Set(
                    data.result.res[ 0 ]
                ))
            )
        })
    }

    /** 准备删除 */
    const deleteItem = item => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                onDelete( item.id )
            }
        })
    }

    /** 准备标注 */
    const readyLabel = item => {
        showLabel$( true );
        selecting$( item );
    }

    /** 直接添加 */
    const readyAdd = ( ) => {
        let txt = input.trim( );
        if ( !txt ) return tips('请输入用户可能会说的话');
        onAdd([ txt ])
    }

    /** nlp建议添加 */
    const readyAddNlp = ( ) => {
        if ( !suggesting.length ) return tips('请至少勾选一句');
        onAdd( suggesting );
    }

    /** 准备编辑 */
    const readyEdit = item => {
        showEdit$( true );
        selecting$( item );

        let content = '';
        let s = item.content;

        while ( s.length ) {
            if ( !s.includes('${')) { // 特殊情况
                content += s;
                s = ''
            }
            const Index = s.indexOf('${');
            if ( s.startsWith('${')) { // 开始解析

                const End = s.indexOf('}');
                const meta = s.substring( 0, End + 1 ).slice( 2, -1 );
                const [ label, word ] = meta.split('.');
                content += word;
                s = s.slice( End + 1 );

            } else if ( !!s ) { // 普通文字
                content += s.substring( 0, Index );
                s = s.slice( Index );
            }
        }

        setTimeout(( ) => {
            formRef.current.setFieldsValue({
                content, // 这里需要做处理，不能显示 ${bb.xx}
                range: item.rate_range[ 0 ]
            })
        }, 100 );
    }

    /** 编辑 */
    const onEdit = ( ) => {
        formRef.current.validateFields(( e, data ) => {
            if ( e ) return tips('请完善表单');
            const { id } = selecting;
            const { content, range } = data
            http.put< any >({
                data: {
                    content,
                    text_id: id,
                    rate_range: [ range, range ]
                },
                successMsg: '修改成功',
                url: `/t-apis/v1/voice/text`
            }).then(({ status }) => {
                if ( status !== 200 ) return;
                showEdit$( false );
                selecting$( null );
                fetchList( page );
            })
        })
    }

    /** 标注 */
    const onLabel = ( ) => {
        const { id } = selecting;
        http.put< any >({
            data: {
                text_id: id,
                content: labelStr,
                rate_range: selecting.rate_range
            },
            successMsg: '标注成功',
            url: `/t-apis/v1/voice/text`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            showLabel$( false );
            selecting$( null );
            fetchList( page );
        })
    }

    /** 删除 */
    const onDelete = ids => {
        return http.delete< any >({
            data: {
                text_type_id: query.typeId,
                text_id_list: Array.isArray( ids ) ? ids : [ ids ]
            },
            successMsg: '删除成功',
            url: `/t-apis/v1/voice/text`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            page$( 1 );
            fetchList( 1 );
        })
    }

    /** 添加文本范例 */
    const onAdd = content_list => {
        if ( ing ) return;
        ing$( true );
        http.post< any >({
            data: {
                content_list,
                text_type_id: query.typeId
            },
            successMsg: '添加成功',
            url: `/t-apis/v1/voice/text`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            input$('');
            ing$( false );
            showNlp$( false );
            suggesting$([ ]);
            suggestions$([ ]);
            fetchList( page );
        })
    }

    /** nlp建议 - 是否全选 */
    const onSuggest = all => {
        suggesting$( all ? suggestions : [ ])
    }

    /** 跳页 */
    const onJump = p => {
        page$( p );
        fetchList( p );
    }

    /** 词典创建、编辑表单 */
    const forms$ = useMemo(( ) => {
        return [{
            min: 1,
            key: 'range',
            label: '句频',
            type: 'number',
            placeholder: '请填写句频',
            rules: [ 
                { required: true, message: '请填写句频' } 
            ]
        }, {
            key: 'content',
            label: '文本',
            type: 'input',
            placeholder: '请填写文本',
            rules: [ 
                { required: true, message: '请填写文本' } 
            ]
        }]
    }, [ ]);

    const listTable$ = useMemo(
        ( ) => createColumns(( list.page || [ ]), ( list.page || [ ])[ 0 ], {
            name: {
                title: '文本',
                fixed: 'left',
                render: item => (
                    <SentenceLabel 
                        mode='read'
                        value={ item.content }
                        splitUrl={`/t-apis/v1/data_record/word_segm`}
                        labels={ dic.map( x => ({
                            label: x.name,
                            value: x.name
                        }))}
                    />
                )
            },
            rate_range: {
                title: '句频',
                render: item => (
                    <span>{ item.rate_range[ 0 ]}</span>
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
            }
        }, {
            edit: readyEdit,
            delete: deleteItem,
            customs: [{
                render: item => <a onClick={ e => readyLabel( item )}>标注</a> 
            }]
        }), [ list, dic ]
    );

    useEffect(( ) => {
        fetchDic( );
        fetchList( );
    }, [ query ])

    return (
        <div className='p-speechd-dialoguet-text'>

            <PtrConfTitle 
                title='文本范例'
            />

            {/* 输入框 */}
            <div className='input-con'>
                <Input 
                    value={ input }
                    style={{ width: '60%' }}
                    placeholder='输入在此场景下，用户可能会说的话'
                    onChange={ e => input$( e.target.value )}
                />
                <ButtonGroup
                    style={{ marginLeft: 25 }}
                >
                    <Button
                        ghost
                        type='primary'
                        disabled={ ing }
                        onClick={ readyAdd }
                    >
                        添加
                    </Button>
                    <Tooltip
                        title='智能生成类似的对话范例'
                    >
                        <Button
                            type='primary'
                            disabled={ ing }
                            onClick={ nlpGenerate }
                        >
                            智能生成
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </div>

            {/* 表格 */}
            <Table 
                rowKey='id'
                { ...listTable$ }
                scroll={{ x: 1000, y: 550 }}
                loading={ list$.isLoading }
                onChange={ e => onJump( e.current )}
                pagination={{ 
                    pageSize, 
                    current: page,
                    total: list.count || 1 
                }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: selectedRowKeys$
                }}
            />

            {/* 展示nlp */}
            <Modal
                okText='添加'
                cancelText='取消'
                visible={ showNlp }
                onOk={ readyAddNlp }
                title={`智能生成 - ${input}`}
                onCancel={( ) => showNlp$( false )}
            >
                <div
                    style={{ padding: '0 25px' }}
                >
                    <Checkbox.Group
                        value={ suggesting }
                        onChange={ suggesting$ }
                        style={{ width: '100%' }}
                    >
                        { !!suggestions.length && (
                            <div
                                style={{ marginBottom: 20 }}
                            >
                                全选：
                                <Switch 
                                    onChange={ e => onSuggest( e )}
                                />
                            </div>
                        )}
                        {
                            suggestions.map(( s, k ) => (
                                <Row
                                    key={ k }
                                    style={{ margin: '10px 0' }}
                                >
                                    <Checkbox 
                                        value={ s }
                                    >
                                        { s }
                                    </Checkbox>
                                </Row>
                            ))
                        }
                    </Checkbox.Group>
                </div>
            </Modal>

            {/* 展示编辑 */}
            <Modal
                title='编辑'
                onOk= { onEdit }
                visible={ showEdit }
                onCancel={( ) => showEdit$( false )}
            >
                {
                    !!selecting && (
                        <div
                            style={{ padding: '0 25px' }}
                        >
                            <EditForm 
                                align='left'
                                ref={ formRef }
                                formItems={ forms$ }
                            />
                        </div>
                    )
                }
            </Modal>

            {/* 展示标注 */}
            <Modal
                title='标注'
                onOk= { onLabel }
                visible={ showLabel }
                onCancel={( ) => showLabel$( false )}
            >
                {
                    selecting && (
                        <SentenceLabel 
                            mode='edit'
                            popTitle='选择字典'
                            value={ selecting.content }
                            onChange={ e => labelStr$( e.str )}
                            splitUrl={`/t-apis/v1/data_record/word_segm`}
                            labels={ dic.map( x => ({
                                label: x.name,
                                value: x.name
                            }))}
                        />
                    )
                }
            </Modal>
        </div>
    )
}