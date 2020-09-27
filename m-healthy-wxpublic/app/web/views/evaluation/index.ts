/** 测评模块 */
export default {
    path: 'e',
    component: ( ) => import('./index.vue'),
    children: [
        {
            /** 大厅 */
            path: 'hall',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./hall/index.vue')), 'demo')
        }, {
            /** 问卷入口 */
            path: 'entry/:id',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./entry/index.vue')), 'demo')
        }, {
            /** 测试报告 */
            path: 'r',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./report-result/index.vue')), 'demo')
        }, {
            /** 心理健康双因素量表 */
            path: 'two-factor-result',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./two-factor-result/index.vue')), 'demo')
        }, {
            /** 历史报告 */
            path: 'history/:code',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./history/index.vue')), 'demo')
        },
        {
            /** 扫描问卷二维码 */
            path: 'qrcode-enter',
            component: resolve => (require as any).ensure([], () => resolve((require as any)('./qrcode-enter/index.vue')), 'demo')
        }
    ]
};
