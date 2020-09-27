import React, { } from 'react';
import { Drawer, Tabs } from 'antd';
import { DeployOnline } from '../deploy-online';
import { DeployOffline } from '../deploy-offline';

type TDeployModel = {
    show: boolean
    modelId: string
    onClose: ( ) => void
};

export const DeployModel = ({ show, modelId, onClose }: TDeployModel ) => {

    return (
        <Drawer
            title="发布/部署"
            placement="right"
            width={ 550 }
            closable={ false }
            visible={ show }
            onClose={ onClose }
        >
            <Tabs 
                defaultActiveKey="1" 
            >
                <Tabs.TabPane tab="在线部署" key="1">
                    <DeployOnline 
                        show= { show }
                        onClose={ onClose }
                        modelId={ modelId }
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="离线部署" key="2">
                    <DeployOffline 
                        show= { show }
                        onClose={ onClose }
                        modelId={ modelId }
                    />
                </Tabs.TabPane>
            </Tabs>
        </Drawer>
    );
}