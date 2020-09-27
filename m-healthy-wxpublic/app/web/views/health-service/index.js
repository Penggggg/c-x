/** 账号模块 */
var module = {
    path: 'health-service',
    component: function () { return import('./index.vue'); },
    children: [
        {
            /** 就诊记录 */
            path: 'clinic-record',
            // component: ( ) => import('./bind/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./clinic-record/index.vue')); }, 'demo'); }
        },
        {
            /** 就诊记录列表 */
            path: 'clinic-list/:id',
            // component: ( ) => import('./bind/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./clinic-list/index.vue')); }, 'demo'); }
        },
        {
            /** 就诊记录详情 */
            path: 'clinic-detail/:id',
            // component: ( ) => import('./bind/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./clinic-detail/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map