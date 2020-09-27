import { Card, Button, Tooltip, Tag, Modal, Divider, Icon, Radio } from 'antd';
import React, { useState, useMemo, createRef, useEffect, useImperativeHandle } from 'react';
import { NlpPtrCondition } from '../nlp-ptr-condition';
import './index.less';

const operates = {
    and: {
        value: '&&',
        label: '并且'
    },
    or: {
        value: '||',
        label: '或者'
    }
}

/** 总的可选项 */
const optMeta = {
    null: '执行子话题',
    true: '直接执行',
    conf: '规则匹配',
};

/**
 * nlp条件表单的载体，用于配置 大模块之间、小模块内部的关系
 */
export const NlpPtrConditionRel = React.forwardRef(({ defaultValue = { }, abilityId = '', types = [ ]}: NlpPtrConditionRel, ref ) => {

    /** 当前选择类型 */
    const [ selecting, selecting$ ] = useState< ConditionType | null >( null );

    /** 关系 */
    const [ rel, rel$ ] = useState< Module[ ]>([ 
        {
            type: 'module',
            children: [
                {
                    type: 'meta'
                }
            ]
        }
    ]);

    /** 添加规则 */
    const addModule = ( op: Operate ) => {

        const opItem = {
            type: 'operate',
            val: op
        };

        const moduleItem = { 
            type: 'module',
            children: [
                {
                    type: 'meta'
                }
            ]
        };

        let meta: any[ ] = [ ];

        if ( rel.length === 0 ) {
            meta = [ moduleItem ];
        } else {
            meta = [ opItem, moduleItem ];
        }

        rel$([
            ...rel,
            ...meta
        ])
    }

    /** 删除规则 */
    const delModule = ( Index: number ) => {
        Modal.confirm({
            title: '提示',
            content: '确定删除吗？',
            onOk: ( ) => {
                // 删除1个
                let temp = [ ...rel ];
                if ( temp.length === 1 ) {
                    temp = [ ];
                // 连续删除2个（模块、关系）
                } else {
                    temp.splice( Index, 1 );
                    temp.splice( Index - 1, 1 );
                }
                rel$( temp );
            }
        })
    }

    /** 添加模块内的条件 */
    const addCondition = ( mIndex: number, op: Operate ) => {
        const temp = [ ...rel ];
        let conditions = temp[ mIndex ].children || [ ];

        const opItem = {
            type: 'operate',
            val: op
        };

        const conditionItem = { 
            type: 'meta'
        };

        let meta: any[ ] = [ ];

        if ( conditions.length === 0 ) {
            meta = [ conditionItem ];
        } else {
            meta = [ opItem, conditionItem ];
        }

        conditions = [
            ...conditions,
            ...meta
        ];
        temp.splice( mIndex, 1, {
            ...temp[ mIndex ],
            children: conditions
        });
        rel$( temp );
    }

    /** 删除模块内的条件 */
    const delCondition = ( mIndex: number, cIndex: number ) => {
        Modal.confirm({
            title: '提示',
            content: '确定删除吗？',
            onOk: ( ) => {

                const temp = [ ...rel ];
                let conditions = temp[ mIndex ].children || [ ];

                if ( conditions.length === 1 ) {
                    conditions = [ ];
                } else {
                    conditions.splice( cIndex, 1 );
                    conditions.splice( cIndex - 1, 1 );
                };

                temp.splice( mIndex, 1, {
                    ...temp[ mIndex ],
                    children: conditions
                });
                rel$( temp );
            }
        })
    }

    /** 可选类型 */
    const opts$ = useMemo(( ) => {
        return types.map( t => ({
            value: t,
            label: optMeta[ t ]
        }))
    }, [ types ]);

    /** 节点的Ref */
    const conditionRefs$ = useMemo(( ) => {
        return rel.map( M => {
            let result: any[ ] = [ ];
            if ( M.type === 'module' ) {
                result = ( M.children || [ ]).map( m => m.type === 'meta' ? createRef< any >( ) : null );
            }
            return result;
        })
    }, [ rel ]);

    /** 对外暴露接口 */
    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {

            // 需要规则
            if ( selecting === 'conf' ) {
                const result = await Promise.all(
                    conditionRefs$.map( M => Promise.all(
                            M.filter( m => !!m )
                                .map( m => m.current.getData( ))
                        ))
                );
                const _data = result.map( r => r.map( c => c.data ));
                const err = result.some( r => r.some( c => !!c.err ));
    
                const innerOperator = ( MIndex: number ) => {
                    const cons = rel[ MIndex ].children || [ ];
                    return cons.length <= 2 ?
                        '' :
                        operates[( cons.find( r => r.type === 'operate') as any ).val ].value
                }
    
                // 根据规则之间、条件之间的关系，拼接数据
                const conditions = {
                    rules: _data.map(( c, k ) => {
                        return {
                            operator: innerOperator( k ),
                            variables: c
                        }
                    }).filter( x => !!x.variables.length ),
                    operator: 
                        rel.length <= 2 ? 
                            '' : 
                            operates[( rel.find( r => r.type === 'operate') as any ).val ].value
                }
    
                return {
                    err,
                    data: conditions
                }
            } else {
                return {
                    err: false,
                    data: {
                        rules: [ ],
                        operator: selecting === 'null' ? 'null' : 'true'
                    }
                }
            }
        }
    }))

    useEffect(( ) => {
        if ( !selecting ) {
            const { operator } = defaultValue;
            selecting$( 
                ( operator === 'null' || operator === 'true' ) ?
                    operator :
                    operator === null || operator === undefined ?
                        'true' :
                        'conf'
            );
        }
    }, [ types, defaultValue ]);

    useEffect(( ) => {

        if ( !Object.keys( defaultValue ).length ) return;
        console.log(`Condition-rel默认值`, defaultValue );
        
        const { operator, rules } = defaultValue
        if ( !!rules && Array.isArray( rules ) && rules.length > 0 && ( operator !== 'null' && operator !== 'true' )) {

            // 设置大模块
            let _rel: Module[ ] = [ ];
            rules.map(( r, k ) => {
                
                const moduleChildren: Inner[ ] = [ ];
                ( r.variables || [ ]).map(( v, kk ) => {
                    moduleChildren.push({
                        type: 'meta',
                        val: v
                    })
                    if ( kk !== ( r.variables || [ ]).length - 1 ) {
                        moduleChildren.push({
                            type: 'operate',
                            val: r.operator === '&&' ? 'and' : 'or'
                        })
                    }
                })

                _rel.push({
                    type: 'module',
                    children: moduleChildren
                });
                if ( k !== rules.length - 1 ) {
                    _rel.push({
                        type: 'operate',
                        val: operator === '&&' ? 'and' : 'or'
                    });
                }
            });
            rel$( _rel );
        }
    }, [ defaultValue ])

    return (
        <div className='con-nlp-ptr-condition-rel'>

            {/* 选项 */}
            <div>
                <span>执行类型：</span>
                <Radio.Group 
                    buttonStyle='solid'
                    className='opt-block'
                    value={ selecting }
                    onChange={ e => selecting$( e.target.value )}
                >
                    {
                        opts$.map(( o, k ) => (
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

            {/* 大模块渲染 */}
            {
                selecting === 'conf' && (
                    <div className='module-block'>
                        {
                            rel.map(( r, k ) => (
                                r.type === 'operate' ?
                                    <div 
                                        key={ k }
                                        className='module-tag'
                                    >
                                        <Tooltip
                                            title={`规则之间是「${operates[ r.val ].label}」关系`}
                                        >
                                            <Tag
                                                color='blue'
                                            >
                                                { operates[ r.val ].label }
                                            </Tag>
                                        </Tooltip>
                                    </div> :
                                    // 模块里面的条件列表
                                    <Card
                                        key={ k }
                                        hoverable
                                        size='small'
                                        title={`规则${ Math.floor( k / 2 ) + 1 }`}
                                        extra={<a onClick={( ) => delModule( k )}>删除</a>} 
                                        style={{ width: '100%', margin: '15px 0' }}
                                    >
                                        {
                                            ( r.children || [ ]).map(( c, kk ) => (
                                                c.type === 'operate' ?
                                                    // 条件之间的关系
                                                    <Divider 
                                                        dashed
                                                        key={ kk }
                                                    >
                                                        { c.val === 'and' ? '并且' : '或者' }
                                                    </Divider> :
                                                    // 条件组件
                                                    <div 
                                                        key={ kk }
                                                        className='condition-form'
                                                    >
                                                        <Tooltip
                                                            title='删除此条件'
                                                        >
                                                            <div
                                                                className='form-prefix'
                                                                onClick={( ) => delCondition( k, kk )}
                                                            >
                                                                <Icon 
                                                                    type='minus-circle'
                                                                />
                                                            </div>
                                                        </Tooltip>
                                                        <NlpPtrCondition 
                                                            abilityId={ abilityId }
                                                            defaultValue={ c.val || { }}
                                                            wrappedComponentRef={ conditionRefs$[ k ][ kk ]}
                                                        />
                                                    </div>
                                                    
                                            ))
                                        }
                                        {/* 条件内部的创建按钮 */}
                                        <div className='condition-btns-block'>
                                            {
                                                (( !!r.children ) && ( r.children.length === 0 || r.children.length === 1 || !!r.children.find( x => x.val === 'and' ))) && (
                                                    <Tooltip
                                                        title='添加「并且」条件' 
                                                    >
                                                        <Button 
                                                            size='small'
                                                            type='link'
                                                            shape='circle'
                                                            onClick={( ) => addCondition( k, 'and' )}
                                                        >
                                                            &
                                                        </Button>
                                                    </Tooltip>
                                                )
                                            }
                                            {
                                                (( !!r.children ) && ( r.children.length === 0 || r.children.length === 1 || !!r.children.find( x => x.val === 'or' ))) && (
                                                    <Tooltip
                                                        title='添加「或者」条件' 
                                                    >
                                                        <Button 
                                                            size='small'
                                                            type='link'
                                                            shape='circle'
                                                            onClick={( ) => addCondition( k, 'or' )}
                                                        >
                                                            ||
                                                        </Button>
                                                    </Tooltip>
                                                )
                                            }
                                        </div>
                                    </Card>
                            ))
                        }
                    </div>
                )
            }
            
            {/* 模块之间的按钮 */}
            {
                selecting === 'conf' && (
                    <div className='module-btns-block'>
                        <Button.Group>
                            {
                                ( rel.length === 0 || rel.length === 1 || !!rel.find( x => x.val === 'and' )) && (
                                    <Tooltip
                                        title='添加规则' 
                                    >
                                        <Button 
                                            icon='plus'
                                            type='primary'
                                            onClick={( ) => addModule('and')}
                                        >
                                            并且
                                        </Button>
                                    </Tooltip>
                                )
                            }
                            {
                                ( rel.length === 0 || rel.length === 1 || !!rel.find( x => x.val === 'or' )) && (
                                    <Tooltip
                                        title='添加规则'
                                    >
                                        <Button 
                                            icon='plus'
                                            type='primary'
                                            onClick={( ) => addModule('or')}
                                        >
                                            或者
                                        </Button>
                                    </Tooltip>
                                )
                            }
                        </Button.Group>
                    </div>
                )
            }
            
        </div>
    )
})

type NlpPtrConditionRel = { 
    abilityId?: any
    types?: ConditionType[ ]
    defaultValue?: any
}

type Module = {
    val?: any
    children?: Inner[ ]
    type: 'operate' | 'module'
}

type Inner = {
    val?: any
    type: 'operate' | 'meta'
}

type Operate = Partial< keyof typeof operates >
type ConditionType = Partial< keyof typeof optMeta >