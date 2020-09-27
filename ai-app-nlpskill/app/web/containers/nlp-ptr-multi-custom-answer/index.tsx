import { Radio, Card, Button, Tooltip, Input } from 'antd';
import React, { useState, useMemo, useEffect } from 'react';
import { MulInput, MulvalueActiveForm } from '@cvte/ai-web-util/components';
import './index.less';

/** 总的可选项 */
const optMeta = {
    text: '文本',
    image: '图片',
    my_option: '选项'
};

export const NlpPtrMulCustomAnswer = React.forwardRef(({ types = [ ], type = undefined, value = undefined, onChange }: NlpPtrMulCustomAnswer, ref ) => {

    /** 当前选择类型 */
    const [ selecting, selecting$ ] = useState< Opt | null >( null );

    /** 文本 */
    const [ txtList, txtList$ ] = useState< any[ ]>([ ]);

    /** 选项标题 */
    const [ optTitles, optTitles$ ] = useState< string[ ]>(['']);

    /** 选项 */
    const [ opts, opts$ ] = useState<{ key: string, value: string }[ ][ ]>([[ ]]);

    /** 图片 */
    const [ imgs, imgs$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 输入更改 */
    const _onChange = ( type: Opt | 'title' | undefined , val: any, broadcast = true ) => {
        let data = val;
        if ( !type ) return;
        if ( type === 'text' ) {
            txtList$( val );
        } else if ( type === 'image' ) {
            imgs$( val );
        } else if ( type === 'title' ) {
            optTitles$( val );
            data = val.map(( t, k ) => ({
                title: t,
                options: opts[ k ]
            }))
        } else if ( type === 'my_option' ) {
            opts$( val );
            data = val.map(( v, k ) => ({
                title: optTitles[ k ],
                options: v
            }))
        }
        ( !!broadcast && !!onChange ) && onChange({ type: type === 'title' ? 'my_option' : type, data })
    }

    /** 更改选项 */
    const onChangeOpt = ( Index, val ) => {
        const temp = [ ...opts ];
        temp.splice( Index, 1, val );
        _onChange( 'my_option', temp );
    }

    /** 更改选项的标题 */
    const onChangeOptTitle = ( Index, val ) => {
        const temp = [ ...optTitles ];
        temp.splice( Index, 1, val );
        _onChange( 'title', temp );
    } 

    /** 切换类型 */
    const onSelectType = ( type: Opt ) => {
        selecting$( type );
        let data: any[ ] = [ ];
        if ( type === 'text' ) {
            data = txtList;
        } else if ( type === 'image' ) {
            data = imgs;
        } else if ( type === 'my_option' ) {
            data = opts.map(( v, k ) => ({
                title: optTitles[ k ],
                options: v
            }))
        }
        !!onChange && onChange({ type, data })
    }

    /** 删除某个大选项 */
    const delOpt = Index => {
        const temp = [ ...opts ];
        temp.splice( Index, 1 );
        opts$( temp );
        _onChange( 'my_option', temp );
    }

    /** 增加某大选项 */
    const addOpt = ( ) => {
        const temp = [ ...opts, [ ]];
        opts$( temp );
        _onChange( 'my_option', temp );
    }

    /** 类型选项 */
    const type$ = useMemo(( ) => {
        return types.map( t => ({
            value: t,
            label: optMeta[ t ]
        }))
    }, [ types ]);

    useEffect(( ) => {
        selecting$( type || types[ 0 ]);
        if ( !!value ) {
            if ( type === 'image' ) {
                imgs$( value );
            } else if ( type === 'text' ) {
                txtList$( value );
            } else if ( type === 'my_option' ) {
                opts$( value.map( x => x.options ));
                optTitles$( value.map( x => x.title ));
            }
        }
    }, [ type, types, value ]);

    return (
        <div className='con-nlp-ptr-mul-custom-answer'>

            {/* 选项 */}
            <div>
                <div className='opt-con'>
                    <Radio.Group 
                        buttonStyle='solid'
                        className='opt-block'
                        value={ selecting }
                        onChange={ e => onSelectType( e.target.value )}
                    >
                        {
                            type$.map(( o, k ) => (
                                <Radio.Button 
                                    key={ k }
                                    value={ o.value }
                                >
                                    { o.label }
                                </Radio.Button>
                            ))
                        }
                    </Radio.Group>
                </div>
            </div>

            {/* 文本 */}
            {
                selecting === 'text' && (
                    <MulInput 
                        value={ txtList }
                        onChane={ e => _onChange( 'text', e )}
                    />
                )
            }

            {/* 选项 */}
            {
                selecting === 'my_option' && (
                    <div>
                        {
                            opts.map(( o, k ) => (
                                <Card
                                    key={ k }
                                    hoverable
                                    size='small'
                                    title={`选项 - ${ k + 1 }`}
                                    extra={<a onClick={( ) => delOpt( k )}>删除</a>} 
                                    style={{ width: '100%', margin: '25px 0' }}
                                >
                                    <Input 
                                        value={ optTitles[ k ]}
                                        style={{ marginBottom: 10 }}
                                        onChange={ e => onChangeOptTitle( k, e.target.value )}
                                        placeholder='请输入选项问题'
                                    />
                                    <MulvalueActiveForm
                                        showEmpty
                                        value={ o }
                                        onChane={ e => onChangeOpt( k, e )}
                                        placeholder={{
                                            key: '选项的描述',
                                            value: '选项的值 英文/数字'
                                        }}
                                    />
                                </Card>
                            ))
                        }
                        <div className='opt-group-btn'>
                            <Tooltip
                                title='再添加一组选项'
                            >
                                <Button 
                                    icon='plus'
                                    type='primary'
                                    onClick={ addOpt }
                                >
                                    选项组
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                )
            }

            {
                selecting === 'image' && (
                    <MulvalueActiveForm
                        showEmpty
                        value={ imgs }
                        onChane={ e => _onChange( 'image', e )}
                        placeholder={{
                            key: '图片标题',
                            value: '图片Url'
                        }}
                    />
                )
            }

        </div>
    )
})

type NlpPtrMulCustomAnswer = {
    type?: Opt,
    types?: Opt[ ],
    value?: any[ ]
    onChange?: ( r: { type: Opt, data: any[ ]}) => void
}

type Opt = Partial< keyof typeof optMeta >