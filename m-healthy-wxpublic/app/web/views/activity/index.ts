
/** 账号模块 */
const module = {
    path: 'activity',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 供应商活动页：领取健康卡 */
            path: 'gys',
            component: resolve => (require as any).ensure([ ], ( ) => resolve((require as any)('./gys/index.vue')), 'demo')
        }
    ]
};

export default module;