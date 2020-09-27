/** 健康体检模块 */
var module = {
    path: 'health-check',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 健康体检套餐 */
            path: 'package',
            // component: ( ) => import('./package/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./package/index.vue')); }, 'demo'); }
        }, {
            /** 套餐详情 */
            path: 'detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./detail/index.vue')); }, 'demo'); }
        }, {
            /** 套餐详情(新) */
            path: 'new-detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./new-detail/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map