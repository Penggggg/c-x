import React from 'react';
import { Route } from 'react-router-dom';
import { List } from './list';

const prefix = '/base/train';
export const Train = ( ) => {
    return (
        <div>
            {/* 列表 */}
            <Route path={`${prefix}/list`} component={ List } />
        </div>
    )
}