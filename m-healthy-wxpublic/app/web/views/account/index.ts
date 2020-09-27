
/** 账号模块 */
const module = {
    path: 'account',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 个人页面 */
            path: 'personal',
            // component: ( ) => import('./bind/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./bind/index.vue')), 'demo')
        }, {
            /** 绑定 */
            path: 'bind',
            // component: ( ) => import('./bind-v2/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./bind-v2/index.vue')), 'demo')
        }, {
            /** 已经绑定过 */
            path: 'has-bind',
            // component: ( ) => import('./has-bind/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./has-bind/index.vue')), 'demo')
        }, {
            /** 注册 */
            path: 'register',
            // component: ( ) => import('./register/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./register/index.vue')), 'demo')
        }, {
            /** 添加家属成员 */
            path: 'add-members',
            // component: ( ) => import('./add-members/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./add-members/index.vue')), 'demo')
        }, {
            /** 管理家属成员 */
            path: 'family-members',
            // component: ( ) => import('./family-members/index.vue'),
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./family-members/index.vue')), 'demo')
        }
    ]
};

export default module;