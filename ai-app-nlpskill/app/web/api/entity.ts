import { http } from '@cvte/ai-web-util/util';

// table
// export const getEntity = params => {
//   return http.get({
//     params,
//     url: `/t-apis/v1/nlp/entity`
//   })
// }

export const addEntity = (nlp_ability_id, data, type?) => {
  return http.post({
    data,
    errorTips: !type?true:false,
    successMsg: !type?'添加成功':null,
    url: `/t-apis/v1/nlp/entity/${nlp_ability_id}`
  })
}

export const updateEntity = (nlp_ability_id, entity_id, data) => {
  return http.put({
    data,
    successMsg: '修改成功',
    url: `/t-apis/v1/nlp/entity/${nlp_ability_id}/${entity_id}`
  })
}

export const deleteEntity = (nlp_ability_id, entity_id) => {
  return http.delete({
    successMsg: '删除成功',
    url: `/t-apis/v1/nlp/entity/${nlp_ability_id}/${entity_id}`
  })
}

// 获取系统实体 --- table
// export const getSysEntity = params => {
//   return http.get({
//     params,
//     url: `/t-apis/v1/nlp/sysEntity`
//   })
// }

// 系统实体开关
export const switchSysEntity = (nlp_ability_id, data) => {
  return http.put({
    data,
    successMsg: '操作成功',
    url: `/t-apis/v1/nlp/sysEntity/${nlp_ability_id}`
  })
}