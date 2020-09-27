/** 我的订单模块 */
var module = {
    path: 'my-order',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 我的订单列表 */
            path: 'list',
            // component: ( ) => import('./list/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./list/index.vue')); }, 'demo'); }
        }, {
            /** 我的订单详情 */
            path: 'detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./detail/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map