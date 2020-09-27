import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import { AppHeader } from '../../containers/app-header';
import { Panel } from './panel';
import { Model } from './model';

type TUser = { } & RouteComponentProps;

const { Content } = Layout;

export const User = ({ location, match }: TUser ) => {

    const prefix = '/user';

    /** 当前最新的Model路径下的算法参数, 给Model组件提供刷新功能 */
    const [ aid, aid$ ] = useState('');

    /** 让 model 组件仅在 adi更新的情况下 进行刷新 */
    useEffect(( ) => {
        const { pathname } = location;
        if ( pathname.startsWith('/user/model')) {
            aid$( pathname.split('/')[ 3 ]);
        } 
    });

    return (
        <Layout 
            className="p-base"
            style={{ height: '100vh' }} 
        >

            {/* 头部logo */}
            <AppHeader 
                showUser={ true } 
                showUserAlgorithm={ true }
            />

            <Layout>
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
                                height: '100%',
                                background: '#fff'
                            }}
                        >

                            {/* 选择面板 */}
                            <Route path={`${prefix}/panel`} component={ Panel } />

                            {/* 模型详情 */}
                            <Route
                                key={ aid }
                                component={ Model } 
                                path={`${prefix}/model/:aid/:index`} 
                            />

                        </div>
                        </Content>
                </Layout>
            </Layout>

        </Layout>
    )
}