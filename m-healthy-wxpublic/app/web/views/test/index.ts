
/** 报告模块 */
const module = {
    path: 'test',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            path: 'wx',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./wx/index.vue')), 'demo')
        },
    ]
};

export default module;