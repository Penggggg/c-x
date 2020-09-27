import { http } from '@cvte/ai-web-util/util';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Tree, Button, Popover, Tooltip, Modal, Input, notification, Drawer, Radio } from 'antd';
import { PtrConfTitle, PtrCustomAnswer, NlpTopicTreeImportV2, NlpCtxSetter, NlpJumpFrame } from '../index';
import { findDic } from '../../util/dic';
import './index.less';

const { TreeNode } = Tree;
const ButtonGroup = Button.Group;

export const NlpTopicTreeV2 = ({ abilityId = '', onSelect, onFramesChange }: NlpTopicTreeV2 ) => {

    const jumpRef = useRef< any >( null );
    const customRef = useRef< any >( null );
    const customEndRef = useRef< any >( null );

    /** 展开 */
    const [ expandedKeys, expandedKeys$ ] = useState< string[ ]>([ ]);

    /** 正在操作的节点 */
    const [ selecting, selecting$ ] = useState< Ptr | null >( null );

    /** 操作类型类型 */
    const [ actType, actType$ ] = useState< ActionType | null >( null );

    /** 弹窗 */
    const [ showRename, showRename$ ] = useState( false );

    /** 弹窗 */
    const [ showStart, showStart$ ] = useState( false );

    /** 弹窗 */
    const [ showEnd, showEnd$ ] = useState( false );

    /** 弹窗 */
    const [ showImport, showImport$ ] = useState( false );

    /** 弹窗 */
    const [ showCopy, showCopy$ ] = useState( false );

    /** 正在命名的节点 */
    const [ nameing, nameing$ ] = useState('');

    /** 克隆类型 */
    const [ copyType, copyType$ ] = useState< any >( true );

    /** 节点（接口返回的）*/
    const nodesRef = useRef< Ptr[ ]>([ ]);
    const [ nodes, nodes$ ] = useState< Ptr[ ]>([ ]);

    /** 上下文设置 */
    const [ ctxStart, ctxStart$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 上下文设置 */
    const [ ctxEnd, ctxEnd$ ] = useState<{ key: string, value: string }[ ]>([ ]);

    /** 设置nodes */
    const setNodes = ( _nodes: Ptr[ ]) => {
        nodes$( _nodes );
        nodesRef.current = _nodes;
    }

    /** 获取节点 */
    const fetchNodes = ( parentId = '' ) => {
        return http.get< Ptr[ ]>({
            url: `/t-apis/v1/nlp/dialog/frame/${abilityId}?parent_id=${parentId}`
        }).then(({ data, status }) => {
            if ( status !== 200 ) return;

            if ( !parentId ) {
                setNodes( data ); 
            } else { // 这里要检查，是否有重复项
                const parent = [ ...nodesRef.current ].find( x => x.node_id === parentId );
                const others = [ ...nodesRef.current ].filter( x => x.parent_id !== parentId && x.node_id !== parentId );
                const temp = [ ...others, ...data ];
                if ( !!parent ) {
                    temp.push({
                        ...parent,
                        children_count: data.length
                    })
                }
                setNodes( temp );
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
                isLeaf={ p.isLeaf }
                title={(
                    <Popover
                        placement='right'
                        mouseLeaveDelay={ 0.8 }
                        content={(
                            <ButtonGroup>
                                {
                                    p.node_type !== PtrType.start && p.node_type !== PtrType.end && (
                                        <Tooltip
                                            title='创建兄弟话题'
                                        >
                                            <Button 
                                                size='small'
                                                icon='sort-ascending' 
                                                type='primary'
                                                onClick={ e => readyAction( e, p, ActionType.sibling )}
                                            />
                                        </Tooltip>
                                    )
                                }
                                {
                                    p.node_type !== PtrType.end && (
                                        <Tooltip
                                            title='创建子话题'
                                        >
                                            <Button 
                                                size='small'
                                                type='primary'
                                                icon='pull-request' 
                                                onClick={ e => readyAction( e, p, ActionType.child )}
                                            />
                                        </Tooltip>
                                    )
                                }
                                {
                                    p.node_type !== PtrType.end && (
                                        <Tooltip
                                            title='批量导入子话题'
                                        >
                                            <Button 
                                                size='small'
                                                type='primary'
                                                icon='unordered-list' 
                                                onClick={ e => readyImport( e, p )}
                                            />
                                        </Tooltip>
                                    )
                                }    
                                    <Tooltip
                                        title='重命名'
                                    >
                                        <Button 
                                            size='small'
                                            icon='edit' 
                                            type='primary'
                                            onClick={ e => readyAction( e, p, ActionType.rename )}
                                        />
                                    </Tooltip>
                                {
                                    p.node_type !== PtrType.start && p.node_type !== PtrType.end && (
                                        <Tooltip
                                            title='复制'
                                        >
                                            <Button 
                                                size='small'
                                                icon='copy' 
                                                type='primary'
                                                onClick={ e => readyAction( e, p, ActionType.copy )}
                                            />
                                        </Tooltip>
                                    )
                                }
                                {
                                    p.node_type !== PtrType.start && p.node_type !== PtrType.end && (
                                        <Tooltip
                                            title='删除话题'
                                        >
                                            <Button 
                                                size='small'
                                                icon='close' 
                                                type='danger'
                                                onClick={ e => onDelete( e, p )}
                                            />
                                        </Tooltip>
                                    )
                                }
                            </ButtonGroup>
                        )}
                    >
                        { p.node_name }{ p.children_count ? ` ( ${p.children_count} )` : '' }
                    </Popover>
                )} 
            >
                { renderTreeNodes( p.children || [ ])}
            </TreeNode>         
        ))
    };

    /** 准备创建节点或更改名字 */
    const readyAction = ( e, node: Ptr, type: ActionType, ) => {
        e.stopPropagation( );
        actType$( type );
        selecting$( node );
        if ( type !== ActionType.copy ) {
            showRename$( true );
        } else {
            showCopy$( true );
        }
        nameing$( type === ActionType.rename ? node.node_name : '' );
    }

    /** 准备批量导入 */
    const readyImport = ( e, node: Ptr ) => {
        e.stopPropagation( );
        selecting$( node );
        showImport$( true );
    }

    /** 确认批量导入 */
    const onImport = ( skill_id, intention_list, confidence ) => {
        if ( !selecting ) return;
        http.post({
            data: {
                skill_id,
                confidence,
                intention_list,
            },
            successMsg: '导入成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${selecting.node_id}/batch_intention`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            showImport$( false );
            fetchNodes( selecting.node_id );
        })
    }

    /** 确认操作 */
    const onAction = ( ) => {
        if ( actType === ActionType.rename ) {
            onRename( nameing, selecting );
        } else {
            onChildOrSibling( nameing, selecting, actType );
        }
    }

    /** 创建子节点或兄弟 */
    const onChildOrSibling = ( node_name, selecting: Ptr | null, type: ActionType | null ) => {
        if ( !selecting ) return;
        let data: any = {
            node_name,
            step_type: 'start',
            node_type: PtrType.frame
        };

        if ( type === ActionType.child ) {
            data = { 
                ...data, 
                parent_id: selecting.node_id
            }
        } else if ( type === ActionType.sibling ) {
            data = { 
                ...data, 
                parent_id: selecting.parent_id,
                previous_sibling: selecting.node_id
            }
        }

        http.post< any >({
            data,
            successMsg: '创建成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            showRename$( false );
            // 更新父级
            fetchNodes( data.parent_id )
        })
    }

    /** 更改名称 */
    const onRename = ( node_name, selecting ) => {
        if ( node_name === '' ) {
            return notification.info({
                message: '提示',
                description: '节点名称不能为空'
            })
        }
        if ( !selecting ) return;
        http.put< any >({
            data: {
                ...selecting,
                node_name
            },
            successMsg: '修改完成',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${selecting.node_id}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            const Index = nodes.findIndex( x => x.node_id === selecting.node_id );
            const temp = [ ...nodes ];
            temp.splice( Index, 1, {
                ...nodes[ Index ],
                node_name
            })
            setNodes( temp );
            showRename$( false );
        })
    }

    /** 确认复制 */
    const onCopy = ( ) => {
        if ( !selecting ) return;
        const { parent_id, node_id } = selecting;
        http.post< any >({
            data: {
                include: copyType
            },
            successMsg: '复制成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${node_id}/frame_copy`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            showCopy$( false );
            selecting$( null );
            fetchNodes( parent_id );
        })
    }

    /** 点击节点 */
    const onSelectFrame = nodeids => {
        const node = nodes.find( x => x.node_id === nodeids[ 0 ]);
        if ( !node ) return;
        
        console.log( '选择了节点：', node );
        if ( node.node_type === PtrType.frame ) {
            selecting$( node );
            !!onSelect && onSelect( node );
        } else if ( node.node_type === PtrType.start ) { // 如果是点击开始、结束节点，弹框就OK了
            showStart$( true );
        } else if ( node.node_type === PtrType.end ) {
            showEnd$( true );
        }
    }

    /** 删除节点 */
    const onDelete = ( e: any, p: Ptr ) => {
        e.stopPropagation( );
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.delete({
                    successMsg: '删除成功',
                    url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${p.node_id}`
                }).then(({ status }) => {
                    if ( status !== 200 ) return;
                    if ( !!selecting && selecting.node_id === p.node_id ) {
                        !!onSelect && onSelect( null );
                    }
                    selecting$( null );
                    fetchNodes( p.parent_id );
                })
            }
        })
    }

    /** 修改开始节点 */
    const onStartPtr = ( ) => {

        if ( !start$ ) return;

        const custom = customRef.current;
        custom.getData( )
            .then( customData => {
                
                if ( customData.err ) {
                    notification.info({
                        message: '提示',
                        description: '请完善表单'
                    })
                    return;
                }

                let reqData: any = {
                    ...start$,
                    output: customData.data,
                    context: ctxStart.map( x => ({
                        filed_name: x.key,
                        value: x.value,
                        type: 'context'
                    })),
                }
                delete reqData.children;

                http.put< any >({
                    data: reqData,
                    successMsg: '修改完成',
                    url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${start$.node_id}`
                }).then(({ status }) => {
                    if ( status !== 200 ) return;
                    const Index = nodes.findIndex( x => x.node_id === start$.node_id );
                    const temp = [ ...nodes ];
                    temp.splice( Index, 1, {
                        ...nodes[ Index ],
                        ...reqData
                    })
                    setNodes( temp );
                    showStart$( false );
                })

            })
    }

    /** 修改结束节点 */
    const onEndPtr = ( ) => {
        if ( !end$ ) return;

        const custom = customEndRef.current;
        custom.getData( )
            .then( customData => {

                if ( customData.err ) {
                    notification.info({
                        message: '提示',
                        description: '请完善表单'
                    })
                    return;
                }

                jumpRef.current.getData( )
                    .then( jumpData => {
        
                        const jump_frame = jumpData.data;
                        let reqData: any = {
                            ...end$,
                            jump_frame,
                            output: customData.data,
                            next_step: jump_frame,
                            context: ctxEnd.map( x => ({
                                filed_name: x.key,
                                value: x.value,
                                type: 'context'
                            })),
                        }
                        delete reqData.children;
            
                        http.put< any >({
                            data: reqData,
                            successMsg: '修改完成',
                            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${end$.node_id}`
                        }).then(({ status }) => {
                            if ( status !== 200 ) return;
                            const Index = nodes.findIndex( x => x.node_id === end$.node_id );
                            const temp = [ ...nodes ];
                            temp.splice( Index, 1, {
                                ...nodes[ Index ],
                                ...reqData
                            })
                            setNodes( temp );
                            showEnd$( false );
                        })
                    });
            })
        
    }

    /** 展开节点 */
    const onExpand = ( str: string[ ]) => {
        
        // 找出即将要打开的parent节点
        str.filter( x => !expandedKeys.find( y => x === y ))
            .map( k => fetchNodes( k ))
        
        expandedKeys$( str );
    }

    /** 放置节点 */
    const onDrop = ({ dragNode, node }) => {
        /**
         * 1、判断插入位置，节点本身、节点上方、节点下方
         */
        const tar = node.props.dataRef; // 目标节点
        const drag = dragNode.props.dataRef; // 拖拽节点
        const { dragOver, dragOverGapTop, dragOverGapBottom } = node.props;
        
        let parent_id = ''; // 父亲节点	
        let next_id = ''; // 插入位置的后驱节点

        if ( dragOver ) { // 节点本身
            parent_id = tar.node_id;

        } else if ( dragOverGapTop ) { // 节点上方 
            next_id = tar.node_id;
            parent_id = tar.parent_id;

        } else if ( dragOverGapBottom ) { // 节点下方
            parent_id = tar.parent_id;
            const parent = nodes.find( x => x.node_id === parent_id );
            if ( !parent ) return;

            const children = parent.children || [ ];
            const Index = children.findIndex( x => x.node_id === tar.node_id );
            next_id = children[ Index + 1 ] ? children[ Index + 1 ].node_id : '';
        }

        if ( next_id === drag.node_id ) return;

        http.post({
            data: {
                next_id,
                parent_id
            },
            successMsg: '移动成功',
            url: `/t-apis/v1/nlp/dialog/node/${abilityId}/${drag.node_id}/move`
        }).then(({ status }) => {
            
            if ( status !== 200 ) return;
            
            const temp = [ ...nodes ];
            const Index = temp.findIndex( x => x.node_id === drag.node_id );
            Index !== -1 && temp.splice( Index, 1 );

            fetchNodes( )
                .then(( ) => {
                    expandedKeys.map( k => fetchNodes( k ))
                })
        })
    }

    /** 拖拽移动时，加载数据 */
    const onDragEnter = ({ node }) => {
        const cur = node.props.dataRef;
        const { isLeaf, children, node_id } = cur;
        const cb = ( ) => {
            expandedKeys$(
                Array.from(
                    new Set([
                        ...expandedKeys,
                        node_id
                    ])
                )
            )
        }
        if ( !isLeaf && !children.length ) {
            fetchNodes( node_id )
                .then( cb )
        } else if ( !isLeaf && !!children.length ) {
            cb( )
        }
    }

    /** 开始节点 */
    const start$ = useMemo< Ptr | undefined >(( ) => {
        return nodes.find( n => n.node_type === PtrType.start );
    }, [ nodes ]);

    /** 结束节点 */
    const end$ = useMemo< Ptr | undefined >(( ) => {
        return nodes.find( n => n.node_type === PtrType.end );
    }, [ nodes ]);

    /** 节点树 */
    const tree$ = useMemo(( ) => {

        const endNode = nodes.find( x => x.node_type === PtrType.end );
        const startNode = nodes.find( x => x.node_type === PtrType.start )
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
                node.children = children; // 仅用于展示的
                node.isLeaf = !node.children_count; // 根据后台数据，判断是否为叶子节点

                // 递归
                buildChild( children );
            });
        }

        buildChild( tree )
        !!endNode && tree.push({ ...endNode, isLeaf: true });
        return tree;
    }, [ nodes ]);

    /** 话题节点、除了开始、结束 */
    const frames$ = useMemo(( ) => {
        return nodes.filter( n => n.node_type !== PtrType.end && n.node_type !== PtrType.start )
    }, [ nodes ]);

    /** 设置上下文 */
    useEffect(( ) => {
        if ( !start$ ) return ctxStart$([ ]);
        if ( !Array.isArray( start$.context )) return;

        ctxStart$(
            ( start$.context || [ ])
                .filter(( x: any ) => !x.type || x.type === 'context' )
                .map( x => ({
                    key: x.filed_name,
                    value: x.value
                }))
        )
    }, [ start$ ]);

    /** 设置上下文 */
    useEffect(( ) => {
        if ( !end$ ) return ctxEnd$([ ]);
        if ( !Array.isArray( end$.context )) return;
        ctxEnd$(
            ( end$.context || [ ])
                .filter(( x: any ) => !x.type || x.type === 'context' )
                .map( x => ({
                    key: x.filed_name,
                    value: x.value
                }))
        )
    }, [ end$ ]);

    useEffect(( ) => {
        !!onFramesChange && onFramesChange( frames$ );
    }, [ frames$ ]);

    /** 重置 - 2 */
    useEffect(( ) => {
        if ( !showRename ) {
            selecting$( null );
        }
    }, [ showRename ]);

    /** didMount */
    useEffect(( ) => {
        fetchNodes( );
    }, [ ])

    return (
        <div className='con-nlp-topic-tree-v2'>

            {/* 话题树 */}
            <div className="toptic-tree-con">
                <Tree
                    draggable
                    blockNode
                    onDrop={ onDrop }
                    // loadData={ onLoadData }
                    onExpand={ onExpand }
                    onSelect={ onSelectFrame }
                    expandedKeys={ expandedKeys }
                    onDragEnter={ onDragEnter }
                >
                    { renderTreeNodes( tree$ )}
                </Tree>
            </div>      

            {/* 编辑节点名称 */}
            <Modal
                title='话题名称'
                onOk={ onAction }
                visible={ showRename }
                onCancel={( ) => showRename$( false )}
            >
                <Input 
                    value={ nameing }
                    placeholder='请输入话题名称'
                    onChange={ e => nameing$( e.target.value )}
                />
            </Modal>

            {/* 开始节点 */}
            <Drawer
                width={ 550 }
                title='欢迎'
                visible={ showStart }
                onClose={( ) => showStart$( false )}
            >
                <PtrConfTitle 
                    title='回复'
                />

                {
                    !!start$ && (
                        <PtrCustomAnswer 
                            label=''
                            ref={ customRef }
                            abilityId={ abilityId }
                            types={[ 'text', 'rich_text', 'image', 'my_option', 'pause', 'human_agent', 'intent' ]}
                            type={( start$.output || { }).show_type || 'text'}
                            defaultValue={( start$.output || { }).content || { }}
                        />
                    )
                }

                <PtrConfTitle 
                    title='上下文设置'
                />
                <NlpCtxSetter 
                    abilityId={ abilityId }
                    value={ ctxStart }
                    onChane={ ctxStart$ }
                    placeholder={{
                        key: '字段名',
                        value: '字段值，可使用表达式'
                    }}
                />
                <Button
                    block
                    type='primary'
                    onClick={ onStartPtr }
                    style={{ marginTop: 50 }}
                >
                    确认
                </Button>
            </Drawer>

            {/* 结束节点 */}
            <Drawer
                width={ 500 }
                title='完成'
                visible={ showEnd }
                onClose={( ) => showEnd$( false )}
            >

                <PtrConfTitle 
                    title='回复'
                />

                {
                    !!end$ && (
                        <PtrCustomAnswer 
                            label=''
                            ref={ customEndRef }
                            abilityId={ abilityId }
                            types={[ 'text', 'rich_text', 'image', 'my_option', 'pause', 'human_agent', 'intent' ]}
                            type={( end$.output || { }).show_type || 'text'}
                            defaultValue={( end$.output || { }).content || { }}
                        />
                    )
                }

                <PtrConfTitle 
                    title='上下文设置'
                />
                <NlpCtxSetter 
                    abilityId={ abilityId }
                    value={ ctxEnd }
                    onChane={ ctxEnd$ }
                    placeholder={{
                        key: '字段名',
                        value: '字段值，可使用表达式'
                    }}
                />
                <PtrConfTitle 
                    title='话题跳转'
                    tips={[
                        `回复后， 用户下一次请求，将会直接跳转到你选择的子话题。`
                    ]}
                />
                {
                    !!end$ && (
                        <NlpJumpFrame 
                            ref={ jumpRef }
                            abilityId={ abilityId }
                            defaultStep={( end$.next_step || { }).step_type }
                            defaultFrame={( end$.next_step || { }).jump_frame_id }
                        />
                    )
                }
                <Button
                    block
                    type='primary'
                    onClick={ onEndPtr }
                    style={{ marginTop: 50 }}
                >
                    确认
                </Button>
            </Drawer>

            {/* 批量插入子话题 */}
            <NlpTopicTreeImportV2
                show={ showImport }
                abilityId={ abilityId }
                onOk={( s, i, c ) => onImport( s, i, c )}
                onClose={( ) => showImport$( false )}
            />

            {/* 复制节点 */}
            <Modal
                title='复制'
                onOk={ onCopy }
                visible={ showCopy }
                onCancel={( ) => showCopy$( false )}
            >
                <Radio.Group
                    value={ copyType }
                    onChange={ e => copyType$( e.target.value )}
                >
                {
                    findDic('nlp.frames.copy').map( x => (
                        <Radio 
                            key={ x.value }
                            value={ x.value }
                            style={{ display: 'block', margin: '5px 0' }}
                        >
                            { x.label }
                        </Radio>
                    ))
                }
                </Radio.Group>
            </Modal>

        </div>
    )
}

type NlpTopicTreeV2 = {
    abilityId?: any
    onSelect?: ( n: Ptr | null ) => void
    onFramesChange?: ( f: any[ ]) => void
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

enum ActionType {
    child,
    sibling,
    rename,
    copy
}