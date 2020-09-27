import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react-lite';
import { http } from '@cvte/ai-web-util/util';
import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
import { useStore } from '../../store';
import './index.less';

const initProps = {
    showUser: true,
};
const { Header } = Layout;
const { SubMenu } = Menu;

export const AppHeader = ({ showUser } = initProps ) => {

    const history = useHistory( );

    const { User } = useStore( );

    /** 用户信息 */
    const [ user, user$ ] = useState< any >({ });

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
            User.setAccount( data );
        })
    }

    /** 顶部菜单 */
    const menus$ = useMemo(( ) => {

        const result: any[ ] = [ ];

        /** 普通用户的算法导航 */
        const userAlgorithm = {
            icon: 'setting',
            title: '操作指引',
            items: [{
                title: '标注任务',
                url: '/base/entry'
            }]
        };

        result.push( userAlgorithm );

        return result;
    }, [ ]);


    /** 获取用户信息 */
    useEffect(( ) => {
        !!showUser && getUserInfo( );
    }, [ showUser ]);

    return useObserver(( ) => (
        <Header>
            <div className="con-app-header">
                <div className="content-block">

                    {/* logo */}
                    <div className="logo-block">
                        <img 
                            className="logo"
                            src={require('../../assets/img/cvte.png').default}
                        />
                        <a className="title">NLP技能管理</a>
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