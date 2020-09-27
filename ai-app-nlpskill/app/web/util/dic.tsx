import { generateDic } from '@cvte/ai-web-util/util'

/** 数据字典 */
export const DIC = {
    // nlp
    nlp: {
        // 比较符
        operator: {
            input: [
                {
                    value: '==',
                    label: '等于'
                }, {
                    value: '!=',
                    label: '不等于'
                }, {
                    value: 'contain',
                    label: '包含'
                }, {
                    value: 'not contain',
                    label: '不包含'
                }, {
                    value: 're',
                    label: '正则'
                }, {
                    value: 'not exist',
                    label: '未配置'
                }, {
                    value: 'exist',
                    label: '已配置'
                }
            ],
            intent: [
                {
                    value: '>=',
                    label: '置信度大于等于'
                }, {
                    value: '<',
                    label: '置信度小于'
                }
            ],
            slot: [
                {
                    value: '==',
                    label: '等于'
                }, {
                    value: '!=',
                    label: '不等于'
                }, {
                    value: 'exist',
                    label: '存在'
                }, {
                    value: 'not exist',
                    label: '不存在'
                }, {
                    value: 're',
                    label: '正则'
                }
            ],
            variable: [
                {
                    value: '==',
                    label: '等于'
                }, {
                    value: '!=',
                    label: '不等于'
                }, {
                    value: '>',
                    label: '大于'
                }, {
                    value: '<',
                    label: '小于'
                }, {
                    value: '>=',
                    label: '大于等于'
                }, {
                    value: '<=',
                    label: '小于等于'
                }, {
                    value: 're',
                    label: '正则'
                }, {
                    value: 'not exist',
                    label: '未配置'
                }, {
                    value: 'exist',
                    label: '已配置'
                }
            ]
        },
        // 比较范围
        compareRange: [
            {
                value: 'input',
                label: '用户话术中的关键词'
            }, {
                value: 'intent',
                label: '当轮对话中的意图'
            }, {
                value: 'slot',
                label: '当轮对话中的词槽'
            }, {
                value: 'entity',
                label: '实体'
            }, {
                value: 'variable',
                label: '上下文字段'
            }
        ],
        // 如果判断
        if: {
            input: [
                {
                    label: '输入文本',
                    value: 'user-input'
                }
            ]
        },
        // 表单
        form: {
            // 是否必填
            required: [
                {
                    label: '是',
                    value: true
                }, {
                    label: '否',
                    value: false
                }
            ],
            // 字段类型
            fieldType: [
                {
                    label: '字符串',
                    value: 'string'
                }, {
                    label: '数字',
                    value: 'float'
                }
            ],
            // 返回方式，
            sayMode: [
                {
                    label: '按顺序',
                    value: 'sequential'
                }, {
                    label: '随机',
                    value: 'random'
                }
            ],
            // 参数位置
            paramPos: [
                {
                    label: '头部 header',
                    value: 'header'
                }, {
                    label: '请求体 body',
                    value: 'body'
                }, {
                    label: '查询串 query',
                    value: 'query'
                }
            ],
            // 参数类型
            paramType: [
                {
                    label: '自定义',
                    value: 'custom'
                }, {
                    label: '指定槽位',
                    value: 'slot'
                }, {
                    label: '上下文',
                    value: 'context'
                }
            ]
        },
        // 人工客服
        human_agent: {
            // 携带聊天记录
            log: [{
                label: '是',
                value: 1
            }, {
                label: '否',
                value: 0
            }]
        },
        // 准备答复类型
        ready_response: [
            {
                label: '词槽收集',
                value: 'slot'
            }, {
                label: 'API调用',
                value: 'resource'
            }
        ],
        // 执行答复类型
        exec_response: [
            {
                label: '文本',
                value: 'text'
            }, {
                label: '图片',
                value: 'image'
            }, {
                label: '暂停',
                value: 'pause'
            }, {
                label: '选项',
                value: 'my_option'
            }, {
                label: '富文本',
                value: 'rich_text'
            }, {
                label: '人工客服',
                value: 'human_agent'
            }, {
                label: '意图回复',
                value: 'intent'
            }
        ],
        // 话题
        frames: {
            step: [{
                label: '开始',
                value: 'start'
            }, {
                label: '准备答复阶段',
                value: 'ready_response'
            }, {
                label: '结束',
                value: 'end'
            }],
            // 复制会话节点
            copy: [{
                label: '只复制当前话题',
                value: false
            }, {
                label: '连同子话题一起复制',
                value: true
            }]
        }
    },
    // 语音
    speech: {
        // 词条
        words: {
            // 置信度
            confidence: [{
                label: '建议检查',
                value: 0
            }, {
                label: '完全可靠',
                value: 1
            }, {
                label: '已人工标注',
                value: 2
            }]
        },
        version: {
            type: [{
                label: '开发版本',
                value: 0
            }, {
                label: '历史版本',
                value: 1
            }],
            states: [{
                label: '训练取消',
                value: -2
            }, {
                label: '训练失败',
                value: -1
            }, {
                label: '待训练',
                value: 0
            }, {
                label: '训练中',
                value: 1
            }, {
                label: '训练完成',
                value: 2
            }, {
                label: '运行中',
                value: 3
            }]
        }
    }
}

const { findDicCN, findDic } = generateDic( DIC );

export {
    findDicCN,
    findDic
}