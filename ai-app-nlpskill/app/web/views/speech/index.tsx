import { useQuery } from '@cvte/ai-web-util/hooks'; 
import React, { useState, useMemo, useEffect } from 'react';
import { Layout, Icon, Button, Divider, Menu, Modal } from 'antd';
import { Route, RouteComponentProps, Link } from 'react-router-dom';
import { SpeechDic } from './dic';
import { SpeechWords } from './dic-words';
import { SpeechEdition } from './edition';
import { SpeechSetting } from './setting';
import { SpeechDialogue } from './dialogue';
import { SpeechDialogueText } from './dialogue-text';
import './index.less';
import { http } from '@cvte/ai-web-util/util';
 
const prefix = '/speech';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export const Speech = ({ history }: TPageBase ) => {

    const [ query, queryStr ] = useQuery( );
    const [ selectedKeys, selectedKeys$ ] = useState< string[ ]>([ 'dic' ]);

    const onTrain = ( ) => {
        Modal.confirm({
            title: '提示',
            content: '确定训练吗？',
            onOk: ( ) => {
                http.post< any >({
                    data: {
                        ability_id: query.abilityId
                    },
                    successMsg: '开始训练',
                    url: `/t-apis/v1/voice/training`
                })
            }
        })
    }

    const menu$ = useMemo(( ) => {
        return [{
            key: 'dic',
            title: '词典',
            icon: 'amazon',
            url: `/speech/dic${queryStr}`,
        }, {
            title: '对话范例',
            key: 'dialogue',
            icon: 'aliwangwang',
            url: `/speech/dialogue${queryStr}`,
        }, {
            title: '版本管理',
            icon: 'container',
            key: 'edition',
            url: `/speech/edition${queryStr}`,
        }, {
            title: '偏好设置',
            icon: 'setting',
            key: 'setting',
            url: `/speech/setting${queryStr}`,
        }]
    }, [ queryStr ]);

    useEffect(( ) => {
        const Index = menu$.find( x => x.url.includes( location.pathname ))
        !!Index && selectedKeys$([ Index.key ])
    }, [ ]);

    return (
        <Layout
            className='m-speech'
        >
            {/* 左侧导航 */}
            <Sider 
                width={ 200 } 
                style={{ background: '#fff' }}
            >

                {/* 上方提示 */}
                <div className='banner'>
                    <div 
                        className='banner-back'
                        onClick={( ) => history.goBack( )}
                    >
                        <Icon type='arrow-left' /> 能力列表
                    </div>
                    <div>
                        <span className='banner-title'>
                            <Icon type='smile' theme='twoTone' twoToneColor='#fb8c00' />
                            { decodeURIComponent( query.name || '' )}
                        </span>
                    </div>
                    <div className='banner-btn'>
                        <Button.Group>
                            <Button onClick={ onTrain }>训练</Button>
                            <Button>测试</Button>
                        </Button.Group>
                    </div>
                    <div className='banner-time'>最后更新：暂无</div>
                    <Divider style={{ margin: 0 }} />
                </div>

                {/* 导航 */}
                <Menu
                    mode="inline"
                    selectedKeys={ selectedKeys }
                    style={{ height: '100%', borderRight: 0 }}
                    defaultOpenKeys={ menu$.map( x => x.title )}
                    onClick={ e => selectedKeys$([ e.key ])}
                >
                    {
                        menu$.map(( subMenu: any, key ) =>
                            !!subMenu.items ?
                                <SubMenu
                                    key={ subMenu.key }
                                    title={(
                                        <span>
                                            <Icon type={ subMenu.icon } /> { subMenu.title }
                                        </span>
                                    )}
                                >
                                {
                                    subMenu.items.map(( menu ) => (
                                        <Menu.Item key={ menu.key }>
                                            <Link to={ menu.url }>
                                                { menu.title }
                                            </Link>
                                        </Menu.Item>
                                    ))
                                }
                                </SubMenu> :
                                <Menu.Item key={ subMenu.key }>
                                    <Link to={ subMenu.url }>
                                        <Icon type={ subMenu.icon } />
                                        { subMenu.title }
                                    </Link>
                                </Menu.Item>
                        )
                    }
                </Menu>

            </Sider>

            {/* 子路由 */}
            <Layout 
                style={{ padding: '0 24px 24px' }}
            >
                <Content
                    style={{ background: '#fff', padding: 24, height: '100%',  overflowY: 'scroll' }}
                >
                    {/* 字典 */}
                    <Route path={`${prefix}/dic`} component={ SpeechDic } />

                    {/* 词条 */}
                    <Route path={`${prefix}/words`} component={ SpeechWords } />

                    {/* 对话 */}
                    <Route path={`${prefix}/dialogue`} component={ SpeechDialogue } />

                    {/* 对话 - 文本 */}
                    <Route path={`${prefix}/dialogue-text`} component={ SpeechDialogueText } />

                    {/* 版本 */}
                    <Route path={`${prefix}/edition`} component={ SpeechEdition } />

                    {/* 设置 */}
                    <Route path={`${prefix}/setting`} component={ SpeechSetting } />

                </Content>
            </Layout>
        </Layout>
    );
}

type TPageBase = { } & RouteComponentProps;