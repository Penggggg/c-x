/** 体征模块 */
var module1 = {
    path: 'body-sign',
    component: function () { return import('./index.vue'); },
    children: [
        {
            /** 设备绑定版本1（废弃） */
            path: 'bind',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./bind/index.vue')); }, 'demo'); }
        }, {
            /** 设备绑定向导 */
            path: 'bind-guide',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./bind-guide/index.vue')); }, 'demo'); }
        }, {
            /** 已绑定设备列表 */
            path: 'bound-device/:sc',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./bound-device/index.vue')); }, 'demo'); }
        }, {
            /** 用户身份绑定 */
            path: 'account-bind',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./account-bind/index.vue')); }, 'demo'); }
        }, {
            /** 设备绑定 —— 版本2 */
            path: 'device-bind',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./device-bind/index.vue')); }, 'demo'); }
        }, {
            /** 列表 */
            path: 'list',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./list/index.vue')); }, 'demo'); }
        }, {
            /** 血压-展示 */
            path: 'xueya-show',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./xueya/show/index.vue')); }, 'demo'); }
        }, {
            /** 血压-录入 */
            path: 'xueya-input',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./xueya/input/index.vue')); }, 'demo'); }
        }, {
            /** 血糖-展示 */
            path: 'xuetang-show',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./xuetang/show/index.vue')); }, 'demo'); }
        }, {
            /** 血糖-录入 */
            path: 'xuetang-input',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./xuetang/input/index.vue')); }, 'demo'); }
        }, {
            /** 在线咨询 */
            path: 'consultation',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./consultation/index.vue')); }, 'demo'); }
        },
        // {
        //     /** 报告分析-入口 */
        //     path: 'analys-entry',
        //     component: resolve => (require as any).ensure([], () => resolve((require as any)('./analys-entry/index.vue')), 'demo')
        // }, 
        {
            /** 报告分析 */
            path: 'analys-entry',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./analys/index.vue')); }, 'demo'); }
        },
        {
            /** 邀请关注 */
            path: 'invite-follow',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./invite-follow/index.vue')); }, 'demo'); }
        }
    ]
};
export default module1;
//# sourceMappingURL=index.js.map