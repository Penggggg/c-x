/** 报告模块 */
var module = {
    path: 'record',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 报告列表 */
            path: 'body-check',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./list/index.vue')); }, 'demo'); }
        }, {
            /** 体检报告详情 */
            path: 'body-check-detail/:id',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./body-check-detail/index.vue')); }, 'demo'); }
        },
        {
            /** 体检报告详情(兼容旧版本) */
            path: 'body-check/:id',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./body-check-detail/index.vue')); }, 'demo'); }
        },
        {
            /** 门诊化验报告详情 */
            path: 'examination-detail/:id',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./examination-detail/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map