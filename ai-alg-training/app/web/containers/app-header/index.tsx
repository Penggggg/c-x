import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useObserver, useComputed } from 'mobx-react-lite';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { useStore } from '../../store';
import { EUserRole } from '../../util/enum';
import { useList } from '@cvte/ai-web-util/hooks';
import './index.less';

const initProps = {
    showUser: true,
    showUserAlgorithm: true
};
const { Header } = Layout;
const { SubMenu } = Menu;

export const AppHeader = ({ showUser, showUserAlgorithm } = initProps ) => {

    const history = useHistory( );

    const { UserRole } = useStore( );

    /** 用户信息 */
    const [ user, user$ ] = useState< any >({ });

    /** 算法列表 */
    const [ list, list$ ] = useList< any >({ listUrl: '/t-apis/public/algorithm_info' }); 

    /** 退出登陆 - 业务后台 */
    const logout = ( ) => {
        const { host, protocol } = window.location;
        return window.location.href = `${protocol}//${host}/apis/common/ai-logout`
    }

    /** 获取账号信息 */
    const getUserInfo = ( ) => {
        http.get({
            url: `/t-apis/user_info`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            user$( data );
        })
    }

    /** 检测用户角色 */
    const getUserRole = ( ) => {
        UserRole.initRole( )
            .then( go );
    }

    /** 切换角色 */
    const selectRole = ( role: EUserRole ) => {
        UserRole.setRole( role )
            .then(( ) => {
                if ( role === EUserRole.adm ) {
                    history.replace('/base/dataset/list')
                }
                if ( role === EUserRole.normal ) {
                    history.replace('/user/panel')
                } 
            })
    }

    /** 根据角色跳页 */
    const go = ( role: EUserRole | null | undefined ) => {

        const { pathname } = window.location;

        // 白名单，无论什么角色都能看到的页面
        const whiteList = [
            `/base/swagger/main`
        ];

        if ( !!whiteList.find( x => pathname.includes( x ))) {
            return;
        }

        /** 未选择角色 */
        if ( role === null ) { 
            history.replace('/home');
        }

        /** 管理员 */
        if ( role === EUserRole.adm ) {
            if ( !pathname.startsWith('/base')) {
                history.replace('/base/dataset/list');
            }
        }

        /** 普通用户 */
        if ( role === EUserRole.normal ) {
            if ( !pathname.startsWith('/user')) {
                history.replace('/user/panel');
            }
        }
    }

    /** 顶部菜单 */
    const menus$ = useMemo(( ) => {

        const result: any[ ] = [ ];

        /** 普通用户的算法导航 */
        const userAlgorithm = {
            icon: 'setting',
            title: '操作平台',
            items: list.map( l => ({
                title: l.algorithm_name,
                url: `/user/model/${l.id}/${encodeURIComponent( l.algorithm_name )}/my`
            }))
        };

        if ( showUserAlgorithm ) {
            result.push( userAlgorithm );
        }

        return result;
    }, [ showUserAlgorithm, list ]);

    /** 角色切换 */
    const switchRole$ = useComputed(( ) => ({ 
        get value( ) {
            const normal = {
                val: EUserRole.normal,
                label: '切换到普通用户'
            };

            const adm = {
                val: EUserRole.adm,
                label: '切换到算法管理员'
            };

            if ( UserRole.role === EUserRole.normal ) {
                return [ adm ]

            } else if ( UserRole.role === EUserRole.adm ) {
                return [ normal ]

            } else {
                return [ normal, adm ];
            } 
        }
    }));

    /** 获取用户信息 */
    useEffect(( ) => {
        !!showUser && getUserInfo( );
    }, [ showUser ]);

    /** 获取算法列表 */
    useEffect(( ) => {
        !!showUserAlgorithm && list$.load(``);
    }, [ showUserAlgorithm ]);

    /** 获取角色信息 */
    useEffect(( ) => {
        getUserRole( );
    }, [ ]);

    return useObserver(( ) => (
        <Header>
            <div className="con-app-header">
                <div className="content-block">

                    {/* logo */}
                    <div className="logo-block">
                        <img 
                            className="logo"
                            src="/dist/img/cvte.png"
                        />
                        <a className="title">算法模型训练平台</a>
                    </div>

                    {/* 菜单 */}
                    <div className="menu-block">

                        {/* 导航 */}
                        <Menu 
                            theme="dark"
                            mode="horizontal"
                        >
                            {
                                menus$.map(( m, key ) => (
                                    <SubMenu
                                        key={ key }
                                        title={
                                            <span className="submenu-title-wrapper">
                                                { !!m.icon &&  <Icon type={ m.icon } />}
                                                { m.title }
                                            </span>
                                        }
                                    >
                                        {
                                            (m.items || [ ]).map(( item, kk ) => (
                                                <Menu.Item 
                                                    onClick={( ) => !!item.url && history.push( item.url )}
                                                    key={ kk }
                                                >
                                                    { item.title }
                                                </Menu.Item>
                                            ))
                                        }
                                    </SubMenu>
                                ))
                            }
                        </Menu>

                    </div>
                </div>

                {
                    showUser && (
                        <div className="user-block">
                            {/* 切换角色 */}
                            <Dropdown 
                                overlay={
                                    <Menu>
                                        {
                                            switchRole$.value.map(( roleItem, key ) => (
                                                <Menu.Item
                                                    key={ key }
                                                >
                                                    <a onClick={ e => selectRole( roleItem.val )}>{ roleItem.label  }</a>
                                                </Menu.Item>
                                            ))
                                        }
                                    </Menu>
                                }
                            >
                                <Icon 
                                    type="swap" 
                                    style={{ color: '#fff', marginRight: 15 }}
                                />
                            </Dropdown>

                            {/* 退出登陆 */}
                            <Dropdown 
                                overlay={
                                    <Menu>
                                        <Menu.Item>
                                            <a onClick={ logout }>退出登陆 <Icon type="arrow-right" /></a>
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <Avatar
                                    size="large"
                                    style={{ color: '#fff', backgroundColor: '#1890ff' }}
                                >
                                    { user.username }
                                </Avatar>
                            </Dropdown>
                        </div>
                    )
                }
            </div>
        </Header>
    ))
}