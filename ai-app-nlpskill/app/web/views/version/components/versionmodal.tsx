import React, { useRef } from 'react';
import { Modal } from 'antd';
import { FormManage } from '../../../components/FormManage';
import { http } from '@cvte/ai-web-util/util';

export const VersionModal = ({ title, visible, onClose, ability, versionList }) => {
  const VersionFrom = FormManage('version-form');
  const versionFormRef = useRef< any >( null );

  const formItem = [{
    key: 'description',
    label: '描述',
    type: 'textarea',
    placeholder: '请输入简短描述（最多128个字符）',
    rules: [{ required: true, message: '描述不能为空，并限制最多128个字符', max: 128 }]
  }]

  const onOk = () => {
    if (!versionList ||  versionList.length === 0) return;
    versionFormRef.current.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let name = '';
        if (versionList.length === 1) {
          name = 'v1';
        } else {
          const version_name = versionList[1].version_name || '';
          const number = Number(version_name.toLowerCase().replace('v', ''))
          name = `v${number+1}`;
        }

        http.post({
          url: `/t-apis/v1/nlp/version/save/${ability.algorithmn_id}`,
          successMsg: '数据提交成功，正在保存',
          data: {
            version_name: name,
            description: values.description
          }
        }).then(res => {
          if (res.status && res.status === 200) onClose();
        })
      }
    });
  }

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      title={title}
      visible={visible}
      onCancel={onClose}
      onOk={onOk}
    >
      <div style={{ marginBottom: 14 }}>把当前开发中的调用模型及配置保存起来，便于后续的发布或配置回滚</div>
      <VersionFrom items={formItem} ref={versionFormRef} labelCol={24} wrapperCol={24} colon={false} />
    </Modal>
  )
}
