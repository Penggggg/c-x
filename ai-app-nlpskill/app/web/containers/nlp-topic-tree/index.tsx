import { v4 } from 'uuid';
import { http } from '@cvte/ai-web-util/util';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Tree, notification, Drawer, Button, Popover, Tooltip, Modal, Input, Icon } from 'antd';
import { PtrCustomAnswer, PtrConfTitle, NlpProcess, NlpTopicTreeImport } from '../index';
import './index.less';

const { TreeNode } = Tree;
const ButtonGroup = Button.Group;

/**
 * @description
 * nlp流程图之前的话题树
 */
export const NlpTopicTree = ({ abilityId = '' }: NlpTopicTree ) => {

    const customRef = useRef< any >( null );
    const processRef = useRef< any >( null );

    /** 节点里面的配置，包含start、frame */
    const node2ConfRef = useRef<{[ key: string ]: any }>({ });
    const [ node2Conf, node2Conf$ ] = useState<{[ key: string ]: any }>({ });

    /** 展开 */
    const [ expandedKeys, expandedKeys$ ] = useState< string[ ]>([ ]);

    /** 创建类型 */
    const [ type, type$ ] = useState< CreateType | null >( null );

    /** 正在命名的节点 */
    const [ nameing, nameing$ ] = useState('');

    /** 正在选择的节点 */
    const [ selecting, selecting$ ] = useState< Ptr | null >( null );

    /** 正在操作的节点 */
    const [ acting, acting$ ] = useState< Ptr | null >( null );

    /** 节点（接口返回的） */
    const [ nodes, nodes$ ] = useState< Ptr[ ]>([ ]);

    /** 弹窗 */
    const [ showDrawer, showDrawer$ ] = useState( false );

    /** 弹窗 */
    const [ showConf, showConf$ ] = useState( false );

    /** 弹窗 */
    const [ showRename, showRename$ ] = useState( false );

     /** 弹窗 */
     const [ showImport, showImport$ ] = useState( false );

    /** 修改node2Conf */
    const changeNode2Conf = data => {
        node2Conf$( data );
        node2ConfRef.current = data;
    }

    /** 返回新节点 */
    const ptrFactory = ( type: PtrType, node_name = '欢迎', parent = '', previous_sibling?: string  ): Ptr => {
        let meta: Ptr = {
            parent,
            node_name,
            node_type: type,
            created: Date.now( ),
            updated: Date.now( ),
            node_id: `${type}_${v4( )}`
        };
        if ( !!previous_sibling ) {
            meta = { 
                ...meta,
                previous_sibling
            }
        }
        return meta;
    }

    /** 生成 antd-tree */
    const renderTreeNodes = ( data: Ptr[ ]) => {
        return data.map( p => (
            <TreeNode 
                key={ p.node_id }
                icon={<Icon type='unordered-list'/>}
                title={(
                    <Popover
                        mouseLeaveDelay={ 0.8 }
                        content={(
                            <ButtonGroup>
                                {
                                    p.node_type !== PtrType.start && (
                                        <Tooltip
                                            title='创建兄弟话题'
                                        >
                                            <Button 
                                                size='small'
                                                icon='minus' 
                                                type='primary'
                                                onClick={ e => readyCreate( e, p, CreateType.sibling )}
                                            />
                                        </Tooltip>
                                    )
                                }
                                <Tooltip
                                    title='创建子话题'
                                >
                                    <Button 
                                        size='small'
                                        type='primary'
                                        icon='align-center' 
                                        onClick={ e => readyCreate( e, p, CreateType.child )}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title='批量导入子话题'
                                >
                                    <Button 
                                        size='small'
                                        type='primary'
                                        icon='arrow-down' 
                                        onClick={ e => readyImport( e, p )}
                                    />
                                </Tooltip>
                                {
                                    p.node_type !== PtrType.start && (
                                        <Tooltip
                                            title='重命名'
                                        >
                                            <Button 
                                                size='small'
                                                icon='edit' 
                                                type='primary'
                                                onClick={ e => readyRename( e, p )}
                                            />
                                        </Tooltip>
                                    )
                                }
                                {
                                    p.node_type !== PtrType.start && (
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
                        { p.node_name }
                    </Popover>
                )} 
            >
                { renderTreeNodes( p.children || [ ])}
            </TreeNode>         
        ))
    };

    /** 获取数据 */
    const getStartData =  ( ) => new Promise( r => {
        const custom = customRef.current;
        custom.getData( )
            .then( customData => {
                const e2 = customData.err;
                const d2 = customData.data;
                
                if ( e2 ) {
                    notification.info({
                        message: '提示',
                        description: '请完善表单'
                    })
                    return r( null );
                }
                r({ output: d2 })
            })
    })

    /** 开始节点 */
    const onStartSure = async ( ) => {
        const data = await getStartData( );
        if ( !data ) return; 
        const startNode: any = nodes.find( x => x.node_type === PtrType.start );
        changeNode2Conf({
            ...node2Conf,
            [ startNode.node_id ]: data
        })
        showDrawer$( false );
    }

    /** 点击任意节点 */
    const onSelect = node_ids => {
        const node = nodes.find( x => x.node_id === node_ids[ 0 ] );
        if ( !node ) return;

        selecting$( node )
        if ( node.node_type === PtrType.start ) {
            showDrawer$( true );
        }
    }

    /** 准备创建节点 */
    const readyCreate = ( e, node: Ptr, type: CreateType, ) => {
        e.stopPropagation( );
        type$( type );
        showConf$( true );
        acting$( node )
    }

    /** 准备批量导入子节点 */
    const readyImport = ( e, node: Ptr ) => {
        e.stopPropagation( );
        acting$( node );
        showImport$( true );
    }

    /** 批量导入 */
    const onImport = ( parent, childNodes, childConf ) => {
        showImport$( false );
        nodes$([ ...nodes, ...childNodes ]);
        changeNode2Conf({ ...node2Conf, ...childConf })
    }

    /** 准备更改名字 */
    const readyRename = ( e, node: Ptr ) => {
        e.stopPropagation( );
        selecting$( node )
        showRename$( true );
        nameing$( node.node_name );
    }

    /** 确认创建节点 */
    const onCreate = ( ) => {

        if ( nameing === '' ) {
            return notification.info({
                message: '提示',
                description: '节点名称不能为空'
            })
        }

        if ( !acting ) return;

        let temp: Ptr[ ] = [ ];
        const currentLevelParent = type === CreateType.sibling ?
            acting.parent :
            acting.node_id;
        const currentLevelArr = nodes.filter( x => x.parent === currentLevelParent );

        // 创建子节点，直接插到子层的最后一位
        if ( type === CreateType.child ) {

            const previous_sibling = currentLevelArr.length > 0 ?
                currentLevelArr[ currentLevelArr.length - 1 ].node_id :
                '';

            temp = [ 
                ...nodes,
                ptrFactory( 
                    PtrType.frame, 
                    nameing, 
                    acting.node_id,
                    previous_sibling
                )
            ];
        // 创建兄弟节点，需要根据插入位置，重新组织链条（x指向N，N+1指向x）
        } else if (  type === CreateType.sibling ) {
            const selectingNext = currentLevelArr.find( x => x.previous_sibling === acting.node_id );
            const newNode = ptrFactory( 
                PtrType.frame, 
                nameing,
                acting.parent,
                acting.node_id
            );
            temp = [ 
                ...nodes,
                newNode
            ];

            if ( selectingNext ) {
                const Index = temp.findIndex( x => x.node_id === selectingNext.node_id );
                temp.splice( Index, 1, {
                    ...selectingNext,
                    previous_sibling: newNode.node_id
                });
            }
        }

        nodes$( temp )
        showConf$( false );
    }

    /** 确认更改名称 */
    const onRename = ( ) => {
        if ( nameing === '' ) {
            return notification.info({
                message: '提示',
                description: '节点名称不能为空'
            })
        }
        if ( !selecting ) return;
        const Index = nodes.findIndex( x => x.node_id === selecting.node_id );
        const temp = [ ...nodes ];
        temp.splice( Index, 1, {
            ...nodes[ Index ],
            node_name: nameing
        })
        nodes$( temp );
        showRename$( false );
    }

    /** 删除节点 */
    const onDelete = ( e, node: Ptr ) => {
        e.stopPropagation( );
        if ( Array.isArray( node.children ) && node.children.length > 1 ) {
            return notification.info({
                message: '提示',
                description: '请先删除子话题',
            })
        }

        Modal.confirm({
            title: '提示',
            content: '删除该话题吗？',
            onOk: ( ) => {

                const temp = [ ...nodes ];
                const levelParent = node.parent;
                const levelArr = nodes.filter( x => x.parent === levelParent );

                const nodePre = levelArr.find( x => x.node_id === node.previous_sibling );
                const nodeNext = levelArr.find( x => x.previous_sibling === node.node_id );

                // 目要删除元素的下标
                const targetIndex = nodes.findIndex( x => x.node_id === node.node_id );

                // 如果是该层最后一个元素，直接删除
                if ( !nodeNext ) {

                // 如果是该层第一个元素，第二个元素的previous_sibling置空（可能不存在第二个元素）
                } else if ( !node.previous_sibling ) {
                    const nextIndex = nodes.findIndex( x => x.node_id === nodeNext.node_id );
                    temp.splice( nextIndex, 1, {
                        ...nodes[ nextIndex ],
                        previous_sibling: undefined
                    });

                // 如果是该层的中间元素如第N个，则把N+1个元素第previous_sibling置为N-1（可能不存在第N+1个元素）
                } else if ( !!nodePre ){
                    const nextIndex = nodes.findIndex( x => x.node_id === nodeNext.node_id );
                    temp.splice( nextIndex, 1, {
                        ...nodes[ nextIndex ],
                        previous_sibling: nodePre.node_id
                    });
                }

                // 删除目标元素
                temp.splice( targetIndex, 1 );
                nodes$( temp );
            }
        })
    }

    /** 保存 */
    const onUpdate = async ( ) => {
        const { isOk, data } = await onCheck( );
        if ( !isOk ) {
            return notification.info({
                message: '提示',
                description: '请完善配置'
            })
        }

        const yml = onYml( );
        console.log(`提交数据：`, { ...data, nodes: yml })
        http.post< any >({
            successMsg: '保存成功',
            data: { flow_config: JSON.stringify({ ...data, nodes: yml })},
            url: `/t-apis/v1/nlp/version/config/${abilityId}`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
        })
    }

    /** 校验当前的流程图、全部流程、节点 */
    const onCheck = async ( ) => {

        let _node2Conf = { ...node2ConfRef.current }
        const process = processRef.current;
        if ( !!process ) {
            // bug 连续获取2次，才拿到最新值
            const processData = await process.getData( );
            console.log( `TopicTree-流程图数据：`, processData );
            if ( !!selecting ) {
                _node2Conf = {
                    ..._node2Conf,
                    [ selecting.node_id ]: processData
                }
                changeNode2Conf( _node2Conf );
            }
        }
        return {
            isOk: true,
            data: {
                front_nodes: nodes,
                front_node2Conf: _node2Conf,
                scenes: '${scenes}',
                dialog_version: '${version_id}',
            }
        };
    }

    /** 拼凑后台需要的字段 */
    const onYml = ( ) => {

        console.log( `YML-nodes: `, nodes )
        console.log(`YML-node2Conf：`, node2ConfRef.current )

        const node2Conf = node2ConfRef.current;

        // 根据节点类型，修改节点内容，如condition字段
        const modifyPtr = ( type: 'all-start' |  'start' | 'response_condition' | 'slot' | 'resource', ptrVal ) => {

            // condition
            const fixCondition = variables => {
                const { range, variable, cnList, content, operator } = variables;
                const variable_name = range === 'input' ?
                    `&{input}` :
                    range === 'variable' ?
                        '${' + `${variable}` + '}':
                        range === 'slot' ?
                            `&{${cnList.join('.')}}` :
                            range === 'intent' ?
                                `#{${cnList.join('.')}}` :
                                `@{${cnList.join('.')}}`
                return {
                    operator,
                    variable_name,
                    value: content,
                }
            }

            // in_params
            const fixInParams = parmas => {
                const { type, cnList, value, pos, name } = parmas;
                let meta = { value, pos, name };
                if ( type === 'slot' ) {
                    meta = {
                        ...meta,
                        value: '&{' +  `${cnList[ 0 ]}.${cnList[ 1 ]}.${cnList[ 2 ]}` + '}'
                    }
                }
                return meta;
            }

            // slot节点，根据澄清话术类型，调整成后台需要的字段
            const fixSlot = slot_context => {
                const { say_type, say_list } = slot_context;
                let _say_list = [ ];

                if ( say_type === 'text' ) {
                    _say_list = say_list.map( x => ({
                        show_type: 'text',
                        content: {
                            text: x
                        }
                    }))
                } else if ( say_type === 'image' ) {
                    _say_list = say_list.map( x => ({
                        show_type: 'image',
                        content: {
                            title: x.key,
                            description: x.key,
                            url: x.value
                        }
                    }))
                } else if ( say_type === 'my_option' ) {
                    _say_list = say_list.map( x => ({
                        show_type: 'option',
                        content: {
                            title: x.title,
                            description: x.title,
                            my_option: x.options.map( y => ({
                                label: y.key,
                                value: y.value
                            }))
                        }
                    }))
                }

                return {
                    ...slot_context,
                    // say_list: _say_list
                    say_list
                }
            }

            // 自定义回复里面的 意图跳转
            const fixSearchSkill = content => {
                const { searchSkillIntent, searchSkillResponse } = content;
                return {
                    text: searchSkillResponse,
                    intent: searchSkillIntent
                }
            }
            
            if ( type === 'start' || type === 'response_condition' ) {
                if ( !Object.keys(( ptrVal.conditions || { })).length ) {
                    return {
                        ...ptrVal,
                        conditions: {
                            operator: 'true'
                        }
                    }
                };
                const rules = ( ptrVal.conditions.rules || [ ]).map( r => {
                    const { variables } = r;
                    return {
                        ...r,
                        variables: variables.map( fixCondition )
                    }
                })
                let meta = {
                    ...ptrVal,
                    conditions: {
                        ...ptrVal.conditions,
                        rules,
                    }
                };

                if ( type === 'response_condition' ) {
                    const { content, show_type } = ptrVal.output;
                    meta = {
                        ...meta,
                        output: {
                            ...ptrVal.output,
                            content: show_type === 'intent' ? fixSearchSkill( content ) : content
                        }
                    }
                }

                return meta;

            // 处理InParams
            } else if ( type === 'resource' ) {
                if ( !Object.keys( ptrVal.info ).length ) return ptrVal;
                const in_params = ( ptrVal.info.in_params || [ ]).map( fixInParams )
                return {
                    ...ptrVal,
                    info: {
                        ...ptrVal.info,
                        in_params,
                    }
                }
            // 处理slot_context
            } else if ( type === 'slot' ) {
                if ( !Object.keys( ptrVal.slot_context ).length ) return ptrVal; 
                return {
                    ...ptrVal,
                    slot_context: fixSlot( ptrVal.slot_context )
                }
            } else if ( type === 'all-start') {
                if ( !ptrVal.output || ptrVal.output.show_type !== 'intent') return ptrVal;
                return {
                    ...ptrVal,
                    output: {
                        ...ptrVal.output,
                        content: fixSearchSkill( ptrVal.output.content )
                    }
                };
            } else {
                return ptrVal
            }
        }

        /** 获取大Start或者frame节点的基本信息 */
        const frameOrStartInfo = node => {

            if ( !node ) return null;
            let ptrInfo = { };
            const info = Object.keys( node )
                .reduce(( pre, key ) => {
                    if ( key === 'children' ) return pre;
                    if ( key === 'created' || key === 'updated' ) {
                        return {
                            ...pre,
                            [ key ]: ( new Date( node[ key ])).toISOString( )
                        }
                    }
                    return {
                        ...pre,
                        [ key ]: node[ key ]
                    } 
                }, { });

            if ( node.node_type === 'start' ) {
                ptrInfo = modifyPtr( 'all-start', ( node2Conf[ node.node_id ] || { }));
            }

            if ( node.node_type === 'frame' ) {
                const frameStart = node2Conf[ node.node_id ];
                if ( !!frameStart ) {
                    const x = frameStart.ptrVal.find( x => x.type === 'start' );
                    if ( !!x ) { ptrInfo = modifyPtr( x.type, x.val )}
                }
            }

            return {
                ...info,
                ...ptrInfo
            };
        };

        // 所有结果
        let result: any[ ] = [ ];

        // 找到总的开始节点
        const start = frameOrStartInfo( nodes.find( x => x.node_type === 'start' ));
        
        // frame级别的节点
        const frames: any[ ] = nodes
            .filter( x => x.node_type === 'frame' )
            .map( frameOrStartInfo )
            .filter( x => !!x );

        result = [ start, ...frames ];

        // 每个frame中的所有节点
        const ptrInFrame: any = frames.map( f => {

            const frameConf = node2Conf[ f.node_id ];
            if ( !frameConf ) return null;

            const { relations, ptrVal } = frameConf; 
            const frameStart = ptrVal.find( x => x.type === 'start')
            if ( !frameStart ) return null;

            // 还没有关系链且没有开始节点
            const chain = relations[ 0 ];
            const chainStart = ( chain || [ ]).find( x => x.from === frameStart.id );
            if ( !chainStart ) return null;

            // 指针（有关系链）
            const frameChain: any[ ] = [ ]; 
            let prePtr = { ...f, id: f.node_id };
            let chainPtrId = chainStart.to;

            // 开始节点
            frameChain.push({
                node_id: ptrVal[ 0 ].id,
                node_type: ptrVal[ 0 ].type,
                parent: f.parent,
                created: f.created,
                updated: f.updated,
                previous_sibling: ptrVal[ 0 ].id,
                // 修改节点的内容
                ...modifyPtr( ptrVal[ 0 ].type, ptrVal[ 0 ].val )
            });

            while ( chainPtrId ) {

                const ptr = ptrVal.find( x => x.id === chainPtrId );
                let meta = {
                    node_id: ptr.id,
                    node_type: ptr.type,
                    parent: f.parent,
                    created: f.created,
                    updated: f.updated,
                    previous_sibling: prePtr.id,
                    // 内部开始、词槽、资源、回复节点的数据
                    ...modifyPtr( ptr.type, ptr.val )
                };

                delete meta['type'];
                frameChain.push( meta );

                // 移动指针
                const nextRelation = chain.find( x => x.from === ptr.id );

                prePtr = ptr;
                chainPtrId = !!nextRelation ?
                    nextRelation.to : 
                    null;
            }
            return frameChain;
        }).filter( x => !!x );

        ptrInFrame.map( x => result = [ ...result, ...x ])

        return result;
    }

    /** frame节点 */
    const frames$ = useMemo(( ) => {
        return nodes.filter( x => x.node_type === 'frame' )
            .map( x => ({
                id: x.node_id,
                name: x.node_name
            }))
    }, [ nodes ]);

    /** 流程配置 - 节点（树） */
    const flowTree$ = useMemo(( ) => {

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
                const firstChild = nodes.find( x => x.parent === node.node_id && !x.previous_sibling );

                // 按关系链 查找所有子节点
                const children = findSiblings( firstChild );
                node.children = children;

                // 递归
                buildChild( children );
            });
        }

        buildChild( tree )
        return tree;
    }, [ nodes ]);

    /** 当前选中节点的配置项 */
    const conf$ = useMemo(( ) => {
        const meta = !selecting ? 
            { } : 
            ( node2Conf[ selecting.node_id ] || { })
        return meta;
    }, [ node2Conf, selecting ]);

    /** 重置 - 1 */
    useEffect(( ) => {
        if ( !showConf ) {
            nameing$('');
            type$( null );
        }
    }, [ showConf ]);

    /** 重置 - 2 */
    useEffect(( ) => {
        if ( !showRename ) {
            nameing$('');
        }
    }, [ showRename ]);

    /** 重置 - 3 */
    useEffect(( ) => {
        if ( !showImport ) {
            acting$( null );
        }
    }, [ showImport ]);

    /** 拉流程图数据 */
    useEffect(( ) => {
        http.get< any >({
            url: `/t-apis/v1/nlp/version/${abilityId}/dev`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            const { flow_config } = data;

            let _node2Conf: any = { }
            let _nodes: Ptr[ ] = [ ];
            try {
                const meta = JSON.parse( flow_config )
                _nodes = meta.front_nodes || [ ];
                _node2Conf = meta.front_node2Conf || { };
            } catch { }

            const hsaStart = _nodes.find( x => x.node_type === PtrType.start )
            !hsaStart && _nodes.unshift( ptrFactory( PtrType.start ))

            console.log('初始化_nodes, ', _nodes );
            console.log('初始化_node2Conf, ', _node2Conf )
            nodes$( _nodes );
            changeNode2Conf( _node2Conf );
            expandedKeys$( _nodes.map( x => x.node_id ))
        })
    }, [ ]);

    return (
        <div className='con-nlp-topic-tree'>

            <div className="container">

                {/* 会话树 */}
                <div className='tree-con'>
                    <Button
                        block
                        ghost
                        size='default'
                        type='primary'
                        icon='arrow-up'
                        style={{ marginBottom: 20 }}
                        onClick={ onUpdate }
                    >
                        保存
                    </Button>
                    <Tree
                        showIcon
                        defaultExpandAll
                        // selectedKeys={[ ]}
                        onSelect={ onSelect }
                        expandedKeys={ expandedKeys }
                        onExpand={ e => expandedKeys$( e )}
                    >
                        { renderTreeNodes( flowTree$ )}
                    </Tree>
                </div>

                {/* 内容 */}
                <div className='content-con'>

                    {/* 流程图 */}
                    <div className='process-con'>
                        {
                            (!!selecting && selecting.node_type !== PtrType.start ) && (
                                <NlpProcess 
                                    frames={ frames$ }
                                    ref={ processRef }
                                    key={ Date.now( )}
                                    abilityId={ abilityId }
                                    points={ conf$.ptrVal }
                                    relations={ conf$.relations }
                                />
                            )
                        }
                    </div>
                </div>

            </div>

            {/* 开始节点配置 */}
            <Drawer
                width={ 480 }
                title='配置 - 回复'
                visible={ showDrawer }
                onClose={( ) => showDrawer$( false )}
            >
                <PtrConfTitle 
                    title='回复'
                />
                <PtrCustomAnswer 
                    label=''
                    ref={ customRef }
                    abilityId={ abilityId }
                    types={[ 'text', 'rich_text', 'image', 'my_option', 'pause', 'human_agent', 'intent' ]}
                    type={((( conf$ || { }).output || { }).show_type || '' )}
                    defaultValue={((( conf$ || { }).output || { }).content || { })}
                />
                <Button
                    block
                    type='primary'
                    onClick={ onStartSure }
                    style={{ marginTop: 50 }}
                >
                    确定
                </Button>
            </Drawer>

            {/* 批量导入 */}
            <NlpTopicTreeImport 
                frame={ acting }
                onOk={ onImport }
                show={ showImport }
                abilityId={ abilityId }
                onClose={( ) => showImport$( false )}
            />

            {/* 新节点名称 */}
            <Modal
                title='话题名称'
                onOk={ onCreate }
                visible={ showConf }
                onCancel={( ) => showConf$( false )}
            >
                <Input 
                    value={ nameing }
                    placeholder='请输入话题名称'
                    onChange={ e => nameing$( e.target.value )}
                />
            </Modal>
            
            {/* 编辑节点名称 */}
            <Modal
                title='编辑话题名称'
                onOk={ onRename }
                visible={ showRename }
                onCancel={( ) => showRename$( false )}
            >
                <Input 
                    value={ nameing }
                    placeholder='请输入话题名称'
                    onChange={ e => nameing$( e.target.value )}
                />
            </Modal>

        </div>
    )
}

type NlpTopicTree = {
    abilityId?: any
}

enum PtrType {
    start = 'start',
    frame = 'frame'
}

enum CreateType {
    child,
    sibling
}

type Ptr = {
    node_type: PtrType,
    node_name: string,
    created: number,
    updated: number,
    node_id: string,
    parent: string
    previous_sibling?: string
    [ key: string ]: any
    children?: Ptr[ ]
}