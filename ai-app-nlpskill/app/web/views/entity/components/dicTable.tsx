import React, { useMemo, useState } from 'react';
import { Tag, Button, message, Modal, Table, Input } from 'antd';

import { TableColumns } from '../../../components/TableColumns';

interface PropType {
  dataSource: Array<any>,
  onEdit: (record, value) => void,
  onDelete?: (record) => void,
}

export const DicTable = ({ dataSource, onEdit, onDelete }: PropType) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState('');
  const [edit, setEdit] = useState<any>();

  const dicColumn = useMemo(() => (
    TableColumns({
      value: "词条名",
      data_type: {
        title: "词条类型",
        render: text => {
          switch(text) {
            case 'entry':
              return '同义词';
            case 'pattern':
              return '正则表达式';
            default:
              return text;
          }
        }
      },
      synonyms: {
        title: <span>
          列表
          <span style={{ color: 'rgba(241, 6, 6, .6)', fontSize: 13, paddingLeft: 8 }}>
            (双击数据项可进行编辑操作，多条数据以 # 隔开)
          </span>
        </span>,
        render: (arr, record) => {
          if (edit && edit.value === record.value) {
            return <Input
              autoFocus
              defaultValue={arr&&arr.join('#')}
              onBlur={(e) => {
                setEdit(undefined);
                onEdit(record, e.target.value || '')
              }}
            />
          }
          return <div style={{ height: 21 }} onDoubleClick={()=> {
            setEdit(record);
          }}>
            {(arr && arr.length >0 ? arr.map(a => (
            <Tag color="blue" key={a}>{a}</Tag>
          )): null)}
          </div>
        }
      },
    })
  ), [edit, dataSource])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const rowKeys = selectedRows && selectedRows.map(s => s.value);
      setSelectedRowKeys(rowKeys);
    },
  };

  const handleDelete = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的数据');
      return;
    }
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        onDelete && onDelete(selectedRowKeys);
        setSelectedRowKeys('');
      }
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {
        (selectedRowKeys && selectedRowKeys.length !==0 ) &&
        <Button
          type="danger"
          ghost
          style={{ position: 'absolute', top: -62, left: 100 }}
          onClick={handleDelete}
        >删除</Button>
      }

      <Table
        size="small"
        style={{ marginBottom: 15 }}
        rowKey='value'
        columns={dicColumn}
        dataSource={dataSource}
        rowSelection={rowSelection}
       />
    </div>
  )
}