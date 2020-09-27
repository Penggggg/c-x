
/** 我的订单模块 */
const module = {
    path: 'my-order',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 我的订单列表 */
            path: 'list',
            // component: ( ) => import('./list/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./list/index.vue')), 'demo')
        }, {
            /** 我的订单详情 */
            path: 'detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./detail/index.vue')), 'demo')
        }
    ]
};

export default module;