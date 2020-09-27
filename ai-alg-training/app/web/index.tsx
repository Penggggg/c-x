import * as React from "react";
import * as ReactDOM from "react-dom";
import { router } from './views';
import 'antd/dist/antd.min.css';

ReactDOM.render(
    router,
    document.getElementById("example")
);


if ((module as any).hot) {
    (module as any).hot.accept();
}