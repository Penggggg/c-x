import React from 'react';
import { Divider, Modal } from 'antd';

interface ColumnProps {
  entity: { [key: string]: string | any }
  actions: {
    edit?: (param: any) => void
    delete?: (param: any) => void
    customs?: {
      render: any
    }[]
  }
}

interface ColumnType {
  title: string,
  key: string,
  dataIndex?: string,
  render?: any,
  width?: number,
  fixed?: 'left' | 'right',
  align?: 'left' | 'right' | 'center'
}

export const TableColumns = (entity: ColumnProps['entity'], actions?: ColumnProps['actions']) => {
  if (!entity) return [];
  let columns: ColumnType[] = [];

  Object.keys(entity).map(key => {
    if (!entity[key]) return;
    let column: ColumnType = {
      key,
      dataIndex: key,
      title: ''
    }

    if (typeof entity[key] === 'string') {
      column.title = entity[key];
    } else {
      column = {
        ...column,
        ...entity[key]
      }
    }
    columns.push(column)
  })

  if (!!actions) {
    const onDelete = (record) => {
      Modal.confirm({
        title: '确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          !!actions.delete && actions.delete(record) || undefined
        }
      });
    }

    columns.push({
      title: '操作',
      key: 'handle',
      align: 'center',
      render: (text: string, record: object) => (
        <>
          {
            (actions.customs || []).map((custom, index) => (
              <span key={index}>
                <span>{ custom.render(record) }</span>
                {
                  actions.customs && index < (actions.customs.length-1) ?
                  <Divider type="vertical" />:''
                }
              </span>
            ))
          }
          {
            !!actions.edit && (
              <>
                {!!actions.customs && <Divider type="vertical" />}
                <a onClick={ e => {!!actions.edit && actions.edit(record)} }>编辑</a>
              </>
            )
          }
          {
            !!actions.delete && (
              <>
                {!!actions.edit && <Divider type="vertical" />}
                <a onClick={ e=> onDelete(record) } style={{ color: 'red' }}>删除</a>
              </>
            )
          }
        </>
      )
    })
  }

  return columns
}