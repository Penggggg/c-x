import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { Base } from './base';
import { Home } from './home';
import { User } from './user';
import { Test } from './test';
import { StoreProvider } from '../store';
import './index.less';

export const router = (
    <StoreProvider>
        <Router>
            <Switch>
                <Route path="/base" component={ Base } />
                <Route path="/home" component={ Home } />
                <Route path="/user" component={ User } />
                <Route path="/test" component={ Test } />
                <Redirect exact from="/" to="/home" />
            </Switch>
        </Router>
    </StoreProvider>
);