import React from 'react';
import { Route } from 'react-router-dom';
import { AppConfig } from './app-config';

const prefix = '/base';
export const Base = ( ) => {
    return (
        <div>
            {/* 页面配置 */}
            <Route path={`${prefix}/app-config`} component={ AppConfig } />
        </div>
    )
}