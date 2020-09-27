/** 账号模块 */
var module = {
    path: 'activity',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 供应商活动页：领取健康卡 */
            path: 'gys',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./gys/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map