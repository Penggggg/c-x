
/** 通用模块 */
const module = {
    path: 'common',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 协议页面 */
            path: 'protocol',
            // component: ( ) => import('./protocol/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./protocol/index.vue')), 'demo')
        }, {
            /** 订单支付页面，订单id， query: next,pre */
            path: 'order-pay-preview/:orderid',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./order-pay-preview/index.vue')), 'demo')
        }
    ]
};

export default module;