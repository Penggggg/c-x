import React from 'react';
import { Route } from 'react-router-dom';
import { Main } from './main';

const prefix = '/base/swagger';
export const Swagger = ( ) => {
    return (
        <div>
            {/* 列表 */}
            <Route path={`${prefix}/main`} component={ Main } />
        </div>
    )
}