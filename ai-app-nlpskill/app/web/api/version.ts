import { http } from '@cvte/ai-web-util/util';

// 获取版本 -- table
// export const getVersion = nlp_ability_id => {
//   return http.get({
//     url: `/t-apis/v1/nlp/version/${nlp_ability_id}`
//   })
// }

// 保存版本
export const saveVersion = data => {
  return http.post({
    data,
    successMsg: '保存成功',
    url: `/t-apis/v1/nlp/version`
  })
}

// 切换正式部署版本
export const switchVersion = (nlp_ability_id, data) => {
  return http.post({
    data,
    successMsg: '切换成功',
    url: `/t-apis/v1/nlp/version/switch/${nlp_ability_id}`
  })
}

// 保存开发环境配置 -- flow_config
export const saveConfigVersion = data => {
  return http.post({
    data,
    url: `/t-apis/v1/nlp/version/config`
  })
}

// 版本回滚
export const rollbackVersion = (nlp_ability_id, data) => {
  return http.post({
    data,
    successMsg: '操作成功',
    url: `/t-apis/v1/nlp/version/rollback/${nlp_ability_id}`
  })
}

// 全局保存
export const chattingTest = (nlp_ability_id) => {
  return http.post({
    successMsg: '保存成功',
    url: `/t-apis/v1/nlp/version/test/${nlp_ability_id}`
  })
}

