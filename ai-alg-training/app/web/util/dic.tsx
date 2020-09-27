import { generateDic } from '@cvte/ai-web-util/util'

/** 数据字典 */
export const DIC = {
    // 数据集
    dataset: {
        is_training: [{
            value: -1,
            label: '不在训练'
        }, {
            value: 1,
            label: '训练中'
        }]
    },
    // 模型
    model: {
        shelves: [{
            value: 0,
            label: '未上架'
        }, {
            value: 1,
            label: '已上架'
        }],
        version_state: [{
            value: -2,
            label: '模型取消训练'
        }, {
            value: -1,
            label: '模型训练失败'
        }, {
            value: 0,
            label: '正在排队'
        }, {
            value: 1,
            label: '正在训练'
        }, {
            value: 2,
            label: '模型训练成功'
        }, {
            value: 3,
            label: '正在打包'
        }, {
            value: 4,
            label: '打包完成'
        }, {
            value: 5,
            label: '打包失败'
        }]
    },
    // 训练
    train: {
        state: [{
            value: -2,
            label: '取消训练'
        }, {
            value: -1,
            label: '训练失败'
        }, {
            value: 0,
            label: '默认状态'
        }, {
            value: 1,
            label: '正在训练'
        }, {
            value: 2,
            label: '训练成功'
        }, {
            value: 3,
            label: '全部'
        }]
    },
    // 部署
    deploy: {
        type: [{
            value: 1,
            label: '在线部署'
        }, {
            value: 2,
            label: '离线部署'
        }],
        state: [{
            value: 1,
            label: '创建中'
        }, {
            value: 2,
            label: '部署成功'
        }, {
            value: 3,
            label: '错误'
        }, {
            value: 4,
            label: '注册'
        }]
    },
    // 项目
    project: {
        envType: [{
            value: 1,
            label: '开发'
        }, {
            value: 2,
            label: '测试'
        }, {
            value: 3,
            label: '预发布环境'
        }, {
            value: 4,
            label: '容灾环境'
        }, {
            value: 5,
            label: '生产环境'
        }]
    }
}

const { findDicCN, findDic } = generateDic( DIC );

export {
    findDicCN,
    findDic
}