import React, { useReducer, useEffect, useImperativeHandle, useRef } from 'react';
import { http } from '@cvte/ai-web-util/util';

import { pageType, tableParamType, actionType, ActionDic } from './type';
import { Table, notification } from 'antd';
import { isArray } from 'util';

type TableProps = {
  columns: Array<any>,
  url?: string,
  dataSource?: Array<any>,
  baseprops?: any,
  fetchParams?: any,
}

export const TableManage = React.forwardRef(({ columns, url, dataSource, fetchParams, baseprops }: TableProps, ref) => {
  useEffect(() => {
    if (dataSource) {
      dispatch({
        type: ActionDic.SET_DATA_SOURCE,
        payload: { dataSource }
      })
    } else {
      fetchData();
    }
  }, [dataSource, columns, fetchParams])

  // 分页数据
  const pagination: pageType = {
    current: 1,
    pageSize: 10,
    total: 0
  }

  // table 组件数据
  const tableParam: tableParamType = {
    loading: false,
    pagination,
    dataSource: []
  }

  const reducer = (state: tableParamType, action: actionType) => {
    const { payload } = action;
    switch (action.type) {
      case ActionDic.TOGGLE_LOADING:
        return { ...state, loading: !state.loading }
      case ActionDic.SET_PAGINATION:
        return { ...state, pagination: payload.pagination }
      case ActionDic.SET_DATA_SOURCE:
        return { ...state, dataSource: payload.dataSource }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, tableParam);

  useImperativeHandle(ref, () => ({
    getData: () => state.dataSource
  }))

  // 页码切换
  const handlePageChange = (payload: any) => {
    if (!payload) return;
    const { current } = payload;

    dispatch({
      type: ActionDic.SET_PAGINATION,
      payload: {
        pagination: {
          ...state.pagination,
          current
        }
      }
    })
    fetchData(payload);
  }

  // 请求数据
  const fetchData = async(page?) => {
    dispatch({ type: ActionDic.TOGGLE_LOADING })

    try {
      const params = { ...fetchParams };
      params.page = page?page.current:pagination.current;
      params.size = page?page.pageSize:pagination.pageSize;
      const res: any = await http.get({ url, params, errorTips: false });
      if (res && res.status && res.status === 200) {
        // 关闭 loading
        dispatch({ type: ActionDic.TOGGLE_LOADING })
        let dataSource: any = res.data;
        if (!isArray(dataSource)) {
          const total_count = dataSource.total_count;
          dataSource = dataSource.instances || dataSource.intentions;
          dispatch({
            type: ActionDic.SET_PAGINATION,
            payload: {
              pagination: { ...state.pagination, total: total_count, current: page?page.current:1 }
            }
          })
        }
        dispatch({
          type: ActionDic.SET_DATA_SOURCE,
          payload: { dataSource }
        })
      } else {
        dispatch({ type: ActionDic.TOGGLE_LOADING });
        let str = "";
        if (res.message) {
          const obj = JSON.parse(res.message || "{}");
          str = obj.message || '请求失败'
        }
        notification.error({
          message: '提示',
          description: str || '请求失败'
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
      dispatch({ type: ActionDic.TOGGLE_LOADING });
      // notification.error({
      //   message: '提示',
      //   description: '请求出错'
      // });
    }
  }

  return (
    <Table
      columns={columns}
      pagination={state.pagination}
      dataSource={state.dataSource || []}
      loading={state.loading}
      onChange={handlePageChange}
      {...baseprops}
    />
  )
})