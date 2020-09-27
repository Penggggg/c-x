import { Layout, Menu, Icon } from 'antd';
import React, { useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';

import { Base } from './base';
import { Task } from './task'
import { Label } from './label';
import { StoreProvider } from '../store';
import { AppHeader } from '../containers';
import './index.less';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export const App = ( ) => {

    /** 展示menu */
    const [ showMenu, showMenu$ ] = useState( true );

    /** menu */
    const [ selectedKeys, selectedKeys$ ] = useState< string[ ]>([ ]);

    /** 左侧导航条 */
    const appMenu = useMemo(
        ( ) => {
            return [{
                title: '标注任务',
                icon: 'bar-chart',
                url: `/base/entry`
            }]
        }, [ ]
    );

    /** didMount - 设置menu */
    useEffect(( ) => {
        const { pathname } = window.location;
        if ( !pathname ) { return; }
        
        const index = appMenu.findIndex( x => x.url.includes( pathname ));
        selectedKeys$([ String( index )]);

    }, [ ]);

    return (
        <StoreProvider>
            <Router>
                <Layout 
                    className="p-base"
                    style={{ height: '100vh' }} 
                >

                    {/* 头部logo */}
                    <AppHeader 
                        showUser={ true }
                    />

                    <Layout>
                        
                        {/* 左侧导航条 */}
                        <Sider
                            width={ showMenu ? 200 : 0 }
                        >
                            <Menu
                                mode="inline"
                                selectedKeys={ selectedKeys }
                                style={{ height: '100%', borderRight: 0 }}
                                defaultOpenKeys={ appMenu.map( x => x.title )}
                                onClick={ e => selectedKeys$([ e.key ])}
                            >
                                {
                                    appMenu.map(( subMenu: any, key ) => 
                                        !!subMenu.items ? 
                                            <SubMenu
                                                key={ subMenu.title }
                                                title={(
                                                    <span>
                                                        <Icon type={ subMenu.icon } /> { subMenu.title }
                                                    </span>
                                                )}
                                            >
                                            {
                                                subMenu.items.map(( menu, key2 ) => (
                                                    <Menu.Item key={`${key}-${key2}`}>
                                                        <Link to={ menu.url }>
                                                            { menu.title }
                                                        </Link>
                                                    </Menu.Item>
                                                ))
                                            }
                                            </SubMenu> :
                                            <Menu.Item key={ key }>
                                                <Link to={ subMenu.url }>
                                                    <Icon type={ subMenu.icon } />
                                                    { subMenu.title }
                                                </Link>
                                            </Menu.Item>
                                    )
                                }
                            </Menu>
                        </Sider>
                        
                        {/* 内容层 */}
                        <Layout style={{ padding: '0 24px 24px' }}>

                            {/* 内容层 */}
                            <Content
                                style={{
                                    margin: 0,
                                    padding: 24,
                                    background: '#fff'
                                }}
                            >
                                
                                <Switch>
                                    <Route path="/task" component={ Task } />
                                    <Route path="/base" component={ Base } />
                                    <Route path="/label" component={ Label } />
                                    <Redirect exact from="/" to="/base/entry" />
                                </Switch>
                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
            </Router>
        </StoreProvider>
    );
}