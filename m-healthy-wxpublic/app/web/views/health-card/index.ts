
/** 健康卡模块 */
const module = {
    path: 'health-card',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 我的健康卡 */
            path: 'my',
            // component: ( ) => import('./my/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./my/index.vue')), 'demo')
        }, {
            /** 健康卡详情 */
            path: 'detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./detail/index.vue')), 'demo')
        }
    ]
};

export default module;