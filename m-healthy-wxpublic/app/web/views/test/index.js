/** 报告模块 */
var module = {
    path: 'test',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            path: 'wx',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./wx/index.vue')); }, 'demo'); }
        },
    ]
};
export default module;
//# sourceMappingURL=index.js.map