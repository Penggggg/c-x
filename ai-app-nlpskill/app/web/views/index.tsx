import { Layout, Menu, Icon } from 'antd';
import React, { useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { Base } from './base';
import { StoreProvider } from '../store';
import { AppHeader } from '../containers';
import './index.less';
import { Entity } from './entity';
import { Intents } from './intents';
import { Records } from './records';
import { Version } from './version';
import { Preference } from './preference';
import { Banner } from './banner';
import queryString from 'query-string';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export const App = (props) => {
    /** 展示menu */
    const [ showMenu, showMenu$ ] = useState( true );

    /** menu */
    const [ selectedKeys, selectedKeys$ ] = useState< string[ ]>([ ]);
    const [ abilityId, setAbilityId ] = useState<string>();

    /** 左侧导航条 */
    const appMenu = useMemo(
        ( ) => {
            return [
            {
                title: '实体管理',
                icon: 'robot',
                url: `/entity`,
                items: [{
                    title: '自定义实体',
                    url: `/entity/my`,
                }, {
                    title: '内置实体',
                    url: `/entity/sys`,
                }]
            }, {
                title: '意图管理',
                icon: 'container',
                url: `/intents`,
            }, {
                title: '对话配置',
                icon: 'bar-chart',
                url: `/base/frames-v2`
            }, {
                title: '聊天记录',
                icon: 'profile',
                url: `/records`,
            }, {
                title: '版本管理',
                icon: 'interaction',
                url: `/version`,
            }, {
                title: '偏好设置',
                icon: 'setting',
                url: `/preference`,
            }]
        }, [ ]
    );

    /** didMount - 设置menu */
    useEffect(( ) => {
        const { location } = props;
        if ( !location.pathname ) { return; }
        selectedKeys$([ location.pathname]);
        const { search } = location;
        const searchParam:any = queryString.parse(search);
        if (searchParam.abilityId) setAbilityId(searchParam.abilityId);
    }, [ ]);

    return (
        <StoreProvider>
            <Router basename={!window.__POWERED_BY_QIANKUN__?'':'nlpskill'}>
                <Layout 
                    className="p-base"
                    // style={{ height: '100vh' }} 
                >

                    {/* 头部logo */}
                    {/* <AppHeader 
                        showUser={ false }
                    /> */}

                    <Layout >

                        {/* 左侧导航条 */}
                        <Sider
                            width={ showMenu ? 200 : 0 }
                            style={{ height: '100vh', overflow: 'auto' }}
                        >
                            {/* bannner */}
                            <Banner history={props.history} />
                            <Menu
                                mode="inline"
                                selectedKeys={selectedKeys}
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
                                                subMenu.items.map(( menu ) => (
                                                    <Menu.Item key={menu.url}>
                                                        <Link to={ abilityId?`${menu.url}?abilityId=${abilityId}`:menu.url }>
                                                            { menu.title }
                                                        </Link>
                                                    </Menu.Item>
                                                ))
                                            }
                                            </SubMenu> :
                                            <Menu.Item key={ subMenu.url }>
                                                <Link to={ abilityId?`${subMenu.url}?abilityId=${abilityId}`:subMenu.url }>
                                                    <Icon type={ subMenu.icon } />
                                                    { subMenu.title }
                                                </Link>
                                            </Menu.Item>
                                    )
                                }
                            </Menu>
                        </Sider>
                        
                        {/* 内容层 */}
                        <Layout style={{ margin: '0 24px 24px', minWidth: 1000 }}>

                            {/* 内容层 */}
                            <Content
                                style={{
                                    margin: 0,
                                    padding: 24,
                                    background: '#fff'
                                }}
                            >
                                
                                <Switch>
                                    <Route path="/base" component={ Base } />
                                    {/* <Redirect exact from="/" to="/base/entry" /> */}
                                    <Route path="/entity" component={ Entity } />
                                    <Route path="/intents" component={ Intents } />
                                    <Route path="/records" component={ Records } />
                                    <Route path="/version" component={ Version } />
                                    <Route path="/preference" component={ Preference } />

                                </Switch>
                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
            </Router>
        </StoreProvider>
    );
}