import { http } from '@cvte/ai-web-util/util';

// table
// export const getIntention = (nlp_ability_id, params) => {
//   return http.get({
//     params,
//     url: `/t-apis/v1/nlp/intention/${nlp_ability_id}`
//   })
// }

export const addIntention = (nlp_ability_id, data, type?) => {
  return http.post({
    data,
    errorTips: !type?true:false,
    successMsg: !type?'添加成功':null,
    url: `/t-apis/v1/nlp/intention/${nlp_ability_id}`
  })
}

export const updateIntention = (nlp_ability_id, intention_id, data) => {
  return http.put({
    data,
    successMsg: '修改成功',
    url: `/t-apis/v1/nlp/intention/${nlp_ability_id}/${intention_id}`
  })
}

export const deleteIntention = (nlp_ability_id, intention_id) => {
  return http.delete({
    successMsg: '删除成功',
    url: `/t-apis/v1/nlp/intention/${nlp_ability_id}/${intention_id}`
  })
}
