import { generateDic } from '@cvte/ai-web-util/util'

/** 数据字典 */
export const DIC = {
    // 任务
    task: {

        // 任务角色
        role: [{
            value: 0,
            label: '无权限'
        }, {
            value: 1,
            label: '仅查看'
        }, {
            value: 2,
            label: '可标注'
        }, {
            value: 3,
            label: '可使用（管理员）'
        }],

        // 任务状态
        status: [{
            value: 0,
            label: '初始化中'
        }, {
            value: 1,
            label: '数据同步完成'
        }, {
            value: 2,
            label: '标注中'
        }, {
            value: 3,
            label: '标注完成'
        }]

    }
}

const { findDicCN, findDic } = generateDic( DIC );

export {
    findDicCN,
    findDic
}