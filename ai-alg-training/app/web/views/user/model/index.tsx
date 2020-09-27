import { Layout, Menu, Icon } from 'antd';
import { useList } from '@cvte/ai-web-util/hooks';
import React, { useEffect, useState, useMemo } from 'react';
import { RouteComponentProps, Link, Route, useHistory } from 'react-router-dom';

import { My } from './my';
import { Train } from './train';
import { Deploy } from './deploy';
import { YuyinTrain } from './yuyin-train';
import { MyDeployList } from './deploy-list';
import { findAlgorithmCover } from '../../../util/const';
import './index.less';

type TPModel = { } & RouteComponentProps;

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

export const Model = ({ match, location }: TPModel ) => {

    const history = useHistory( );

    /** 算法id */
    const [ aid, aid$ ] = useState('');

    /** 算法下标 */
    const [ aIndex, aIndex$ ] = useState( '' );

    /** menu */
    const [ selectedKeys, selectedKeys$ ] = useState< string[ ]>([ ]);

    /** 算法详情 */
    const [ algorithm, algorithm$ ] = useList<any>({ listUrl: `/t-apis/algorithm/detail` });

    /** 获取算法详情 */
    const checkAlgorithm = ( ) => {
        const { aid, index } = (match as any).params;
        aid$( aid );
        aIndex$( index );
        algorithm$.load(`?algorithm_id=${aid}`)
    }

    /** 根据当前url设置menu的选中 */
    const checkMenuUrl = ( ) => {
        const { pathname } = location;
        for ( let i = 0; i < appMenu$.length; i++ ) {
            const items = appMenu$[ i ].items;
            if ( !items ) { return;}

            for ( let j = 0; j < items.length; j++ ) {
                if ( items[ j ].url.includes( pathname )) {
                    const targetKey = `${i}-${j}`;
                    if ( targetKey === selectedKeys[ 0 ]) { return; }
                    selectedKeys$([ targetKey ])
                }
            }
        }
    }
 
    /** url前缀 */
    const prefix$ = useMemo(
        ( ) => `/user/model/${aid}/${aIndex}`, 
        [ aid, aIndex ]
    )

        /** 左侧导航条 */
    const appMenu$ = useMemo(
        ( ) => {
            const meta: any = [{
                title: '模型中心',
                icon: 'bar-chart',
                items: [{
                    title: '我的模型',
                    url: `${prefix$}/my`,
                }, {
                    title: '训练模型',
                    url: `${prefix$}/train`
                }, {
                    title: '部署模型',
                    url: `${prefix$}/deploy`
                }]
            }]

            if ( !!aIndex && aIndex.includes('语')) {
                meta.push({
                    title: '语音小工具',
                    icon: 'notification',
                    items: [{
                        title: '标注',
                        url: `${prefix$}/yuyin-train`
                    }]
                })
            }

            return meta;
        }, [ prefix$, aIndex ]
    );

    /** 检查 */
    useEffect(( ) => {
        checkMenuUrl( );
    });

    /** didMount */
    useEffect(( ) => {
        checkAlgorithm( )
    }, [ ])

    return (
        <div className="user-model animated fadeIn">

            {/* 返回按钮 */}
            <div
                className="back-icon"
                onClick={( ) => history.replace(`/user/panel`)}
            >
                <Icon 
                    type="arrow-left" 
                />
            </div>
            
            {/* 头部 */}
            <div className="top-block">

                <img 
                    src={ findAlgorithmCover( aIndex ) || `/dist/img/ai-${aIndex}.jpg`}
                />

                <div className="text-block">
                    <div className="title">{(algorithm as any).algorithm_name }</div>
                    <p className="content">{(algorithm as any).description }</p>
                </div>

            </div>

            {/* 内容 */}
            <Layout
                className="content-block"
            >
                {/* 侧边栏 */}
                <Sider
                    width={ 200 }
                >
                    <Menu
                        mode="inline"
                        selectedKeys={ selectedKeys }
                        onClick={ e => selectedKeys$([ e.key ])}
                        style={{ height: '100%', borderRight: 0 }}
                        defaultOpenKeys={ appMenu$.map( x => x.title )}
                    >
                        {
                            appMenu$.map(( subMenu: any, key ) => 
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
                
                <Content 
                    style={{ borderLeft: '15px solid #fafafa' }}
                >

                    {/* 我的模型（需要aid参数） */}
                    <Route 
                        path={`${prefix$}/my`} 
                        render={( ) => <My aid={ aid } aIndex={ aIndex } />} 
                    />

                    {/* 训练模型（需要aid参数）*/}
                    <Route 
                        path={`${prefix$}/train`} 
                        render={( ) => <Train aid={ aid } aIndex={ aIndex } />} 
                    />

                    {/* 训练模型（需要aid参数）*/}
                    <Route 
                        path={`${prefix$}/yuyin-train`} 
                        render={( ) => <YuyinTrain aid={ aid } aIndex={ aIndex }/>} 
                    />

                    {/* 部署模型 */}
                    <Route path={`${prefix$}/deploy`} component={ Deploy } />

                    {/* 我的部署 */}
                    <Route path={`${prefix$}/deploied`} component={ MyDeployList } />

                </Content>
            </Layout>

        </div>
    )
}