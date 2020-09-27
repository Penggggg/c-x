import { Layout, Card, Spin } from 'antd';
import { useObserver } from 'mobx-react-lite';
import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useStore } from '../../store';
import { EUserRole } from '../../util/enum';
import { AppHeader } from '../../containers/app-header';
import './index.less'

const { Meta } = Card;
const { Content } = Layout;

export const Home = ( props: RouteComponentProps ) => {

    const history = useHistory( );

    /** store */
    const { UserRole } = useStore( );

    /** 选择界面是否可见 */
    const [ showChoice, showChoice$ ] = useState( false );

    /** 卡片列表 */
    const cards = useState([
        {
            title: '普通用户',
            description: '快速对接算法服务',
            img: '/dist/img/people4.png'
        }, {
            title: '算法研究员',
            description: '管理你的算法服务',
            img: '/dist/img/bear.png'
        }
    ])[ 0 ];

    const go = ( role: EUserRole | null | undefined ) => {

        /** 未选择角色 */
        if ( role === null ) { showChoice$( true );}

        /** 管理员 */
        if ( role === EUserRole.adm ) {
            history.replace('/base/dataset/list');
        }
        /** 普通用户 */
        if ( role === EUserRole.normal ) {
            history.replace('/user/panel');
        }
    }

    /** 检测用户角色 */
    const getUserRole = ( ) => {
        UserRole.initRole( )
            .then( data => go( data ));
    }

    /** 选择角色 */
    const onChoiceRole = ( role: EUserRole ) => {
        UserRole.setRole( role )
            .then(( ) => go( role ));
    }

    /** didMount */
    useEffect(( ) => {
        getUserRole( );
    }, [ ]);

    return useObserver(( ) => (
        <Layout 
            className="p-home"
            style={{ height: '100vh' }} 
        >

            <AppHeader 
                showUser={ false } 
                showUserAlgorithm={ false }
            />

            <Layout style={{ padding: '0 24px 24px' }}>

                {/* 内容层 */}
                <Content
                    style={{
                        margin: 0,
                        padding: 24,
                        background: '#fff'
                    }}
                >
                    <div className="my-content">

                        {/* 检测角色状态 */}
                        {
                            !showChoice && (
                                <div className="cards-block">
                                    <Spin 
                                        size="large"
                                        style={{ marginTop: 100 }}
                                    />
                                </div>
                            )
                        }

                        {/* 选择角色 */}
                        {
                            !!showChoice && (
                                <div className="animated jackInTheBox">
                                    
                                    <div className="content-title">选择你的角色</div>

                                    <div className="cards-block">
                                        {
                                            cards.map(( card, key ) => (
                                                <div
                                                    key={ key }
                                                    onClick={ e => onChoiceRole( key )}
                                                >
                                                    <Card
                                                        hoverable
                                                        cover={<img src={ card.img } style={{ width: '100%', height: 180 }}　/>}
                                                        style={{ width: 300, height: 320, marginRight: key === 0 ? 90 : 0 }}
                                                    >
                                                        <Meta
                                                            title={ card.title }
                                                            description={ card.description }
                                                        />
                                                    </Card>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }   
                    </div>
                </Content>
            </Layout>

        </Layout>
    ))
}