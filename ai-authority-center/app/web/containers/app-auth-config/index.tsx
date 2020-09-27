import { RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Modal, Input, notification, Tree, Tabs, Empty } from 'antd';

import { http } from '../../util/http';
import { parseQuery } from '../../util/query';
import { AuthBaseConfig } from '../auth-base-config';
import { AuthRoleConfig } from '../auth-role-config';
import './index.less';

type TAppAuthConfigProps = {
    router: RouteComponentProps
}

type TRoleItem= {
    name?: string
    role_id?: string
}

const initPageQuery = {
    app_id: '', 
    sys_id: ''
}

export const AppAuthConfig = ( props: TAppAuthConfigProps ) => {

    /** 角色创建 */
    const [ creatRoleModal, creatRoleModal$ ] = useState( false );

    /** 角色创建 */
    const [ creatRoleName,  creatRoleName$ ] = useState('');

    /** 角色列表 */
    const [ roleList, roleList$ ] = useState< TRoleItem[ ]>([ ]);

    /** 选中的角色 */
    const [ selectingRole, selectingRole$ ] = useState('');

    /** 页面参数 */
    const [ pageQuery, pageQuery$ ] = useState< typeof initPageQuery >( initPageQuery ); 

    const showErr = ( description: string ) => {
        notification.warning({
            message: '提示',
            description
        })
    }

    /** 创建角色 */
    const onCreateRole = ( ) => {
        if ( !creatRoleName ) {
            return showErr('名称不能为空')
        }
        http.post({
            data: { 
                ...pageQuery,
                name: creatRoleName,
            },
            url: `/apis/role`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            creatRoleModal$( false );
            creatRoleName$( '');
            resetRoles( );
        })
    }

    /** 刷新角色列表 */
    const resetRoles = ( ) => {
        http.get< TRoleItem[ ]>({
            params: pageQuery,
            url: `/apis/role`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            roleList$( res.data );
        })
    }

    /** 获取角色列表 */
    const fetchRoles = ( search: string ) => {
        http.get< TRoleItem[ ]>({
            url: `/apis/role${search}`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            roleList$( res.data );
        })
    }

    /** didMount */
    useEffect(( ) => {
        const search: any = props.router.location.search;
        pageQuery$( parseQuery( search ))
        fetchRoles( search );
    }, [ ]);

    return (
        <div className="con-app-auth-config">
            
            {/* 角色列表 */}
            <div className="role-con">

                <Input.Search
                    enterButton="创建"
                    onSearch={( ) => creatRoleModal$( true )}
                />

                <div
                    style={{ marginTop: 10 }}
                >
                    <Tree
                        selectedKeys={[ selectingRole ]}
                        onSelect={ e => !!e[ 0 ] && selectingRole$( e[ 0 ])}
                    >
                        {
                            roleList.map( role => (
                                <Tree.TreeNode
                                    key={ role.role_id }
                                    title={ role.name }
                                />
                            ))
                        }
                    </Tree>
                </div>

            </div>

            {/* 配置相关 */}
            <div className="config-con">
                {
                    !selectingRole && (
                        <Empty 
                            description="在左侧选择角色"
                        />
                    )
                }
                {
                    !!selectingRole && (
                        <Tabs 
                            defaultActiveKey="1" 
                        >
                            <Tabs.TabPane
                                key="1"
                                tab="角色配置" 
                            >
                                <AuthBaseConfig 
                                    { ...pageQuery }
                                    selectingRole={ selectingRole }
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                key="2"
                                tab="权限配置" 
                            >
                                <AuthRoleConfig 
                                    { ...pageQuery }
                                    selectingRole={ selectingRole }
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    )
                }
            </div>

            {/* 角色创建 */}
            <Modal
                title="角色 - 创建"
                className="editing-menu"
                visible={ creatRoleModal }
                onOk={ e => onCreateRole( )}
                onCancel={ e => creatRoleModal$( false )}
            >
                <Input 
                    value={ creatRoleName }
                    placeholder="请输入角色名称"
                    onChange={ e => creatRoleName$( e.target.value )}
                />
            </Modal>

        </div>
    )
}