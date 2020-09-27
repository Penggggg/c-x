
// 分页数据
export interface pageType {
  current: number,
  pageSize: number,
  total: number
}

// table 基础数据
export interface tableParamType {
  loading: boolean,
  pagination: pageType,
  dataSource: Array<any>
}

// action 类型
export interface actionType {
  type: string,
  payload?: any
}

export enum ActionDic {
  TOGGLE_LOADING = 'loading',
  SET_PAGINATION = 'page',
  SET_DATA_SOURCE = 'datasource'
}