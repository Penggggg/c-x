import { http } from '@cvte/ai-web-util/util';

// 获取技能列表
export const getSkill = (nlp_ability_id) => {
  return http.get({
    params: { page: 1, size: 999 },
    url: `/t-apis/v1/nlp/skill/${nlp_ability_id}`,
    errorTips: false
  })
}

// 添加技能
export const addSkill = (nlp_ability_id, data) => {
  return http.post({
    data,
    successMsg: '添加成功',
    url: `/t-apis/v1/nlp/skill/${nlp_ability_id}`
  })
}

// 删除技能
export const deleteSkill = (nlp_ability_id, skill_id) => {
  return http.delete({
    successMsg: '删除成功',
    url: `/t-apis/v1/nlp/skill/${nlp_ability_id}/${skill_id}`
  })
}
