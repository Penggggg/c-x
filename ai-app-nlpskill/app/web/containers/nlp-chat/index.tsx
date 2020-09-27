import { Card, Modal, Icon, Tooltip } from 'antd';
import React, { useRef, useEffect, ReactNode, useState } from 'react';
import ReactJson from 'react-json-view'
import './index.less';

export const NlpChat = ({ chats = [ ], scrollTop, showMeta = false }: NlpChat ) => {

    /** 列表 */
    const listRef = useRef< any >( null );

    const [ showJSON, showJSON$ ] = useState( false );

    const [ selecting, selecting$ ] = useState< any >( null );

    const onSelect = chat => {
        showJSON$( true );
        selecting$( chat );
    }

    useEffect(( ) => {
        const ele = listRef.current;
        if ( scrollTop !== undefined ) {
            if ( !!ele ) {
                ele.scrollTop = 999999
            }
        }
    }, [ scrollTop, chats ])

    return (
        <div>
            <Card 
                className='con-nlp-chat'
            >
                <div
                    ref={ listRef }
                    className='chat-list-con'
                >
                    <div
                        className='chat-list'
                    >
                        {
                            chats.map(( r, k ) => (
                                <div
                                    key={ k }
                                    className={`chat-line ${r.pos}`}
                                >
                                    <div
                                        className='chat-item'
                                    >
                                        {/* 传进来的 */}
                                        { r.content }

                                        {/* 操作按钮 */}
                                        <div className='action'>
                                            {
                                                ( showMeta && !!r.meta ) && (
                                                    <Tooltip
                                                        title='查看JSON'
                                                    >
                                                        <Icon 
                                                            type="info-circle" 
                                                            onClick={( ) => onSelect( r )}
                                                            style={{ color: '#40a9ff', fontSize: 16 }}
                                                        />
                                                    </Tooltip>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Card>

            <Modal
                title='JSON数据'
                visible={ showJSON }
                onOk={( ) => showJSON$( false )}
                onCancel={( ) => showJSON$( false )}
            >
                {
                    !!selecting && (
                        <ReactJson 
                            src={ selecting.meta || { }} 
                        />
                    )
                }
            </Modal>
        </div>
    )
}

type NlpChat = {
    chats?: Chat[ ]
    scrollTop?: number
    showMeta?: boolean
}

type Chat = {
    content?: string | ReactNode
    pos: 'left' | 'right' | 'center',
    time?: any,
    meta?: any
}