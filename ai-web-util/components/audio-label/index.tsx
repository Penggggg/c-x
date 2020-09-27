import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Divider, Modal } from 'antd';

import './index.less';
import { MyForm, CheckboxTags } from '../index';

const CreateLabel = MyForm('audio-label');

type labelTag = {
  id: string
  name: string
  [key: string ]: any
}

interface AudioLabelProps {
  tags: labelTag[],
  canAction?: boolean,
  defaultSelected: labelTag[],
  onCreate?: ( name: string ) => void,
  onDelete?: ( tag: labelTag ) => void,
  onUpdate?: ( tag: labelTag ) => void,
  onSave?: ( selectedTags: labelTag[ ]) => void
}

export const AudioLabel = ({ tags, canAction = true, defaultSelected, onCreate, onDelete, onUpdate, onSave }: AudioLabelProps) => {
  // 创建标签弹框
  const [createVisible, setCreateVisible] = useState(false);
  // 已选择标签
  const [selectedTags, setSelectedTags ] = useState< any >( null );
  // 标签输入内容
  const formRef: any = useRef( null );

  useEffect(() => {
    let arr: any = [];
    defaultSelected && defaultSelected.forEach(s => arr.push(s.id))
    setSelectedTags(arr);
  }, [])

  // 关闭弹框
  const cancelModal = ( ) => {
    const form = formRef.current;
    form.resetFields( );
    setCreateVisible( false )
  }

  // 创建标签
  const onCreateLabel = () => {
    const form = formRef.current;
    form.validateFields(( err: any, values: any ) => {
      const { name } = values;
      if ( !!err ) { return; }

      !!onCreate && onCreate( name );
      form.resetFields( );
      setCreateVisible( false );
    })
  }

  // 选择标签
  const onLabelChange = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  }

  // 保存已选择标签
  const onSaveLabel = ( ) => {
    const finalTags = tags.filter( t => selectedTags.includes( t.id ))
    !!onSave && onSave( finalTags )
  }

  return (
    <div className="audio-label-wrapper">
      <div>
        {
          canAction &&
          <Button
            icon="plus"
            style={{ marginTop: 15 }}
            onClick={() => setCreateVisible(true)}
          >创建标签</Button>
        }
        {/* 标签列表 */}
        <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <CheckboxTags
            block
            type='multipul'
            tags={ tags }
            onChange={ onLabelChange }
            defaultSelected={ selectedTags }
            onDelete={ canAction ? onDelete : undefined }
            onUpdate={ canAction ? onUpdate : undefined }
          />
        </div>
        {
          canAction &&
          <Fragment>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Button ghost type="primary" onClick={ onSaveLabel }>
                保存
              </Button>
            </div>
          </Fragment>
        }
      </div>

      {/* 创建标签弹框 */}
      <Modal
        title="创建标签"
        visible={ createVisible }
        onCancel={ cancelModal }
        onOk={ onCreateLabel }
      >
        <CreateLabel
          ref={ formRef }
          formItems={[
            {
              key: 'name',
              label: '标签名称',
              type: 'input',
              placeholder: '请填写标签名称',
              rules: [
                { required: true, message: '请填写标签名称' }
              ]
            }
          ]}
        />
      </Modal>
    </div>
  )
}