
/** 报告模块 */
const module = {
    path: 'appointment',
    component: ( ) => import('./index/index.vue'),
    children: [
        {
            /** 体检报告 */
            path: 'main',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./main/index.vue')), 'demo')
        },
        {
            /** 门诊预约 */
            path: 'order',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./outpatient-order/index.vue')), 'demo')
        },
        {
            /** 填写预约信息 (旧) */
            path: 'orderform',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./order-form/index.vue')), 'demo')
        },
        {
            /** 填写预约信息（新） */
            path: 'deptorderform',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./dept-order-form/index.vue')), 'demo')
        },
        {
            /** 微信支付相关页面 */
            path: 'wechatpay',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./wechat-pay/index.vue')), 'demo')
        },
        {
            /** 预约订单记录 */
            path: 'record',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./medical-record/index.vue')), 'demo')
        },
        {
            /** 选择医生列表 */
            path: 'doctors',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./select-doctor/index.vue')), 'demo')
        },
        {
            /** 个人信息 */
            path: 'person',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./person/index.vue')), 'demo')
        },
        {
            /** 知识 */
            path: 'knowledge',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./knowledge/index.vue')), 'demo')
        },
        {
             /** 视源健康课 */
             path: 'lessons',
             component: resolve => (require as any).ensure([], () => resolve((require as any)('./lesson/index.vue')), 'demo')
        },
        {
             /** 关于系统（提醒用户使用体统的关键点） */
             path: 'about-program',
             component: resolve => (require as any).ensure([], () => resolve((require as any)('./about-program/index.vue')), 'demo')
        }
    ]
};

export default module;