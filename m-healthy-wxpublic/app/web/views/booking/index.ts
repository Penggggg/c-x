
/** 预约模块 */
const module = {
    path: 'booking',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 门诊体检 */
            path: 'body-check',
            // component: ( ) => import('./body-check/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./body-check/index.vue')), 'demo')
        }, {
            /** 健康卡体检 */
            path: 'health-card/:id',
            // component: ( ) => import('./health-card/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./health-card/index.vue')), 'demo')
        }, {
            /** 体检预约总入口 */
            path: 'all-entrance',
            // component: ( ) => import('./all-entrance/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./all-entrance/index.vue')), 'demo')
        }, {
            /** 体检预约成功提示页面 */
            path: 'health-check/success',
            // component: ( ) => import('./health-check/success.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./health-check/success.vue')), 'demo')
        }, {
            /** 体检预约 */
            path: 'health-check/:id',
            // component: ( ) => import('./health-check/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./health-check/index.vue')), 'demo')
        }
    ]
};

export default module;