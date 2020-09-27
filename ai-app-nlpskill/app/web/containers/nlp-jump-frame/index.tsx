import { http } from '@cvte/ai-web-util/util';
import { TreeSelect, Select, Tree } from 'antd';
import React, { useState, useMemo, useEffect, useImperativeHandle } from 'react';
import { findDic } from '../../util/dic';
import './index.less';

const { Option } = Select;
const { TreeNode } = Tree;

/**
 * 
 * @description
 * 话题跳转
 */
export const NlpJumpFrame = React.forwardRef(({ defaultFrame = '', defaultStep, abilityId }: NlpJumpFrame, ref ) => {

    /** 树选择器的值 */
    const [ val, val$ ] = useState< any >( null );

    /** 阶段 */
    const [ step, step$ ] = useState< any >( null );

    /** 默认值的节点信息 */
    const [ meta, meta$ ] = useState< Ptr | null >( null );

    /** 其余节点 */
    const [ nodes, nodes$ ] = useState< Ptr[ ]>([ ]);

    /** 获取详情 */
    const fetchDetail = ( node_id?: any ) => {
        if ( !node_id ) return;
        http.get< Ptr >({
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}`
        }).then(({ data, status }) => {
            if ( status !== 200 ) return;
            meta$( data );
        })
    }

    /** 加载列表 */
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

    const tree$ = useMemo< any[ ]>(( ) => {
        
        let exited = false;
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

        if ( !!meta ) { // 数据源中是否已经有meta
            exited = !!nodes.find( x => x.node_id === meta.node_id );
        }
        if ( !!meta && !exited ) { // 没有meta，则插在首位。有，则不需要插入meta
            tree.unshift({ ...meta, isLeaf: true });
        }

        return tree;
    }, [ meta, nodes ]);

    useImperativeHandle( ref, ( ) => ({
        getData: async ( ) => {
            return {
                err: false,
                data: {
                    step_type: step,
                    jump_frame_id: val
                }
            }
        }
    }))

    useEffect(( ) => {
        if ( !!val && !step ) {
            step$('start')
        }
        if ( !val ) {
            step$( null );
        }
    }, [ val ]);

    useEffect(( ) => {
        if ( !!defaultFrame ) {
            val$( defaultFrame )
            fetchDetail( defaultFrame );
        }
    }, [ defaultFrame ])

    useEffect(( ) => {
        step$( defaultStep );
    }, [ defaultStep ])

    useEffect(( ) => {
        fetchNodes( );
    }, [ ]);

    return (
        <div className='con-nlp-jump-frame'>
            <TreeSelect
                allowClear
                value={ val }
                onChange={ val$ }
                loadData={ onLoadData }
                placeholder='请选择话题'
                className='tree-selector'
            >
                { renderTreeNodes( tree$ )}
             </TreeSelect>
            <Select
                value={ step }
                onChange={ step$ }
                placeholder='请选择阶段'
                style={{ width: 120, marginLeft: 20 }}
            >
                {
                    findDic('nlp.frames.step').map( x => (
                        <Option 
                            key={ x.value }
                            value={ x.value }
                        >
                            { x.label }
                        </Option>
                    ))
                }
            </Select>
        </div>
    )
})

type NlpJumpFrame = {
    abilityId: any
    defaultFrame?: any
    defaultStep?: 'start' | 'ready_response' | 'end'
}

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
    frame = 'frame'
}