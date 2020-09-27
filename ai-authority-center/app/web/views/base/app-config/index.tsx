import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AppPageConfig } from '../../../containers/app-page-config';
import { AppAuthConfig } from '../../../containers/app-auth-config';
import { Tabs } from 'antd'
import './index.less';

export const AppConfig = ( props: RouteComponentProps ) => {

    
    /** didMount */
    useEffect(( ) => {

    }, [ ]);

    return (
        <div className="p-page-config">
            <Tabs 
                defaultActiveKey="1" 
            >
                <Tabs.TabPane
                    key="1"
                    tab="页面配置" 
                >
                    <AppPageConfig 
                        router={ props }
                    />
                </Tabs.TabPane>
                <Tabs.TabPane
                    key="2"
                    tab="权限配置" 
                >
                    <AppAuthConfig
                        router={ props }
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}