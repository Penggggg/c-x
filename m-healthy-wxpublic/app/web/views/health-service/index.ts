
/** 账号模块 */
const module = {
    path: 'health-service',
    component: ( ) => import('./index.vue'),
    children: [
        {
            /** 就诊记录 */
            path: 'clinic-record',
            // component: ( ) => import('./bind/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./clinic-record/index.vue')), 'demo')
        },
        {
            /** 就诊记录列表 */
            path: 'clinic-list/:id',
            // component: ( ) => import('./bind/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./clinic-list/index.vue')), 'demo')
        },
        {
            /** 就诊记录详情 */
            path: 'clinic-detail/:id',
            // component: ( ) => import('./bind/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./clinic-detail/index.vue')), 'demo')
        }
    ]
};

export default module;