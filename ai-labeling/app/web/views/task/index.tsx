import React from 'react';
import { Route } from 'react-router-dom';
import { TaskRole } from './roles';

/**
 * @description
 * 任务模块
 */
export const Task = ( ) => {

    const prefix = '/task';

    return (
        <div style={{ height: '100%', overflowY: 'scroll' }}>
            {/* 图片标注模块 */}
            <Route path={`${prefix}/roles`} component={ TaskRole } />
        </div>
    );
}