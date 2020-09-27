import React, { useMemo, useEffect, useState } from 'react';
import { Route, Link, RouteComponentProps } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { Dataset } from './dataset';
import { Algorithm } from './algorithm';
import { Train } from './train';
import { Deploy } from './deploy';
import { Swagger } from './swagger';
import { AppHeader } from '../../containers/app-header';
import { AppBreadcrumb } from '../../containers/app-breadcrumb';
import './index.less';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

type TPageBase = { } & RouteComponentProps;

export const Base = ({ location }: TPageBase ) => {

    const prefix = '/base';

    /** 展示menu */
    const [ showMenu, showMenu$ ] = useState( true );

    /** menu */
    const [ selectedKeys, selectedKeys$ ] = useState< string[ ]>([ ]);

    /** 左侧导航条 */
    const appMenu = useMemo(
        ( ) => {
            return [{
                title: '数据集管理',
                icon: 'bar-chart',
                url: `${prefix}/dataset/list`
            }, {
                title: '算法&模型',
                icon: 'bg-colors',
                url: `${prefix}/algorithm/list`
            }, {
                title: '训练管理',
                icon: 'thunderbolt',
                url: `${prefix}/train/list`
            }, {
                title: '部署管理',
                icon: 'rocket',
                url: `${prefix}/deploy/list`
            }]
        }, [ prefix ]
    );

    /** didMount - 设置menu */
    useEffect(( ) => {
        const { pathname } = location;
        if ( !pathname ) { return; }
        
        const index = appMenu.findIndex( x => x.url.includes( pathname ));
        selectedKeys$([ String( index )]);

    }, [ ]);

    /** didMount - 是否展示menu */
    useEffect(( ) => {
        const { pathname } = location;
        const blackList = [
            `/base/swagger/main`
        ];

        if ( blackList.find( x => pathname.includes( x ))) {
            showMenu$( false );
        }
    }, [ ]);

    return (
        <Layout 
            className="p-base"
            style={{ height: '100vh' }} 
        >

            {/* 头部logo */}
            <AppHeader 
                showUser={ true }
                showUserAlgorithm={ false } 
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
                        <div 
                            style={{
                                background: '#fff'
                            }}
                        >
                            {/* 面包屑 */}
                            <AppBreadcrumb />

                            {/* 数据集模块 */}
                            <Route path={`${prefix}/dataset`} component={ Dataset } />

                            {/* 算法模块 */}
                            <Route path={`${prefix}/algorithm`} component={ Algorithm } />

                            {/* 训练模块 */}
                            <Route path={`${prefix}/train`} component={ Train } />

                            {/* 部署模块 */}
                            <Route path={`${prefix}/deploy`} component={ Deploy } />

                            {/* Swagger模块 */}
                            <Route path={`${prefix}/swagger`} component={ Swagger } />
                        </div>
                    </Content>
                </Layout>

            </Layout>

        </Layout>
    )
}