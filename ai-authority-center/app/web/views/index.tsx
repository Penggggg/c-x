import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Base } from './base';

export const router =  (
    <Router>
        <Switch>
            <Route path="/base" component={ Base } />
        </Switch>
    </Router>
);