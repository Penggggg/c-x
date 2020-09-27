import {  } from '@cvte/ai-web-util/util';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import {App} from '../views';
import { Ability } from './ability';
import { Speech } from './speech';
import { StoreProvider } from '../store';

 const router = () => {
  return (
    <StoreProvider>
      <BrowserRouter basename={!window.__POWERED_BY_QIANKUN__?'':'nlpskill'}>
        <Switch>
          <Route path="/ability" exact component={Ability} />
          <Route path="/speech" component={ Speech } />
          <Redirect exact from="/" to="/ability" />
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default router();
