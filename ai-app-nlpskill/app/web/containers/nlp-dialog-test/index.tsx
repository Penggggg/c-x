import { v4 } from 'uuid';
import { http } from '@cvte/ai-web-util/util';
import { Drawer, Button, Input, Tooltip, Divider, notification } from 'antd';
import React, { useState, useEffect, ReactNode, useRef, useMemo } from 'react';
import { NlpDialogAdjust, NlpChat } from '../index';
import './index.less';

/**
 * 
 * @description
 * nlp对话测试
 */
export const NlpDialogTest = ({ show = false, abilityId = '', robotPrefix = '', onClose }: NlpDialogTest ) => {
    
    /** 列表滚动 */
    const [ scrollTop, scrollTop$ ] = useState( 0 );

    /** 用户输入 */
    const [ input, input$ ] = useState('');

    /** 聊天记录 */
    const recordsRef = useRef< ChatMeta[ ]>([ ]);
    const [ records, records$ ] = useState< ChatMeta[ ]>([ ]);

    /** 服务器返回的记录 */
    const serverRecordRef = useRef< any[ ]>([ ]);
    const [ serverRecord, serverRecord$ ] = useState< any[ ]>([ ]);

    /** 当前对话session */
    const [ curSession, curSession$ ] = useState('');

    /** 设置聊天记录 */
    const setRecords = r => {
        records$( r );
        recordsRef.current = r;
    }

    /** 设置聊天记录 */
    const setServerRecords = r => {
        serverRecord$( r );
        serverRecordRef.current = r;
    }

    /** 发送对话 */
    const sendContent = ( user_input, sessionId? ) => new Promise( r => {

        let meta: any = {
            user_input,
            session_id: sessionId || curSession
        };

        const serverRecords = serverRecordRef.current;
        if ( !!serverRecords.length && !!user_input ) {
            meta = {
                ...meta,
                nlp_runtime: serverRecords[ serverRecords.length - 1 ].nlp_runtime
            }
        }

        /** 异常处理 */
        const fixErr = ( ) => {
            const temp = [ ...recordsRef.current ];
            const Index = temp.findIndex( x => x.status === ChatStatus.sending );
            if ( Index !== -1 ) {
                temp.splice( Index, 1, {
                    ...temp[ Index ],
                    status: ChatStatus.fail
                })
                setRecords([ ...temp ])
            }
        }

        const tips = description => {
            notification.info({
                message: '提示',
                description
            });
        }

        http.post< any >({
            data: meta,
            errorTips: false,
            url: `/t-apis/v1/nlp/version/testnlp/${abilityId}`,
        }).then(({ status, data, message, msg }) => {
            const _s = Number( status );
            if ( status !== 200 ) {
                // 按状态码输出
                if ( _s === 55001 ) {
                    tips('正在训练')
                } else if ( _s === 55001 ) {
                    tips('请先进行训练')
                } else {
                    tips( message || msg )
                }
                return fixErr( );
            };

            const { output, nlu } = data;
            const temp = [ ...recordsRef.current ];
            // 处理客户端的输入
            const _intent = (( nlu || { }).intents || [ ])[ 0 ];
            const Index = temp.findIndex( x => x.status === ChatStatus.sending );

            if ( Index !== -1 ) {
                temp.splice( Index, 1, {
                    ...temp[ Index ],
                    status: ChatStatus.ok,
                    nluIntent: !!_intent ? {
                        ..._intent
                    } : null
                })
            }

            if ( !user_input ) { // 系统对话、提示
                temp.push({
                    content: '以下为新一轮对话',
                    type: ChatType.system,
                });
            }
            
            // 处理服务端的返回
            temp.push({
                output,
                meta: data,
                type: ChatType.server,
            });

            setRecords( temp );
            setServerRecords([
                ...serverRecords,
                data
            ])

        // 异常处理
        }).catch( e => fixErr( ))
    })

    /** 发送新的内容 */
    const readySend = ( content = '' ) => {
        if (( !content && !input.trim( )) || sending$ ) return;
        setRecords([
            ...records,
            {
                type: ChatType.client,
                content: content || input,
                status: ChatStatus.sending
            }
        ]);
        sendContent( content || input );
        input$('');
    }

    /** 根据show_type组装内容 */
    const setUpShowType = ( outputItem: any ) => {
        const { show_type, content } = outputItem;
        if ( show_type === 'text' ) {
            return (
                <div>
                    <p>
                        【文字】.
                    </p><br />
                    <pre
                        style={{ width: '100%', whiteSpace: 'pre-line' }}
                    >
                        { content.text }
                    </pre>
                </div>
            )
        } else if ( show_type === 'option' || show_type === 'my_option' ) {
            return (
                <div>
                    <p>
                        【选项】
                    </p><br />
                    <p>{ content.title || content.description }</p><br />
                    {
                        (content.my_option || [ ]).map(( x, k ) => (
                            <p
                                key={ k }
                                onClick={( ) => sendOpt( x.label )}
                            >
                                <Button 
                                    type='link'
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        whiteSpace: 'normal'
                                    }}
                                >
                                    { x.label }
                                </Button>
                            </p>
                        ))
                    }
                </div>
            )
        } else if ( show_type === 'rich_text' ) {
            return (
                <div>
                    <p>
                        【富文本】
                    </p><br />
                    <div
                        dangerouslySetInnerHTML={{ __html: content.text || '' }}
                    >
                    </div>
                </div>
            )
        } else if ( show_type === 'image' ) {
            return (
                <div>
                    <p>
                        【图片】
                    </p><br />
                    <img src={ content.url } />
                </div>
            )
        } else if ( show_type === 'intent' ) {
            return (
                <div>
                    <p>
                        【意图默认回复】
                    </p><br />
                    <p>{ content.text }</p>
                </div>
            )
        } else if ( show_type === 'pause' ) {
            return (
                <div>
                    <p>
                        【暂停 { content.duration }ms】
                    </p><br />
                    <p>{ content.tips }</p>
                </div>
            )
        } else if ( show_type === 'human_agent') {
            return (
                <div>
                    <p>
                        【人工客服 - { content.get_log ? '' : '不' }携带聊天记录】
                    </p><br />
                    <p>{ content.text }</p>
                    <p>{ content.url }</p>
                </div>
            )
        }
        return <div></div>
    }

    /** 重置对话 */
    const resetDialog = ( ) => {
        const sessionId = `dialog_${v4( )}`
        curSession$( sessionId );
        sendContent( '', sessionId );
    }

    /** 单纯变更意图对话配置 */
    const resetConf = ( ) => {
        return http.post({
            successMsg: '更新成功',
            url: `/t-apis/v1/nlp/version/flowconfig/${abilityId}/0`
        }).then(({ status }) => {
            return status === 200;
        })
    }

    /** 发送选项里面的内容 */
    const sendOpt = val => {
        readySend( val )
    }

    /** 聊天框 */
    const chats$: Chat[ ] = useMemo(( ) => {
        const result: Chat[ ] = [ ];
        records.map( r => {
            // 客户端
            if ( r.type === ChatType.client ) {
                if ( !r.nluIntent ) {
                    result.push({
                        pos: 'right',
                        content: r.content
                    })
                } else {
                    result.push({
                        pos: 'right',
                        content: (
                            <NlpDialogAdjust 
                                content={ r.content }
                                abilityId={ abilityId }
                                intentScore={ r.nluIntent.confidence }
                                intent={ r.nluIntent.intent }
                            />
                        )
                    })
                }

            // 服务端
            } else if ( r.type === ChatType.server ) { // 服务端
                if ( !!r.output ) {
                    r.output.map( x => {
                        const content = setUpShowType( x );
                        result.push({
                            pos: 'left',
                            content,
                            meta: r.meta
                        })
                    })
                }
            } else if ( r.type === ChatType.system ) { // 系统提示
                result.push({
                    pos: 'center',
                    content: (
                        <Divider>
                            { r.content }
                        </Divider>
                    )
                })
            }
        })
        return result;
    }, [ records ]);

    /** 每次打开对话框 */
    useEffect(( ) => {
        ( !!show && !curSession ) && resetDialog( );
    }, [ show ]);

    /** 聊天记录滚动到最下方 */
    useEffect(( ) => {
        scrollTop$( 999999 );
    }, [ chats$ ]);

    /** 是否有发送中的语句 */
    const sending$ = useMemo(( ) => {
        return records.find( x => x.status === ChatStatus.sending );
    }, [ records ]);

    return (
        <div className='con-nlp-dialog-test'>
            
            <Drawer
                width={ 450 }
                title='对话测试'
                visible={ show }
                onClose={( ) => !!onClose && onClose( )}
            >
                <div className='con-nlp-dialog-con'>

                    {/* 功能按钮 */}
                    <div className="action-block">
                        <Button 
                            type='link'
                            onClick={ resetDialog }
                        >
                            重置对话
                        </Button>
                        <Button 
                            type='link'
                            onClick={ resetConf }
                        >
                            更新对话配置
                        </Button>
                    </div>

                    {/* 聊天框 */}
                    <NlpChat 
                        chats={ chats$ }
                        showMeta={ true }
                        scrollTop={ scrollTop }
                    />

                    {/* 用户输入 */}
                    <div className='input-block'>
                        <Input
                            value={ input }
                            className='user-input'
                            onChange={ e => input$( e.target.value )}
                            onKeyDown={ e => e.keyCode === 13 && readySend( )}
                        />
                        <Button
                            type='primary'
                            icon='arrow-right'
                            onClick={( ) => readySend( )}
                        >
                            发送
                        </Button>
                    </div>

                </div>
            </Drawer>
        </div>
    )
}

type NlpDialogTest = {
    /** 是否展开 */
    show?: boolean
    abilityId?: any
    /** 机器人id前缀 */
    robotPrefix?: string,
    /** 取消 */
    onClose?: ( ) => void
}

type Chat = {
    content?: string | ReactNode
    session_id?: string
    pos: 'left' | 'right' | 'center',
    time?: any,
    meta?: any
}

type ChatMeta = {
    /** 客户端 */
    status?: ChatStatus
    nluIntent?: {
        intent: string,
        confidence: number
    } 
    /** 服务器 */
    output?: any[ ]
    /** 公共类型 */
    meta?: any
    type: ChatType
    content?: string
}

enum ChatStatus {
    sending,
    ok,
    fail
}

enum ChatType {
    client,
    server,
    system
}