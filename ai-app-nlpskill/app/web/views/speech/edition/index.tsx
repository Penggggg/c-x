import { Table, Tag, Modal, Input } from 'antd';
import { createColumns, http } from '@cvte/ai-web-util/util';
import React, { useEffect, useState, useMemo } from 'react';
import { useQuery, useFetch } from '@cvte/ai-web-util/hooks'
import { transferTime2CN } from '../../../util/time';
import { findDicCN } from '../../../util/dic';

/**
 * 
 * @description
 * 语音识别 - 版本
 */
export const SpeechEdition = ( ) => {

    const pageSize = 10;
    const [ query ] = useQuery( );
    const [ list, list$ ] = useFetch({
        url: `/t-apis/v1/voice/version`
    });

    const [ page, page$ ] = useState( 1 );
    const [ saveVal, saveVal$ ] = useState('');
    const [ showSave, showSave$ ] = useState( false );
    const [ selectedRowKeys, selectedRowKeys$ ] = useState< any[ ]>([ ]);

    /** 获取列表 */
    const fetchList = ( page = 1 ) => {
        const { abilityId } = query;
        !!abilityId && list$.load(`?ability_id=${abilityId}&page_size=${pageSize}&page_index=${page}`)
    }

    /** 跳页 */
    const onJumpPage = p => {
        page$( p );
        fetchList( p );
    }

    /** 版本保存 */
    const onSaveVersion = ( ) => {
        http.post< any >({
            data: {
                description: saveVal,
                ability_id: query.abilityId
            },
            successMsg: '创建成功',
            url: `/t-apis/v1/voice/version`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            saveVal$('');
            showSave$( false );
            fetchList( page );
        })
    }

    /** 回滚配置 */
    const onRollback = version_id => {
        Modal.confirm({
            title: '提示',
            content: '确定回滚吗？',
            onOk: ( ) => {
                http.post< any >({
                    data: {
                        version_id
                    },
                    successMsg: '回滚成功',
                    url: `/t-apis/v1/voice/version/rollback`
                }).then(({ status }) => {
                    if ( status !== 200 ) return;
                    fetchList( page );
                });
            }
        })
    }

    const listTable$ = useMemo(
        ( ) => createColumns(( list.page || [ ]), ( list.page || [ ])[ 0 ], {
            version_name: {
                title: '版本号',
                fixed: 'left',
                width: 180,
                render: item => (
                    <a>{ item.version_name }</a>
                )
            },
            version_type: {
                title: '版本类型',
                render: item => (
                    <span>{ findDicCN( 'speech.version.type', item.version_type )}</span>
                )
            },
            states: {
                title: '状态',
                render: item => (
                    <Tag 
                        color={ 
                            item.states === 3 ? 
                                'blue' :
                                ( item.states === -2 || item.states === 0 || item.states === 1 || item.states === 2 ) ?
                                    'cyan' :
                                    'red'
                        }
                    >
                        { findDicCN( 'speech.version.states', item.states )}
                    </Tag>
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
            customs: [{
                render: item => (
                    item.version_type === 0 ?
                        <a onClick={ e => showSave$( true )}>版本保存</a> : ''
                )
            }, {
                render: item => (
                    item.version_type === 1 ?
                        <a onClick={ e => onRollback( item.id )}>回滚配置</a> : ''
                )
            }]
        }), [ list ]
    );

    useEffect(( ) => {
        fetchList( );
    }, [ query ])

    return (
        <div>

            <Table 
                rowKey='id'
                { ...listTable$ }
                scroll={{ x: 1500, y: 550 }}
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
                title='版本保存'
                visible={ showSave }
                onOk={ onSaveVersion }
                onCancel={( ) => showSave$( false )}
            >
                <div style={{ padding: '0 25px' }}>
                    <Input 
                        value={ saveVal }
                        placeholder='请输入备注'
                        style={{ width: '100%' }}
                        onChange={ e => saveVal$( e.target.value )}
                    />
                </div>
            </Modal>

        </div>
    )
}