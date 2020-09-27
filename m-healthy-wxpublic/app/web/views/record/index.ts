
/** 报告模块 */
const module = {
    path: 'record',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 报告列表 */
            path: 'body-check',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./list/index.vue')), 'demo')
        }, {
            /** 体检报告详情 */
            path: 'body-check-detail/:id',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./body-check-detail/index.vue')), 'demo')
        },
        {
            /** 体检报告详情(兼容旧版本) */
            path: 'body-check/:id',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./body-check-detail/index.vue')), 'demo')
        },
        {
            /** 门诊化验报告详情 */
            path: 'examination-detail/:id',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./examination-detail/index.vue')), 'demo')
        }
    ]
};

export default module;