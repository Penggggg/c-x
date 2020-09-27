import React from 'react';
import { Route } from 'react-router-dom';
import { MyEntity } from './myentity';
import { SysEntity } from './sysentity';
import './index.less';

export const Entity = () => {
  const prefix = '/entity';

  return (
    <div style={{ height: '100%', overflowY: 'scroll' }}>
      {/* 主页 */}
      <Route path={`${prefix}/my`} component={ MyEntity } />
      <Route path={`${prefix}/sys`} component={ SysEntity } />
    </div>
  );

}