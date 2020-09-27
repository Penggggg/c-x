import React from 'react';
import { Route } from 'react-router-dom';
import { List } from './list';
import { modelDetail } from './model-detail';
 
const prefix = '/base/algorithm';
export const Algorithm = ( ) => {
    return (
        <div>
            {/* 列表 */}
            <Route path={`${prefix}/list`} component={ List } />
            {/* 模型详情 */}
            <Route path={`${prefix}/model/:id`} component={ modelDetail } />
        </div>
    )
}