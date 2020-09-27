import { v4 } from 'uuid';
import { useList } from '@cvte/ai-web-util/hooks';
import React, { useEffect, useState, useRef } from 'react';
import { Input, Row, Col, Button, Tooltip, AutoComplete } from 'antd';

/**
 * 
 * @description
 * 
 * 上下文设置
 */
export const NlpCtxSetter = ({ value = [ ], label = '', abilityId = '', showEmpty = false, placeholder, onChane }: TPMulvalueActiveForm ) => {

    /** 把json转换成可遍历的表单元素 */
    const arrRef = useRef< arrItem[ ]>([ ]);
    const [ arr, arr$ ] = useState< arrItem[ ]>([ ]);

    /** 数据源头 */
    const [ source, source$ ] = useList< string >({
        listUrl: `/t-apis/v1/nlp/dialog/context/${abilityId}`
    })

    /** 设置 */
    const setArr = data => {
        arr$( data );
        arrRef.current = data;
    }

    /** 创建一对表单 */
    const onCreate = ( ) => {
        setArr([
            ...arr, {
                key: '',
                value: '',
                id: v4( )
            }
        ]);
    };

    /** 删除一对表单 */
    const onDelete = ( key: number ) => {
        const temp = [ ...arr ];
        temp.splice( key, 1 );

        setArr([ ...temp ])
        onTrigger( );
    }

    /** 设置值 */
    const onSet = ( index: number, type: 'key' | 'value', val: any ) => {
        const meta = {
            ...arr[ index ],
            [ type ]: val
        };
        arr.splice( index, 1, meta );
        setArr([ ...arr ]);
        onTrigger( );
    }

    /** 向上 返回表单 */
    const onTrigger = ( ) => {
        !!onChane && onChane( arrRef.current );
    }

    useEffect(( ) => {
        const func = ( s, k ) => {
            
        }
        if ( !value.length ) {
            arr$([{ key: '', value: '', id: v4( )}]);
        } else {
            setArr(
                value.map( x => ({
                    ...x,
                    id: x.id || v4( )
                }))
            );
        }
    }, [ value ]);

    useEffect(( ) => {
        source$.load(``)
    }, [ ]);

    return (
        <Row>
            {
                !!label && (
                    <Col
                        span={ 6 }
                        style={{ textAlign: 'right', color: 'rgba(0,0,0,.85)' }}
                    >
                        { label }
                    </Col>
                )
            }
            <Col
                span={ !!label ? 18 : 24 }
            >
                {/* 动态表单 */}
                {
                    arr.map(( item, key ) => (
                        <div 
                            key={`${item.id}`}
                            style={{ display: 'flex', alignItems: 'center', marginTop: key === 0 ? 0 : 10 }}
                        >
                            <AutoComplete 
                                value={ item.key }
                                dataSource={ source.filter( x => !!x )}
                                style={{ width: '100%' }}
                                placeholder={( placeholder||{ }).key } 
                                onSelect={ e => onSet( key, 'key', e )}
                                onChange={ e => onSet( key, 'key', e )}
                            />
                            <div style={{ marginLeft: 10, marginRight: 10 }}>
                                =
                            </div>
                            <Input 
                                value={ item.value }
                                placeholder={( placeholder||{ }).value } 
                                onChange={ e => onSet( key, 'value', e.target.value )}

                            />
                            <div style={{ marginLeft: 10 }}>
                                <Button 
                                    size="small"
                                    icon="minus"
                                    shape="circle" 
                                    onClick={( ) => onDelete( key )}
                                />
                            </div>
                        </div>
                    ))
                }
                {/* 添加按钮 */}
                <div
                    style={{ marginTop: arr.length > 0 ? 15: 0, textAlign: 'right' }}
                >
                    <Tooltip
                        title='添加'
                    >
                        <Button 
                            icon="plus" 
                            size="small"
                            type="primary" 
                            shape="circle" 
                            onClick={ onCreate }
                        />
                    </Tooltip>
                </div>
            </Col>
        </Row>
    )
}

type TPMulvalueActiveForm = {
    abilityId: any
    label?: string
    value: arrItem[ ]
    showEmpty?: boolean
    placeholder?: {
        key: string,
        value: string
    },
    onChane?: ( r: arrItem[ ]) => void
}

type arrItem = { 
    key: string, 
    value: string, 
    id?: string 
}