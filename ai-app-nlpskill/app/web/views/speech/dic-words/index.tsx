import React, { useEffect, useState, useMemo } from 'react';
import { useFetch, useQuery } from '@cvte/ai-web-util/hooks';
import { createColumns, http } from '@cvte/ai-web-util/util';
import { Button, Table, Tag, Modal, Input, Card, Radio, Icon } from 'antd';
import { findDicCN } from '../../../util/dic';
import { Divider } from 'rc-menu';

const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;

/**
 * 
 * @description
 * 语音识别 - 字典 - 词条
 */
export const SpeechWords = ( ) => {

    const pageSize = 10;
    const [ query ] = useQuery( );
    const [ list, list$ ] = useFetch< any >({
        url: `/t-apis/v1/voice/entry`
    });

    const [ val, val$ ] = useState('');
    const [ meta, meta$ ] = useState(''); // 单一个词条
    const [ search, search$ ] = useState('');
    const [ page, page$ ] = useState( 1 );
    const [ showFix, showFix$ ] = useState( false );
    const [ isEditing, isEditing$ ] = useState( false );
    const [ showCreate, showCreate$ ] = useState( false );
    const [ showCreateMeta, showCreateMeta$ ] = useState( false );
    const [ selecting, selecting$ ] = useState< any >( null );
    const [ selectedRowKeys, selectedRowKeys$ ] = useState< any[ ]>([ ]);

    /** 获取列表 */
    const fetchList = ( page = 1 ) => {
        const { dicId } = query;
        !!dicId && list$.load(`?dict_id=${dicId}&page_size=${pageSize}&page_index=${page}&name=${search.trim()}`)
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

    /** 准备删除 */
    const deleteArray = ( ) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                onDelete( selectedRowKeys )
                    .then(( ) => {
                        selectedRowKeys$([ ])
                    })
            }
        })
    }

    /** 拼音标注 */
    const readyFix = item => {
        showFix$( true );
        selecting$( item );
    }

    /** 编辑 */
    const readyEdit = item => {
        selecting$( item );
        isEditing$( true );
    }

    /** 跳页 */
    const onJumpPage = p => {
        page$( p );
        fetchList( p );
    }

    /** 创建 */
    const onCreate = ( ) => {
        const { dicId } = query;
        const words = val.split(' ').filter( x => !!x );
        http.post< any >({
            data: {
                dict_id: dicId,
                entry: [ words.join('#')]
            },
            successMsg: '创建成功',
            url: `/t-apis/v1/voice/entry`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            val$('');
            fetchList( page );
            showCreate$( false );
        })
    }

    /** 创建单一个词条 */
    const onCreateMeta = ( ) => {
        if ( !meta.trim( )) return;
        http.put< any >({
            data: {
                index: 99,
                func: 'add',
                word: meta.trim( ),
                entry_id: selecting.id
            },
            successMsg: '创建成功',
            url: `/t-apis/v1/voice/entry`
        }).then(({ status }) => { 
            if ( status !== 200 ) return;
            meta$('');
            fetchList( page );
            showCreateMeta$( false );
        })
    }

    /** 删除 */
    const onDelete = ids => {
        const { dicId } = query;
        return http.delete< any >({
            data: {
                dict_id: dicId,
                entry_id_list: Array.isArray( ids ) ? ids : [ ids ]
            },
            successMsg: '删除成功',
            url: `/t-apis/v1/voice/entry`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            page$( 1 );
            fetchList( 1 );
        })
    }

    /** 拼音调整 */
    const onAdjustPy = ( word, letter, val ) => {
        if ( !selecting ) return;
        let temp = { ...selecting };
        temp.pinyin[ word ][ letter ].index = val;
        selecting$( temp )
    }

    /** 拼音标注 */
    const onSurePy = ( ) => {
        if ( !selecting ) return;
        const { id, entry, pinyin } = selecting;
        http.put< any >({
            data: {
                entry,
                pinyin,
                entry_id: id,
            },
            successMsg: '调整成功',
            url: `/t-apis/v1/voice/entry`
        }).then(({ status }) => {
            if ( status !== 200 ) return;

            fetchList( page );
            showFix$( false );
            selecting$( null );
        })
    }

    /** 删除某个词条 */
    const onDeleteTag = ( e, word, index ) => {
        e.preventDefault( );
        Modal.confirm({
            title: '提示',
            content: '确定删除吗？',
            onOk: ( ) => {
                http.put< any >({
                    data: {
                        word,
                        index,
                        func: 'del',
                        entry_id: selecting.id
                    },
                    successMsg: '删除成功',
                    url: `/t-apis/v1/voice/entry`
                }).then(({ status }) => { 
                    if ( status !== 200 ) return;
                    fetchList( page );
                })
            }
        })
    }

    const listTable$ = useMemo(
        ( ) => createColumns(( list.page || [ ]), ( list.page || [ ])[ 0 ], {
            name: {
                width: 450,
                title: '名称',
                fixed: 'left',
                render: item => (
                    <div>
                        {
                            ( item.entry || [ ]).map(( w, k ) => (
                                <Tag
                                    key={ k }
                                    color="blue"
                                    style={{ margin: '5px' }}
                                    closable={ isEditing && !!selecting && ( item.id === selecting.id )}
                                    onClose={ e => onDeleteTag( e, w, k )}
                                >
                                    { w }
                                </Tag>
                            ))
                        }
                        {
                            ( isEditing && !!selecting && ( item.id === selecting.id )) && (
                                <Tag 
                                    onClick={( ) => showCreateMeta$( true )}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type='plus' /> 添加
                                </Tag>
                            )
                        }
                    </div>
                )
            },
            confidence: {
                title: '拼音置信度',
                render: item => (
                    <Tag
                        onClick={ e => readyFix( item )}
                        color={ !item.confidence ? 'gold' : 'green' }
                    >
                        { findDicCN('speech.words.confidence', item.confidence )}
                    </Tag>
                )
            },
        }, {
            delete: deleteItem,
            customs: [{
                render: item => {
                    if ( selecting && isEditing ) {
                        if ( selecting.id === item.id ) { 
                            return <a onClick={ e => { isEditing$( false ); selecting$( null )}}>取消编辑</a>
                        } else {
                            return ''
                        }
                    } else {
                        return <a onClick={ e => readyEdit( item )}>编辑</a>
                    }
                }
            }, {
                render: item => item.confidence !== 1 ?
                    <a onClick={ e => readyFix( item )}>拼音标注</a> : ''
            }]
        }), [ list, isEditing, selecting ]
    )

    useEffect(( ) => {
        fetchList( );
    }, [ query ])

    return (
        <div className=''>

            <ButtonGroup
                style={{ marginBottom: 25 }}
            >
                <Button
                    type='primary'
                    onClick={( ) => showCreate$( true )}
                >
                    添加词条
                </Button>
                {
                    !!selectedRowKeys.length && (
                        <Button
                            type='danger'
                            onClick={ deleteArray }
                        >
                            删除
                        </Button>
                    )
                }
            </ButtonGroup>

            <div 
                style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}
            >
                搜索：
                <Input 
                    value={ search }
                    style={{ width: 250 }}
                    placeholder='词条名称'
                    onChange={ e => search$( e.target.value )}
                    onKeyDown={ e => e.keyCode === 13 && fetchList( page )}
                />
            </div>

            <Table 
                rowKey='id'
                { ...listTable$ }
                loading={ list$.isLoading }
                onChange={ e => onJumpPage( e.current )}
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
   
            <Modal
                title='创建词条'
                onOk={ onCreate }
                visible={ showCreate }
                onCancel={( ) => showCreate$( false )}
            >
                <div
                    style={{ padding: '0 15px' }}
                >
                    <Input 
                        value={ val }
                        style={{ width: '100%' }}
                        onChange={ e => val$( e.target.value )}
                        placeholder='输入词条，多个词条可用空格隔开'
                    />
                </div>
            </Modal>

            <Modal
                title='拼音标注'
                width={ 650 }
                onOk={ onSurePy }
                visible={ showFix }
                onCancel={( ) => { showFix$( false ); selecting$( null )}}
            >
                {
                    !!selecting && (
                        <div
                            style={{ padding: '0 15px' }}
                        >
                            {
                                ( selecting.pinyin || [ ]).map(( pyList, k ) => {
                                    return pyList.some( wordPy => wordPy.py.length > 1 ) ?
                                        <Card
                                            key={ k }
                                            style={{ marginBottom: 20 }}
                                            title={ selecting.entry[ k ]}
                                        >
                                            {
                                                pyList.map(( wordPy, kk ) => {
                                                    return wordPy.py.length > 1 ?
                                                        <div
                                                            key={ kk }
                                                        >
                                                            <Tag
                                                                color='blue'
                                                                style={{ marginRight: 30 }}
                                                            >
                                                                { selecting.entry[ k ][ kk ]}
                                                            </Tag>
                                                            <RadioGroup
                                                                defaultValue={ wordPy.index }
                                                                onChange={ e => onAdjustPy( k, kk, e.target.value )}
                                                            >
                                                                {
                                                                    wordPy.py.map(( letterPy, kkk ) => (
                                                                        <Radio 
                                                                            key={ kkk }
                                                                            value={ kkk }
                                                                        >
                                                                            { letterPy }
                                                                        </Radio>
                                                                    ))
                                                                }
                                                            </RadioGroup>
                                                            <Divider />
                                                        </div> :
                                                        <div key={ kk }></div>
                                                })
                                            }
                                        </Card> : 
                                        <div key={ k }></div>
                                })
                            }
                        </div>
                    )
                }
            </Modal>

            <Modal
                title='添加'
                onOk={ onCreateMeta }
                visible={ showCreateMeta }
                onCancel={( ) => { showCreateMeta$( false ); selecting$( null )}}
            >
                <div
                    style={{ padding: '0 15px' }}
                >
                    <Input 
                        value={ meta }
                        placeholder='输入一个词条'
                        style={{ width: '100%' }}
                        onChange={ e => meta$( e.target.value )}
                    />
                </div>
            </Modal>
        </div>
    )
}