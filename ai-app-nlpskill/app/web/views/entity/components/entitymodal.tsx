import React, { useRef, useMemo, useState } from "react";
import { Drawer, Button, Switch, Select, message, Modal, Tooltip, Icon } from "antd";

import { formType } from "../../../components/FormManage/type";
import { FormManage } from "../../../components/FormManage";
import { DicTable } from "./dicTable";

interface PropsType {
  title: string,
  visible: boolean,
  formData?: {
    dictionary_list: Array<any>,
    [key:string]: any
  },
  onSave: (params) => Promise<any>,
  onClose: () => void
}

const EntityForm = FormManage('entity-form');
const DicForm = FormManage('dic-form');

export const EntityModal = ({ title, visible, formData, onSave, onClose }: PropsType) => {
  const entityFormRef = useRef< any >( null );
  const dicFormRef = useRef< any >( null );
  const [dicList, setDicList] = useState(formData && formData.dictionary_list || []);
  const [type, setType] = useState('entry');
  const [fuzzy, setFuzzy] = useState(formData && formData.fuzzy_set || false);
  const [isFormChange, setIsFormChange] = useState(false);

  const formItem = useMemo(() => {
    const arr: formType[] = [{
      key: 'entity_name',
      label: '实体名称',
      width: '600px',
      prefix: '@',
      tooltip: <span>实体是同类单词的合集，如：地址、歌曲名、歌手等，在对话编辑中通过对词库的绑定和调用，进行重要信息的提取和语槽位调用。<br /><br />
        语义通过实体进行理解，然后抽取并输出机器可以理解的格式。<br /><br />
        一个词典/实体值不能超过125个字（一个英文字母、汉字、标点都算一个字），超出后不能被识别</span>,
      placeholder: '请输入实体名称',
      disabled: !!(formData && Object.keys(formData).length !== 0),
      rules: [{ required: true, message: '实体名称不能为空' }]
    }, {
      key: 'description',
      label: '描述',
      width: '600px',
      type: 'textarea',
    }]
    return arr;
  }, [])

  const dicFormItem = useMemo(() => {
    const arr: formType[] = [{
      key: 'value',
      label: '词条名',
      width: '300px',
      rules: [{ required: true, message: '词条名不能为空' }]
    }, {
      key: 'synonyms',
      label: '词条类型',
      groupHidden: type && type === 'pattern'?true: false,
      type: 'custom',
      itemWidth: 650,
      extraNode:
        <Select style={{ width: 130, marginRight: 20 }} value={type} onChange={(v) => changeType(v)}>
          <Select.Option value="entry">同义词</Select.Option>
          <Select.Option value="pattern">正则表达式</Select.Option>
        </Select>
      ,
    }]
    return arr;
  }, [type])

  const changeType = (type) => {
    setType(type);
    const dicForm = dicFormRef.current || {};
    dicForm.resetFields(['synonyms']);
  }

  const renderDicTable = useMemo(() =>
    <DicTable
      dataSource={dicList}
      onEdit={(record, value) => {
        const index = dicList.findIndex(d => d.value === record.value);
        let tempDialog = JSON.parse(JSON.stringify(dicList));
        let synonyms = value ? value.split('#'):null;
        if (synonyms) synonyms = synonyms.filter(s => s);
        tempDialog[index].synonyms = synonyms;
        setDicList(tempDialog);
      }}
      onDelete={(selectedRowKeys) => {
        let tempDicList = JSON.parse(JSON.stringify(dicList));
        selectedRowKeys && selectedRowKeys.forEach(s => {
          const index = tempDicList.findIndex(d => d.value === s);
          tempDicList.splice(index, 1);
        })
        setDicList(tempDicList.slice(0));
      }} />
  , [dicList])

  // 添加词条
  const onAddDic = () => {
    const dicForm = dicFormRef.current || {};

    if (dicForm.validateFieldsAndScroll) {
      dicForm.validateFieldsAndScroll((err, values) => {
        if (err) return;
        let tempDialog = JSON.parse(JSON.stringify(dicList));
        const flag = tempDialog.findIndex(d => d.value === values.value);
        if (flag !== -1) {
          message.warning('请勿重复添加');
          return;
        }
        values.data_type = type;
        if (values.synonyms && values.synonyms.length !==0) {
          values.synonyms = values.synonyms.filter(s => !!s);
        }
        tempDialog.push(JSON.parse(JSON.stringify(values)));
        setDicList(tempDialog);
        dicForm.resetFields();
      })
    }
  }

  // 保存所有
  const onAddAll = () => {
    if (!dicList || dicList.length === 0) {
      message.warning('词条信息不能为空');
      return;
    }
    const entityForm = entityFormRef.current || {};

    if (entityForm.validateFieldsAndScroll) {
      entityForm.validateFieldsAndScroll((err, values) => {
        if (err) return;
        let obj = {
          fuzzy_set: fuzzy,
          dictionary_list: dicList,
          ...values
        }
        onSave(obj).then(res => {
          resetFields('save');
        }).catch(err => {
          console.log('err :>> ', err);
        })
      })
    }
  }

  const resetFields = (type?) => {
    const entityForm = entityFormRef.current || {};
    const dicForm = dicFormRef.current || {};
    if (isFormChange && type !== 'save') {
      Modal.confirm({
        title: '修改内容尚未保存，确认退出？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          entityForm.resetFields();
          dicForm.resetFields();
          setDicList([]);
          setFuzzy(false);
          setType('entry');
          onClose();
        }
      });
    } else {
      entityForm.resetFields();
      dicForm.resetFields();
      setDicList([]);
      setFuzzy(false);
      setType('entry');
      onClose();
    }
  }

  return (
    <Drawer
      placement="bottom"
      width="1000"
      className="entity-modal"
      height={'calc(100% - 50px)'}
      bodyStyle={{ padding: '20px 40px', position: 'relative', height: '82vh', overflow: 'auto' }}
      title={title}
      closable={true}
      onClose={resetFields}
      visible={visible}
    >
      <div className="entity-form-item">
        <div className="item-title" style={{ marginBottom: '1em' }}>基础信息
          <div className="swicth-btn">
            <Tooltip title="打开模糊识别开关后，在进行模型解析时，若query中的原始词没有精确匹配上自定义词典值，则会进行模糊匹配" placement="bottomLeft">
              <Icon type="question-circle-o" style={{ paddingRight: 4 }} />
            </Tooltip>
            模糊匹配：
            <Switch checkedChildren="开" unCheckedChildren="关" checked={fuzzy} onChange={checked => setFuzzy(checked)} />
          </div>
        </div>
        <div className="item-wrapper">
          <EntityForm items={formItem} formData={formData} labelCol={24} wrapperCol={24} colon={false} ref={entityFormRef} onValuesChange={() => !isFormChange && setIsFormChange(true)} />
        </div>
        <p className="item-title">词条信息</p>
        <div className="item-wrapper">
          <DicForm items={dicFormItem} formData={dicList} labelCol={24} wrapperCol={24} colon={false} ref={dicFormRef} onValuesChange={() => !isFormChange && setIsFormChange(true)} />
          <Button type="primary" onClick={onAddDic} ghost>添加</Button>
        </div>
      </div>
      {/* table */}
      {renderDicTable}
      <Button type="primary" onClick={onAddAll}>保存</Button>
    </Drawer>
  )
}