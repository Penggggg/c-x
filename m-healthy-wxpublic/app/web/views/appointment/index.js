/** 报告模块 */
var module = {
    path: 'appointment',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 体检报告 */
            path: 'main',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./main/index.vue')); }, 'demo'); }
        },
        {
            /** 门诊预约 */
            path: 'order',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./outpatient-order/index.vue')); }, 'demo'); }
        },
        {
            /** 填写预约信息 (旧) */
            path: 'orderform',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./order-form/index.vue')); }, 'demo'); }
        },
        {
            /** 填写预约信息（新） */
            path: 'deptorderform',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./dept-order-form/index.vue')); }, 'demo'); }
        },
        {
            /** 微信支付相关页面 */
            path: 'wechatpay',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./wechat-pay/index.vue')); }, 'demo'); }
        },
        {
            /** 预约订单记录 */
            path: 'record',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./medical-record/index.vue')); }, 'demo'); }
        },
        {
            /** 选择医生列表 */
            path: 'doctors',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./select-doctor/index.vue')); }, 'demo'); }
        },
        {
            /** 个人信息 */
            path: 'person',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./person/index.vue')); }, 'demo'); }
        },
        {
            /** 知识 */
            path: 'knowledge',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./knowledge/index.vue')); }, 'demo'); }
        },
        {
            /** 视源健康课 */
            path: 'lessons',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./lesson/index.vue')); }, 'demo'); }
        },
        {
            /** 关于系统（提醒用户使用体统的关键点） */
            path: 'about-program',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./about-program/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map