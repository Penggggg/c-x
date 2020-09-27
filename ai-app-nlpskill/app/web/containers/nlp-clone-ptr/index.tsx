import { http } from '@cvte/ai-web-util/util';
import React, { useState, useMemo, useEffect } from 'react';
import { Button, Tooltip, Modal, TreeSelect, Tree, Select } from 'antd';
import { showContent } from '../../util/nlp';
import './index.less';

const { TreeNode } = Tree;
const { OptGroup, Option } = Select;
/**
 * 
 * @description
 * 
 * 复制节点功能
 */
export const NlpClonePtr = ({ abilityId = '', stepType, targetId, onOK }: NlpClonePtr ) => {

    const [ show, show$ ] = useState( false );

    /** 树选择器的值 */
    const [ val, val$ ] = useState< any >( null );

    /** 节点值 */
    const [ ptr, ptr$ ] = useState< any >( null );

    /** 节点 */
    const [ nodes, nodes$ ] = useState< Ptr[ ]>([ ]);

    /** 流程 */
    const [ flow, flow$ ] = useState< Ptr[ ]>([ ]);

    /** 加载话题节点列表 */
    const fetchNodes = ( parentId = '' ) => {
        return http.get< Ptr[ ]>({
            url: `/t-apis/v1/nlp/dialog/frame/${abilityId}?parent_id=${parentId}`
        }).then(({ data, status }) => {
            if ( status !== 200 ) return;
            nodes$([ ...nodes, ...data ]); 
            if ( !parentId ) {
                nodes$( data ); 
            } else { // 这里要检查，是否有重复项
                const parent = [ ...nodes ].find( x => x.node_id === parentId );
                const others = [ ...nodes ].filter( x => x.parent_id !== parentId && x.node_id !== parentId );
                const temp = [ ...others, ...data ];
                if ( !!parent ) {
                    temp.push({
                        ...parent,
                        children_count: data.length
                    })
                }
                nodes$( temp );
            }
        })
    }

    /** 加载话题下的流程 */
    const fetchFlow = node_id => {
        if ( !node_id ) return;
        http.get< Ptr[ ]>({
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}/flow_config`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            flow$( data );
        })
    }

    /** 生成 antd-tree */
    const renderTreeNodes = ( data: Ptr[ ]) => {
        return data.map( p => (
            <TreeNode 
                dataRef={ p }
                key={ p.node_id }
                value={ p.node_id }
                isLeaf={ p.isLeaf }
                title={ p.node_name } 
                disabled={ p.disabled }
            >
                { renderTreeNodes( p.children || [ ])}
            </TreeNode>         
        ))
    };

    /** 树的异步加载 */
    const onLoadData = ( node: any ) => new Promise< any >( r => {
        const { children, children_count, node_id } = ( node.props.dataRef as Ptr );
        if ( !children_count || ( !!children_count && ( !!children && !!children.length )))  {
            r( );
            return;
        }
        fetchNodes( node_id )
            .then( r );
    })

    /** 确认 */
    const onSure = ( ) => {
        if ( !ptr ) return;
        http.post({
            data: {
                target_id: targetId,
                step_type: stepType
            },
            successMsg: '复制成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${ptr}/copy`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            ptr$( null );
            show$( false );
            !!onOK && onOK( );
        })
    }

    /** 话题树 */
    const tree$ = useMemo< any[ ]>(( ) => {
        
        const startNode = nodes.find( x => x.node_type === PtrType.start );
        const tree: Ptr[ ] = startNode ? [ startNode ] : [ ];

        /** 查找兄弟节点 */
        const findSiblings = ( node?: Ptr ) => {
            if ( !node ) return [ ];
            const train = [ node ];
            const find = ( n: Ptr ) => {
                const next = nodes.find( x => x.previous_sibling === n.node_id );
                if ( !!next ) {
                    train.push( next );
                    // 递归
                    find( next )
                }
            }
            find( train[ 0 ]);
            return train
        }

        /** 构建树 */
        const buildChild = ( level: Ptr[ ]) => {
            level.map( node => {

                // 找到这个node下的第一个子节点
                const firstChild = nodes.find( x => x.parent_id === node.node_id && !x.previous_sibling );

                // 按关系链 查找所有子节点
                const children = findSiblings( firstChild );
                node.key = node.node_id;
                node.children = children; // 仅用于展示的
                node.isLeaf = !node.children_count; // 根据后台数据，判断是否为叶子节点
                node.disabled = node.node_type === PtrType.start;

                // 递归
                buildChild( children );
            });
        }

        buildChild( tree );

        return tree;
    }, [ nodes ]);

    /** 准备答复 */
    const ready$ = useMemo< Ptr[ ]>(( ) => {
        const start = flow.find( x => x.step_type === StepType.start );
        if ( !start  ) return [ ];

        const _ready = flow.filter( x => x.step_type === StepType.ready_response );
        const head = _ready.find( x => x.previous_sibling === start.node_id )
        if ( !head  ) return [ ];

        // 构建链表（顺序）
        const link = arr => {
            const last = arr[ arr.length -1 ];
            if ( !last ) return arr;
            const next = _ready.find( x => x.previous_sibling === last.node_id );
            if ( !next ) return arr;
            return link([ ...arr, next ]);
        }
    
        const res = link([ head ]);
        return res; 
    }, [ flow ]);

    /** 执行答复 */
    const exec$ = useMemo< Ptr[ ]>(( ) => {
        const start = flow.find( x => x.step_type === StepType.start );
        if ( !start  ) return [ ];

        const readLast = ready$[ ready$.length - 1 ];
        const head = flow.find( x => {
            if ( !!readLast ) {
                return x.previous_sibling === readLast.node_id;
            } else {
                return x.previous_sibling === start.node_id;
            }
        })
        if ( !head  ) return [ ];

        const _exec = flow.filter( x => x.step_type === StepType.exec_response );

        // 构建链表（顺序）
        const link = arr => {
            const last = arr[ arr.length -1 ];
            if ( !last ) return arr;
            const next = _exec.find( x => x.previous_sibling === last.node_id );
            if ( !next ) return arr;
            return link([ ...arr, next ]);
        }
    
        const res = link([ head ]);
        return res; 
    }, [ flow, ready$ ]);

    const opts$ = useMemo(( ) => {

        /** 展示slot里面内容 */
        const showSlot = ptr => {
            if ( !ptr.slot_context ) return ptr.node_name;
            const { entity_name, slot_name, context_slot_name } = ptr.slot_context;
            return `${ ptr.node_name } ${ entity_name } ${ slot_name || '' } ${ context_slot_name }`
        };

        /** 展示API里面内容 */
        const showResource = ptr => {
            if ( !ptr.config_info ) return ptr.node_name;
            const { url, request_method } = ptr.config_info;
            return `${ ptr.node_name } ${ request_method } ${ url || ''}`
        };

        const _ready = ready$.map( p => ({
            value: p.node_id,
            label: p.node_type === PtrType.resource ? showResource( p ) : showSlot( p )
        }));

        const _exec = exec$.map( p => ({
            value: p.node_id,
            label: p.node_name + ' ' + showContent( p.output )
        }));

        return stepType === 'exec_response' ? 
            [{
                label: '执行答复',
                children: _exec
            }] : 
            [{
                label: '准备答复',
                children: _ready
            }]
    }, [ ready$, exec$ ])

    useEffect(( ) => {
        ptr$( null );
        fetchFlow( val );
    }, [ val ]);

    useEffect(( ) => {
        fetchNodes( );
    }, [ ]);

    return (
        <div className='con-nlp-clone-ptr'>
            <Tooltip 
                title='从其他话题复制节点'
            >
                <Button
                    ghost
                    block
                    type='primary'
                    onClick={( ) => show$( true )}
                > 
                    复制
                </Button>
            </Tooltip>

            <Modal
                onOk={ onSure }
                visible={ show }
                title='从其他话题复制节点'
                onCancel={( ) => show$( false )}
            >

                {/* 话题树 */}
                <TreeSelect
                    value={ val }
                    onChange={ val$ }
                    loadData={ onLoadData }
                    placeholder='请选择话题'
                    style={{ width: '100%' }}
                >
                    { renderTreeNodes( tree$ )}
                </TreeSelect>

                {/* 选择节点 */}
                <Select
                    value={ ptr }
                    placeholder='请选择节点'
                    onChange={ e => ptr$( e )}
                    style={{ width: '100%', marginTop: 10 }}
                >
                   {
                       opts$.map(( g, k ) => (
                           <OptGroup
                                key={ k }
                                label={ g.label }
                           >
                            {
                                g.children.map(( o, kk ) => (
                                    <Option 
                                        key={ kk }
                                        value={ o.value }
                                    >
                                        { o.label }
                                    </Option>
                                ))
                            }
                           </OptGroup>
                       ))
                   } 
                </Select>
            </Modal>
        </div>
    )
}

type NlpClonePtr = {
    abilityId: any
    targetId: any // 插到哪个节点之后
    stepType: 'ready_response' | 'exec_response'
    onOK?: ( ) => void
};

type Ptr = {
    node_type: PtrType,
    node_name: string,
    created: number,
    updated: number,
    node_id: string,
    parent_id: string
    step_type?: any
    children_count: number
    previous_sibling?: string
    front_field?: string
    [ key: string ]: any
    children?: Ptr[ ]
}

enum PtrType {
    end = 'end',
    start = 'start',
    frame = 'frame',
    resource = 'resource',
    slot = 'slot'
}

enum StepType {
    end = 'end',
    start = 'start',
    ready_response = 'ready_response',
    exec_response = 'exec_response'
}