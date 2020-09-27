import React, { Fragment, useState } from 'react';
import { Input, Divider, Table, Drawer, Tag } from 'antd';

import { AudioLabel } from '../index';

type labelTag = {
  id: string
  name: string
  [key: string ]: any
}

type labelContent = {
  id?: string,
  label: string,
  start: number,
  end: number
  tags?: labelTag[],
}
interface Props {
  id?: string,
  regions: Array<any>,
  canAction: boolean,
  tags: labelTag[],
  onDelete: Function,
  onRowClick: Function,
  onSave: (value: any) => void,
  onCreateLabel: (value: any) => void,
  onUpdateLabel: (value: any) => void,
  onDeleteLabel: (value: any) => void,
  onLabelChange: (event: any) => void
}

export const AudioLabelTable = ({ id, regions, canAction, tags, onDelete, onCreateLabel, onUpdateLabel, onDeleteLabel, onLabelChange, onSave, onRowClick }: Props) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any>({});

  // 表格列
  const columns = [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      width: 60,
      align: 'center' as 'center',
      render: (text: string, record: labelContent, index: number) => index +1
    }, {
      title: '起止时间',
      key: 'start',
      dataIndex: 'start',
      width: 300,
      sorter: (a: { start: number; }, b: { start: number; }) => a.start - b.start,
      render: (text: number, record: labelContent) =>
        `${secondsToString(record.start)} ~ ${secondsToString(record.end)}`
    }, {
      title: '音频标注内容',
      key: 'label',
      dataIndex: 'label',
      render: (text: string, record: any) => (
        <Input.TextArea allowClear autoSize={{ minRows: 1 }} disabled={!canAction} defaultValue={record.label} onBlur={onLabelChange} />
      )
    },
    {
      title: '标签',
      key: 'tags',
      width: 250,
      dataIndex: 'tags',
      render: (text: any, record: any) => {
        return (
          record.tags ? record.tags.map((t: any) => {
            return (
              <Tag color="blue" key={t.id}>{t.name}</Tag>
            )
          }): '无'
        )
      }
    },
    {
      title: '操作',
      key: 'handle',
      align: 'center' as 'center',
      render: (text: any, record: any) => {
        return (
          <span>
            {
              canAction &&
              <Fragment>
                <a onClick={() => {
                  setSelected(record)
                  setVisible(true);
                }}>标签管理</a>
                <Divider type="vertical" />
              </Fragment>
            }
            <a onClick={() => record.wavesurfer.play(record.start, record.end)}>播放</a>
            {
              canAction &&
              <Fragment>
                <Divider type="vertical" />
                <a onClick={(e) => onDelete(record)}>删除</a>
              </Fragment>
            }
          </span>
        )
      }
    }
  ];

  // 转换展示时间格式
  const secondsToString = (seconds: any) => {
    if (!seconds) return 0;
    let timeStr = '00:';
    if (seconds >= 10) {
      timeStr += seconds.toFixed(3);
    } else {
      timeStr += `0${seconds.toFixed(3)}`;
    }
    return timeStr;
  };

  // 保存标签
  const onSaveLabel = (selectedTags: labelTag[ ]) => {
    onSave({ ...selected, tags: selectedTags });
    setVisible(false);
    setSelected({});
  }

  return (
    <Fragment>
      <Table
        size="small"
        columns={columns}
        dataSource={regions}
        pagination={false}
        rowClassName={(record) => record.id === id ? 'table-row-active':'' }
        rowKey={(record) => `${record.start}-${record.end}`}
        onRow={record => {
          return { onClick: () => onRowClick(record) };
        }}
      />
      {
        visible && <Drawer
          title="标签管理"
          placement="right"
          width={400}
          closable={false}
          onClose={() => {
            setVisible(false);
            setSelected({});
          }}
          visible={visible}
        >
          <AudioLabel
            tags={tags}
            canAction={canAction}
            defaultSelected={selected.tags || []}
            onSave={onSaveLabel}
            onCreate={onCreateLabel}
            onUpdate={onUpdateLabel}
            onDelete={onDeleteLabel} />
        </Drawer>
      }
    </Fragment>
  )
}
