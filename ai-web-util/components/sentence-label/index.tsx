import { http } from '../../util';
import React, { useEffect, useState } from 'react';
import { Popover, Button, Tooltip, Radio } from 'antd';
import './index.less';

/**
 * 
 *  @description
 * 
 *  句子的标注，功能如下：
 * 
 *  1、标注
    2、拆词（调接口）
    3、组词（前端实现）
    4、返回结果 ${label.value}
    5、解析&反解析

    结构： [{ index: number, word: 'value', label: 'label' }] <=> '${label.value}xxyy,${label.value}zzpp'
 */
export const SentenceLabel = ({ value = '', splitUrl, mode, popTitle = '操作', labels = [ ], onChange }: SentenceLabel ) => {

    const [ words, words$ ] = useState< wordMeta[ ]>([ ])
    const [ selecting, selecting$ ] = useState< null | number >( null ); // 下标

    /** 调分词接口 */
    const splitSentence = ( text, label ) => {
        if ( !splitUrl ) return;
        http.post< any >({
            data: {
                text,
                label
            },
            url: splitUrl
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            let ptr = 0;
            const res: wordMeta[ ] = [ ];
            data.map( w => {
                res.push({
                    index: ptr,
                    word: w.word,
                    label: w.attribute || undefined
                });
                ptr += w.word.length;
            })
            words$( res );
        })
    }

    /** 切词 */
    const splitWord = Index => {
        let ptr = words[ Index ].index;
        const splitArr = words[ Index ].word.split('').map( word => ({
            word,
            index: ptr++,
            label: undefined // 若有标注则取消
        }))
        words$([
            ...words.slice( 0, Index ),
            ...splitArr,
            ...words.slice( Index + 1 )
        ])
    }

    /** 解析带有标注信息的字符串 */
    const analys = s => {
        let ptr = 0;
        let res: wordMeta[ ] = [ ];

        while ( s.length ) {
            if ( !s.includes('${')) { // 特殊情况
                res.push({
                    index: ptr,
                    word: s
                });
                s = ''
            }
            const Index = s.indexOf('${');
            if ( s.startsWith('${')) { // 开始解析

                const End = s.indexOf('}');
                const meta = s.substring( 0, End + 1 ).slice( 2, -1 );
                const [ label, word ] = meta.split('.');
                res.push({
                    word,
                    label,
                    index: ptr,
                });
                ptr += word.length;
                s = s.slice( End + 1 );

            } else if ( !!s ) { // 普通文字
                res.push({
                    index: ptr,
                    word: s.substring( 0, Index )
                });
                ptr += Index;
                s = s.slice( Index );
            }
        }

        return res;
    }

    /** 点击某个词 */
    const onClickWord = Index => {
        if ( selecting === null ) { // 勾选第一个
            selecting$( Index );

        } else if ( Index === selecting ) { // 取消勾选
            selecting$( null );
            
        } else if (( Index !== selecting + 1 ) && ( Index !== selecting -1 )) { // 非相邻
            selecting$( null );

        } else { // 组合相邻词
            const start = selecting < Index ? selecting : Index;
            const compose = {
                label: undefined,
                index: words[ start ].index,
                word: words[ start ].word +  words[ start + 1 ].word
            }
            const temp = [ ...words ];
            temp.splice( start + 1, 1 );
            temp.splice( start, 1, compose );

            words$( temp )
            selecting$( null );
        }
    }

    /** 标注 */
    const onLabel = ( Index, val ) => {
        const temp = [ ...words ];
        const target = temp[ Index ];
        temp.splice( Index, 1, {
            ...target,
            label: val
        })
        words$( temp );
    }

    useEffect(( ) => {
        if ( !words.length ) return;
        const temp = words.map( x => {
            const labelItem = labels.find( y => y.value === x.label );
            return {
                ...x,
                label: labelItem ? labelItem.label : undefined
            }
        })
        const str = temp.reduce(( p, c ) => {
            return `${p}${c.label !== undefined ? '${' + c.label + '.' + c.word + '}' : c.word }`
        }, '' );
        !!onChange && onChange({
            str,
            words: temp,
        })
    }, [ words ]);

    useEffect(( ) => {
        if ( !value.includes('${')) { // 直接调用
            splitSentence( value, [ ]);
        } else { // 进行解析
            const temp = analys( value );
            const str = temp.reduce(( p, c ) => p + c.word, '' );
            const label = temp.filter( x => !!x.label )
                .map( x => ({
                    type: 'dic',
                    word: x.word,
                    attribute: x.label,
                    position: x.index + 1 // 接口的position从1开始
                }));
            splitSentence( str, label )
        }
    }, [ value ]);

    return (
        <div className='com-sentence-label'>
            {
                mode === 'edit' && (
                    <span>
                        {
                            words.map(( w, k ) => (
                                <Popover
                                    key={ k }
                                    title={ popTitle }
                                    content={(
                                        <div>
                                            <div
                                                style={{ padding: '0 10px' }}
                                            >
                                                <Radio.Group
                                                    value={ w.label }
                                                    onChange={ e => onLabel( k, e.target.value )}
                                                >
                                                    {
                                                        labels.map(( l, k ) => (
                                                            <Radio
                                                                key={ k }
                                                                value={ l.value }
                                                                style={{ display: 'block', height: '30px', lineHeight: '30px' }}
                                                            >
                                                                { l.label }
                                                            </Radio>
                                                        ))
                                                    }
                                                </Radio.Group>
                                            </div>
                                            <div
                                                style={{ textAlign: 'right', marginTop: 20 }}
                                            >
                                                {
                                                    w.word.length > 1 && (
                                                        <Tooltip
                                                            title='把该词切成一个个字'
                                                        >
                                                            <Button 
                                                                size='small'
                                                                type='primary'
                                                                onClick={ e => splitWord( k )}
                                                            >
                                                                切词
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                                {
                                                    w.label !== undefined && (
                                                        <Tooltip
                                                            title='移除标注'
                                                        >
                                                            <Button 
                                                                size='small'
                                                                type='primary'
                                                                style={{ marginLeft: 10 }}
                                                                onClick={ e => onLabel( k, undefined )}
                                                            >
                                                                取消
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )}
                                >
                                    <span 
                                        onClick={ e => onClickWord( k )}
                                        className={`word-meta ${ selecting === k ? 'selecing' : ''}`}
                                    >
                                        [ { w.word } ]
                                    </span>
                                </Popover>
                            ))
                        }
                    </span>
                )
            }
            {
                mode === 'read' && (
                    <span>
                        {
                            words.map(( w, k ) => (
                                w.label ? 
                                    <Tooltip
                                        key={ k }
                                        title={ w.label }
                                    >
                                        <span className='word-label'>{ w.word }</span>
                                    </Tooltip> :
                                    <span
                                        key={ k }
                                    >
                                        { w.word }
                                    </span>
                                    
                            ))
                        }
                    </span>
                )
            }
        </div>
    )
}

type SentenceLabel = {
    value?: string
    popTitle?: string
    splitUrl?: string // 拆词api
    mode: 'read' | 'edit' // 模式：只看、编辑
    labels?: {
        label: string,
        value: string
    }[ ] // 标注标签
    onChange?: ( data: { words: wordMeta[ ], str: string }) => void
}

type wordMeta = {
    index: number,
    word: string,
    label?: any
}