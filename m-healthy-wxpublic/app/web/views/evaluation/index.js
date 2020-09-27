/** 测评模块 */
export default {
    path: 'e',
    component: function () { return import('./index.vue'); },
    children: [
        {
            /** 大厅 */
            path: 'hall',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./hall/index.vue')); }, 'demo'); }
        }, {
            /** 问卷入口 */
            path: 'entry/:id',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./entry/index.vue')); }, 'demo'); }
        }, {
            /** 测试报告 */
            path: 'r',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./report-result/index.vue')); }, 'demo'); }
        }, {
            /** 心理健康双因素量表 */
            path: 'two-factor-result',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./two-factor-result/index.vue')); }, 'demo'); }
        }, {
            /** 历史报告 */
            path: 'history/:code',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./history/index.vue')); }, 'demo'); }
        },
        {
            /** 扫描问卷二维码 */
            path: 'qrcode-enter',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./qrcode-enter/index.vue')); }, 'demo'); }
        }
    ]
};
//# sourceMappingURL=index.js.map