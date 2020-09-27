/** 健康卡模块 */
var module = {
    path: 'health-card',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 我的健康卡 */
            path: 'my',
            // component: ( ) => import('./my/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./my/index.vue')); }, 'demo'); }
        }, {
            /** 健康卡详情 */
            path: 'detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./detail/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map