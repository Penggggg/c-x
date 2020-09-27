/** 通用模块 */
var module = {
    path: 'common',
    component: function () { return import('./index/index.vue'); },
    children: [
        {
            /** 协议页面 */
            path: 'protocol',
            // component: ( ) => import('./protocol/index.vue'),
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./protocol/index.vue')); }, 'demo'); }
        }, {
            /** 订单支付页面，订单id， query: next,pre */
            path: 'order-pay-preview/:orderid',
            component: function (resolve) { return require.ensure([], function () { return resolve(require('./order-pay-preview/index.vue')); }, 'demo'); }
        }
    ]
};
export default module;
//# sourceMappingURL=index.js.map