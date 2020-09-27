import React, { useEffect, useMemo, useState } from 'react';
import { Tree, Card } from 'antd';
import { http } from '../../util/http';
import { useList } from '../../hooks/useList';
import './index.less';

type TPageModule = {
    page_module_id: string, 
    name?: string, 
    code?: string
}

type TPage = {
    page_id: string,
    page_module_id?: string,
    name?: string,
    code?: string,
    remark?: string,
    btns?: TBtn[ ]
}

type TBtn = {
    btn_id: string,
    page_id?: string,
    name?: string,
    code?: string,
    remark?: null
}

export const AuthRoleConfig = ({ selectingRole, sys_id, app_id }) => {

    /** 已选的页面、按钮 */
    const [ selecting, selecting$ ] = useState< string[ ] >([ ])

    /** 模块 */
    const [ menuList, menuList$ ] = useList< TPageModule >({
        listUrl: '/apis/app/page-module',
    });

    /** 页面 */
    const [ pageList, pageList$ ] = useList< TPage >({
        listUrl: '/apis/app/page',
    });

    /** 模块 - 拉取 */
    const fetchMenu = ( ) => {
        menuList$.load(`?sys_id=${sys_id}&app_id=${app_id}`);
    }

    /** 页面 - 拉取 */
    const fetchPage = ( ) => {
        pageList$.load(`?sys_id=${sys_id}&app_id=${app_id}`);
    }

    /** 权限拉取 */
    const fetchAuth = ( ) => {
        http.get< any >({
            params: {
                role_id: selectingRole
            },
            url: '/apis/role/pages-btns'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return }

            const { pages, btns } = data;
            selecting$([
                ...pages.map( x => x.page_id ),
                ...btns.map( x => 'btn-' + x.btn_id )
            ])
        })
    }

    /** 更新 */
    const onUpdate = ( ) => {
        const pages = selecting.filter( x => !x.startsWith('btn-'));
        const btns = selecting
            .filter( x => x.startsWith('btn-'))
            .map( x => x.slice( 4 ));

        http.put< any >({
            data: {
                btns,
                pages,
                role_id: selectingRole
            },
            url: '/apis/role/pages-btns'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return }

            const { pages, btns } = data;
            selecting$([
                ...pages.map( x => x.page_id ),
                ...btns.map( x => 'btn-' + x.btn_id )
            ])
        })
    }

    /** 树 - 页面模块 */
    const pageModule$ = useMemo(( ) => {
        return menuList;
    }, [ menuList ]);

    /** 树 - 页面、按钮 */
    const pages$ = useMemo(( ) => {
        let obj: {
            [ key: string ]: TPage[ ]
        } = { };
        menuList.map( menu => {
            obj[ menu.page_module_id ] = pageList.filter( 
                page => page.page_module_id === menu.page_module_id
            );
        });
        return obj;
    }, [ menuList, pageList ]);

    /** 切换角色，拉取对应的权限 */
    useEffect(( ) => {
        fetchAuth( );
    }, [ selectingRole ])

    /** Didmount */
    useEffect(( ) => {
        fetchMenu( );
        fetchPage( );
    }, [ ]);

    return (
        <div>
            <Card 
                title="页面/按钮"
                extra={<a onClick={( ) => onUpdate( )}>更新</a>}
            >
                <Tree
                    checkable
                    selectable={ false }
                    defaultExpandAll={ true }
                    autoExpandParent={ true }
                    checkedKeys={ selecting }
                    onCheck={( e: any ) => selecting$( e )}
                >
                    {/* 模块 */}
                    {
                        pageModule$.map( menu => (
                            <Tree.TreeNode 
                                disableCheckbox
                                title={ menu.name } 
                                key={ menu.page_module_id } 
                            >
                                {/* 页面 */}
                                {
                                    pages$[ menu.page_module_id ].map( page => (
                                        <Tree.TreeNode 
                                            title={ page.name }
                                            key={ page.page_id }
                                        >
                                            {/* 按钮 */}
                                            {
                                                ( page.btns || [ ]).map( btn => (
                                                    <Tree.TreeNode 
                                                        title={ btn.name }
                                                        key={ 'btn-' + btn.btn_id }
                                                    />
                                                ))
                                            }
                                        </Tree.TreeNode>
                                    ))
                                }
                            </Tree.TreeNode>
                        ))
                    }
                </Tree>
            </Card>
        </div>
    )
};
