import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Button } from 'antd';

export const MulInput = ({ value = [ ], label = '', placeholder = '', onChane }: MulInput ) => {

    /** 把value转换成可遍历的表单元素 */
    const [ arr, arr$ ] = useState< string[ ]>([ '' ]);

    /** 创建一对表单 */
    const onCreate = ( ) => {
        const temp = [ ...arr, '' ];
        arr$( temp );
        onTrigger( temp );
    };

    /** 删除一对表单 */
    const onDelete = ( key: number ) => {
        arr.splice( key, 1 );
        const temp = [ ...arr ];
        arr$( temp )
        onTrigger( temp );
    }

    /** 设置值 */
    const onSet = ( index: number, val: string ) => {
        arr.splice( index, 1, val );
        const temp = [ ...arr ];
        arr$( temp );
        onTrigger( temp );
    }

    /** 向上 返回表单 */
    const onTrigger = ( data: any ) => {
        !!onChane && onChane( data );
    }

    useEffect(( ) => {
        value.length > 0 && arr$( value )
    }, [ value ]);

    return (
        <Row>
            {
                !!label && (
                    <Col
                        span={ 6 }
                        style={{ textAlign: 'center', color: 'rgba(0,0,0,.85)' }}
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
                            key={ key }
                            style={{ display: 'flex', alignItems: 'center', marginTop: key === 0 ? 0 : 10 }}
                        >
                            <Input 
                                value={ item }
                                placeholder={ placeholder } 
                                onChange={ e => onSet( key, e.target.value )}
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
                    style={{ marginTop: arr.length > 0 ? 15: 0, textAlign: 'right'  }}
                >
                    <Button 
                        icon="plus" 
                        size="small"
                        type="primary" 
                        shape="circle" 
                        onClick={ onCreate }
                    />
                </div>
            </Col>
        </Row>
    )
}

type MulInput = {
    label?: string,
    placeholder?: string,
    value?: string[ ],
    onChane?: ( r: string[ ]) => void
}