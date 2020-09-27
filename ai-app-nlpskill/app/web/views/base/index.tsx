import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { Entry } from './entry';
import { TestPage } from './test';
import { FramesV2 } from './frames-v2';

type TPageBase = { } & RouteComponentProps;

export const Base = ({ location }: TPageBase ) => {

    const prefix = '/base';

    return (
        <div style={{ height: '100%', overflowY: 'scroll' }}>

            {/* 入口 */}
            <Route path={`${prefix}/entry`} component={ Entry } />

            {/* 测试 */}
            <Route path={`${prefix}/test`} component={ TestPage } />

            {/* 流程配置 v2 */}
            <Route path={`${prefix}/frames-v2`} component={ FramesV2 } />

        </div>
    );
}