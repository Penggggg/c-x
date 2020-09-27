import React, { useState } from 'react';
import { Modal, Checkbox, Empty } from 'antd';

interface PropType {
  visible: boolean,
  similarList: any,
  onClose: () => void
  onOk: (any) => void
}

export const AutoSimilar = ({visible, similarList, onClose, onOk}: PropType) => {
  const [checkedList, setCheckedList] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState<any>(true);
  const [checkAll, setCheckAll] = useState<any>(false);

  const handleClose = () => {
    setCheckAll(false);
    setIndeterminate(true)
    setCheckedList([]);
    onClose();
  }

  return (
    <Modal
      className="auto-similar"
      title="自动生成相似范例"
      visible={visible}
      okText="确定"
      cancelText="取消"
      onCancel={handleClose}
      onOk={() => {
        onOk(checkedList);
        handleClose();
      }}
    >
      <div>
        <div className="checkbox-wrapper">
          <Checkbox
            indeterminate={indeterminate}
            onChange={(e) => {
              setCheckedList(e.target.checked ? similarList : []);
              setIndeterminate(false);
              setCheckAll(e.target.checked)
            }}
            checked={checkAll}
          >
            范例
          </Checkbox>
        </div>
        {
          similarList && similarList.length >0 ?
          <Checkbox.Group
            className="check-group"
            value={checkedList}
            onChange={(checkedList) => {
              setCheckedList(checkedList);
              setIndeterminate(!!checkedList.length && checkedList.length < similarList.length);
              setCheckAll(checkedList.length === similarList.length)
            }}
          >
            {
              similarList.map((s, index) => (
                <div style={{ marginBottom: 10 }} key={index}>
                  <Checkbox value={s}>{s}</Checkbox><br />
                </div>
              ))
            }
          </Checkbox.Group>:
          <Empty />
        }
      </div>
    </Modal>
  )
}