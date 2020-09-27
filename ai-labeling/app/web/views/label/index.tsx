import React from 'react';
import { Route } from 'react-router-dom';
import { Working } from './working';

/**
 * @description
 * 标注模块
 */
export const Label = ( ) => {

    const prefix = '/label';

    return (
        <div style={{ height: '100%', overflowY: 'scroll' }}>
            {/* 标注工作流程 模块 */}
            <Route path={`${prefix}/working`} component={ Working } />
        </div>
    );
}