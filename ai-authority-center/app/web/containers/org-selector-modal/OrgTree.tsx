import { Layout, Select, Tree } from 'antd';
import { http } from '../../util/http';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import './OrgTree.less';

let cacheDimension: any[ ] = [ ];
let cacheOrgTree: any = { };
let cacheOrgTreeMeta: any = { };

const OrgTree = React.forwardRef(({ onTreeChoice, canSelect, onTreeSlect }: any, ref ) => {

    /** 组织架构树 */
    const [ orgTree, setOrgTree ] = useState([ ]);

    /** 组织架构树-扁平化数组 */
    const [ orgTreeMeta, setOrgTreeMeta ] = useState([ ]);

    /** 组织架构纬度 */
    const [ dimension, setDimension ] = useState( null );

    /** 组织架构纬度-选项 */
    const [ dimensionOpt, setDimensionOpt ] = useState( cacheDimension );

    /** 勾选中的组织 */
    const [ checkedKeys, setCheckedKeys ] = useState([ ]);
  
    /** 拉取组织架构-纬度 */
    const fetchDimension = ( ) => new Promise( r => {
        if ( dimensionOpt.length > 0 ) { 
            return r( dimensionOpt )
        }
        http.get< any >({
            params: { },
            url: '/apis/common/org/dimension'
        }).then( res => {
            const { status, data } = res;
            const meta = data.map(( x: any ) => ({
                value: x.id,
                label: x.dimensionName
            }));
            cacheDimension = meta;
            setDimensionOpt( meta );
            r( meta )
        });
    });

    /** 拉取组织纬度-树 */
    const fetchTree = ( dimensionId: any ) => {
        const cache = cacheOrgTree[ dimensionId ];
        const cache2 = cacheOrgTreeMeta[ dimensionId ];
        if ( cache ) { 
            setOrgTree( cache );
            return setOrgTreeMeta( cache2 );
        }
        http.get< any >({
            params: { dimensionId },
            url: '/apis/common/org/tree'
        }).then( res => {
            const { status, data } = res;
            const metaTree: any = transferTree( data );

            setOrgTree( metaTree );
            setOrgTreeMeta( data );

            cacheOrgTree = {
                ...cacheOrgTree,
                [ dimensionId ]: metaTree
            };
            cacheOrgTreeMeta = {
                ...cacheOrgTreeMeta,
                [ dimensionId ]: data
            }
        });
    };

    /** 把数组转换为数组树结构 */
    const transferTree = (list: any ) => {
        const result: any[ ] = [ ];
        const listToMap = list.reduce(( obj: any, item: any ) => {
            if ( !obj[ item.id ]) {
                obj[ item.id ] = item;
            }
            return obj;
        }, { });
        list.map(( item: any ) => {
            if ( item.parentId === '-1' ) {
                result.push( item );
            } else {
                const parent = listToMap[ item.parentId ];
                if ( !!parent ) {
                    parent.children = parent.children || [ ];
                    parent.children.push( item );
                }
            }
        });
        return result;
    };

    /** 递归渲染树组件 */
    const renderTreeNodes = ( list: any ) => {
        return list.map(( item: any ) => {
            if ( item.children ) {
                return (
                    <Tree.TreeNode
                        key={ item.orgId }
                        title={ item.orgName }
                    >
                        { renderTreeNodes( item.children )}
                    </Tree.TreeNode>
                )
            }
            return <Tree.TreeNode key={ item.orgId } title={ item.orgName } />
        });
    };

    /** 点击树节点 */
    const onSelectTree = ( item: any ) => {
        !!onTreeChoice && onTreeChoice( item[ 0 ]);
    }

    /** 选中树节点 */
    const onCheck = ( items: any ) => {

        // 0、声明结果
        let result: any[ ] = [ ];

        // 0-1、转换item
        const nodes = items.map(( orgId: any ) => orgTreeMeta.find(( x: any ) => x.orgId === orgId ));

        // 0-2、声明函数
        const isUnderChild = ( parent: any, node: any ) => {
            if ( !Array.isArray( parent.children ) || parent.children.length === 0 ) { return false; }
            return parent.children.some((child : any) => {
                if ( child === node ) {
                    return true;
                }
                if ( Array.isArray( child.children ) && child.children.length > 0 ) {
                    return isUnderChild( child, node );
                }
                return child === node;
            });
        }

        // 1、找到第一个children非空的节点（可无），并插入result
        const firstFather = nodes.find(( x: any ) => Array.isArray( x.children ) && x.children.length > 0 );
        !!firstFather && result.push( firstFather );

        // 2、找到其余不在该节点的子队列中的其他父节点
        const otherFathers = nodes
            .filter(( x: any) => x !== firstFather )
            .filter(( x: any) => Array.isArray( x.children ) && x.children.length > 0 )
            .filter(( x: any) => {
                if ( !firstFather ) { return true; }
                return !isUnderChild( firstFather, x );
            });
        
        // 3、找到所有叶节点
        const noChildNodes = nodes
            .filter(( x: any ) => x !== firstFather )
            .filter(( x: any ) => !x.children )

        // 4、一个个判断是否属于result任意节点的子节点，不属于的话，才插入
        otherFathers
            .concat( noChildNodes )
            .map(( node: any ) => {
                const isChild = result.some( x => isUnderChild( x, node ));
                if ( isChild ) { return; }
                result = [ ...result, node ];
            });
        
        result = result.map( x => {
            const meta = { ...x };
            delete meta.children;
            return meta;
        })
        setCheckedKeys( items );
        !!onTreeSlect && onTreeSlect( result );
    }
    
    /** DidMount */
    useEffect(( ) => {
        fetchDimension( )
            .then(( data: any ) => {
                const dimension = data[ 0 ].value;
                fetchTree( dimension );
                setDimension( dimension );
            });
    }, [ ]);

    useImperativeHandle( ref, ( ) => ({
        reset: ( ) => {
            setCheckedKeys([ ]);
        }
    }))

    return (
        <div className="c-org-tree">

            {/* 组织架构纬度 */}
            <Select
                value={ dimension }
                style={{ width: 120 }}
                onChange={ setDimension }
                placeholder="请选择组织架构纬度"
                className="dimension-opt"
            >
                {
                    dimensionOpt.map(( d, k ) => (
                        <Select.Option
                            key={ d.value }
                            value={ d.value }
                        >
                            { d.label }
                        </Select.Option>
                    ))
                }
            </Select>

            {/* 组织架构树 */}
            <Tree
                onCheck={ onCheck }
                checkable={ canSelect }
                onSelect={ onSelectTree }
                checkedKeys={ checkedKeys }
            >
                { renderTreeNodes( orgTree )}
            </Tree>

        </div>
    );
});

export default React.memo( OrgTree );

