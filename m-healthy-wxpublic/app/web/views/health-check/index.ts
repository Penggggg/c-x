
/** 健康体检模块 */
const module = {
    path: 'health-check',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 健康体检套餐 */
            path: 'package',
            // component: ( ) => import('./package/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./package/index.vue')), 'demo')
        }, {
            /** 套餐详情 */
            path: 'detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./detail/index.vue')), 'demo')
        }, {
            /** 套餐详情(新) */
            path: 'new-detail/:id',
            // component: ( ) => import('./detail/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./new-detail/index.vue')), 'demo')
        }
    ]
};

export default module;