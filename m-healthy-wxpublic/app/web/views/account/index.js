/** 账号模块 */
var module = {
    path: 'account',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 个人页面 */
            path: 'personal',
            // component: ( ) => import('./bind/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./bind/index.vue')); }, 'demo'); }
        }, {
            /** 绑定 */
            path: 'bind',
            // component: ( ) => import('./bind-v2/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./bind-v2/index.vue')); }, 'demo'); }
        }, {
            /** 已经绑定过 */
            path: 'has-bind',
            // component: ( ) => import('./has-bind/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./has-bind/index.vue')); }, 'demo'); }
        }, {
            /** 注册 */
            path: 'register',
            // component: ( ) => import('./register/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./register/index.vue')); }, 'demo'); }
        }, {
            /** 添加家属成员 */
            path: 'add-members',
            // component: ( ) => import('./add-members/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./add-members/index.vue')); }, 'demo'); }
        }, {
            /** 管理家属成员 */
            path: 'family-members',
            // component: ( ) => import('./family-members/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./family-members/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map