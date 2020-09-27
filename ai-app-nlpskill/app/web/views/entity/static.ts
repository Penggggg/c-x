// 数据列表字段
export const headerType = ['entity_name', 'dictionary_value', 'dictionary_type', 'dictionary_synonyms'];

// 导入功能模板数据
export const demoContent =
`实体名,词条名,词条类型,词条列表
食物,米饭,同义词,大米|小米
食物,豆类,同义词,黄豆|绿豆|眉豆
城市,北京,同义词,首都`;

// 导入功能操作说明
export const illustration =
`1、行与行之间数据分隔符为换行符，字段间分隔符为","(英文状态下逗号)，请勿更改

2、如果一个实体对应多个词条信息，需拆分为多条数据行；
如果词条列表中有多项，直接使用” | “ 符号分隔开。
示例：
原数据：
[{
  entity_name: '食物',
  dictionary_list: [{
    value: '米饭',
    data_type: '同义词',
    synonyms: ["大米","小米"]
  }, {
    value: '豆子',
    data_type: '同义词',
    synonyms: ["黄豆","绿豆","眉豆"]
  }]
}, {
  entity_name: '城市',
  dictionary_list: [{
    value: '北京',
    data_type: '同义词',
    synonyms: ["首都"]
  },
}]
数据中“米饭”和“豆子”类别都归属于”食物“实体，需拆分为两条数据行；
"黄豆"、"绿豆"和"眉豆"同属于”豆类“词条，使用” | “分开
(提示：目前词条类型仅支持同义词和正则表达式两种)

综上，导入时数据格式为：
实体名,词条名,词条类型,词条列表
食物,米饭,同义词,大米|小米
食物,豆类,同义词,黄豆|绿豆|眉豆
城市,北京,同义词,首都
`