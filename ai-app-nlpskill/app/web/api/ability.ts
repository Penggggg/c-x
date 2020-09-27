import { http } from '@cvte/ai-web-util/util';

// 获取所有能力，单个能力，返回数据相同（单个未用上）
export const getAbility = () => {
  return http.get({
    errorTips: false,
    url: `/t-apis/v1/alglib`
  })
}

export const addAbility = data => {
  return http.post({
    data,
    successMsg: '创建成功',
    url: `/t-apis/v1/algorithmn`
  })
}

export const updateAbility = data => {
  return http.put({
    data,
    successMsg: '修改成功',
    url: `/t-apis/v1/algorithmn/${data.algorithmn_id}`
  })
}

export const deleteAbility = (algorithmn_id) => {
  return http.delete({
    successMsg: '删除成功',
    url: `/t-apis/v1/algorithmn/${algorithmn_id}`
  })
}

export const getScene = (domain) => {
  return http.get({
    params: { domain },
    url: `/t-apis/v1/scene`
  })
}