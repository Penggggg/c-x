import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DeployOnlineNormal } from '../../../../containers/deploy-online-normal';
import { DeployOfflineNormal } from '../../../../containers/deploy-offline-normal';
import './index.less';

type TDeploy = {

} & RouteComponentProps

export const Deploy = ({ location, match }: TDeploy ) => {

    /** 算法id */
    const [ aid, aid$ ] = useState('');

    /** 默认的版本id */
    const [ defaultVersion, defaultVersion$ ] = useState('');

    /** 获取默认版本 */
    const getDefaultVersion = ( ) => {

        const { path } = match;
        const { search } = location;

        /** 算法id */
        aid$(
            path.split('/').filter( x => !!x )[ 2 ]
        );

        /** 默认版本的query参数 */
        if ( search.startsWith('?')) {
            const queryArr = search.slice(1).split('&');
            const vIndex = queryArr.findIndex( x => x.startsWith('v='));

            if ( vIndex !== -1 ) {
                defaultVersion$( queryArr[ vIndex ].split('=')[ 1 ])
            }
        }
    }

    /** didMount */
    useEffect(( ) => {
        getDefaultVersion( );
    }, [ ]);

    return (
        <div className="p-model-deploy animated fadeIn">

            <div className="title">
                部署模型
            </div>

            <div className="content-block">
                <Tabs 
                    defaultActiveKey="1" 
                >
                    <Tabs.TabPane tab="在线部署" key="1">
                        <DeployOnlineNormal 
                            aid={ aid }
                            defaultVersion={ defaultVersion }
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="离线部署" key="2">
                        <DeployOfflineNormal 
                            aid={ aid }
                            defaultVersion={ defaultVersion }
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>

        </div>
    )
}