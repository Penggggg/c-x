/** 报告模块 */
var module = {
    path: 'questionnaire',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 体检报告 */
            path: 'result',
            // component: ( ) => import('./body-check/list/index.vue'),
            // component: resolve => (require as any)(['./body-check/list/index.vue'], resolve )
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./result/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map