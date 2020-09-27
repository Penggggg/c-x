import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from './views';
import 'antd/dist/antd.min.css';

ReactDOM.render(
    <App />,
    document.getElementById("example")
);


if ((module as any).hot) {
    (module as any).hot.accept();
}