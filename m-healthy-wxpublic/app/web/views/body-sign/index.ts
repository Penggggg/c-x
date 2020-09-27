/** 体征模块 */
const module1 = {
    path: 'body-sign',
    component: ( ) => import('./index.vue'),
    children: [
        {
            /** 设备绑定版本1（废弃） */
            path: 'bind',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./bind/index.vue')), 'demo')
        }, {
            /** 设备绑定向导 */
            path: 'bind-guide',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./bind-guide/index.vue')), 'demo')
        },{
            /** 已绑定设备列表 */
            path: 'bound-device/:sc',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./bound-device/index.vue')), 'demo')
        }, {
            /** 用户身份绑定 */
            path: 'account-bind',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./account-bind/index.vue')), 'demo')
        }, {
            /** 设备绑定 —— 版本2 */
            path: 'device-bind',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./device-bind/index.vue')), 'demo')
        }, {
            /** 列表 */
            path: 'list',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./list/index.vue')), 'demo')
        }, {
            /** 血压-展示 */
            path: 'xueya-show',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./xueya/show/index.vue')), 'demo')
        }, {
            /** 血压-录入 */
            path: 'xueya-input',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./xueya/input/index.vue')), 'demo')
        }, {
            /** 血糖-展示 */
            path: 'xuetang-show',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./xuetang/show/index.vue')), 'demo')
        }, {
            /** 血糖-录入 */
            path: 'xuetang-input',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./xuetang/input/index.vue')), 'demo')
        }, {
            /** 在线咨询 */
            path: 'consultation',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./consultation/index.vue')), 'demo')
        }, 
        // {
        //     /** 报告分析-入口 */
        //     path: 'analys-entry',
        //     component: resolve => (require as any).ensure([], () => resolve((require as any)('./analys-entry/index.vue')), 'demo')
        // }, 
        {
            /** 报告分析 */
            path: 'analys-entry',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./analys/index.vue')), 'demo')
        },
        {
            /** 邀请关注 */
            path: 'invite-follow',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./invite-follow/index.vue')), 'demo')
        }
    ]
};

export default module1;