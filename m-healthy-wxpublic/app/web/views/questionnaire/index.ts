
/** 报告模块 */
const module = {
    path: 'questionnaire',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 体检报告 */
            path: 'result',
            // component: ( ) => import('./body-check/list/index.vue'),
            // component: resolve => (require as any)(['./body-check/list/index.vue'], resolve )
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./result/index.vue')), 'demo')
        }
    ]
};

export default module;