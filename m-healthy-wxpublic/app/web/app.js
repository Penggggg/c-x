import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './views/router';
export var createApp = function () {
    var router = createRouter();
    var app = new Vue({
        router: router,
        render: function (h) { return h(App); },
    });
    return { app: app, router: router };
};
//# sourceMappingURL=app.js.map