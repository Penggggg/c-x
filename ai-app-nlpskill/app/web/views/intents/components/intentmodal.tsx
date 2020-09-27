import React, { useRef, useMemo, useState, useEffect } from "react";
import { Drawer, Button, message, Modal, Tooltip, Icon } from "antd";
import { http } from "@cvte/ai-web-util/util";

import { formType } from "../../../components/FormManage/type";
import { FormManage } from "../../../components/FormManage";
import { useStore } from "../../../store";
import { DialogTable } from "./dialogTable";
import { getSkill } from "../../../api/skill";
import moment from "moment";

interface PropsType {
  title: string,
  visible: boolean,
  formData?: {
    dialog: Array<any>,
    [key:string]: any
  },
  selectSkill: any,
  onSave: (params) => Promise<any>,
  onClose: () => void
}

const IntentForm = FormManage('intent-form');
const DiglogForm = FormManage('dialog-form');
const SlotsForm = FormManage('slots-form');

export const IntentModal = ({ title, visible, selectSkill, formData, onSave, onClose }: PropsType) => {
  const intentFormRef = useRef< any >( null );
  const dialogFormRef = useRef< any >( null );
  const slotsFormRef = useRef< any >( null );
  const dialogRef = useRef< any >( null );
  const [skillOption, setSkillOption] = useState([]);
  const [intentsList, setIntentsList] = useState<any>([]);
  const [dialog, setDialog] = useState<any>({});
  const [slots, setSlots] = useState([]);
  const [isFormChange, setIsFormChange] = useState(false);
  const { AbilityC } = useStore( );

  useEffect(() => {
    initIntents();
    initSkill();
  }, [])

  const initIntents = () => {
    if (!formData || !formData.intention_id) return;
    const item = AbilityC.selectAbility;
    http.get({
      url: `/t-apis/v1/nlp/intention/${item.algorithmn_id}/${formData.intention_id}`
    }).then(res => {
      const data: any = res.data;
      if (!data) return;
      setIntentsList(data);
      const dialog = data.dialog;
      if (!data.dialog || data.dialog.length ===0) return;
      setDialog(dialog[0])
      const arr = (data.slots || []).map(i => {
        if (i.slot_name) {
          if (i.slot_name.indexOf('@') === -1) {
            return i.slot_name
          } else {
            return i.slot_name.split('@')[0]
          }
        }
      })
      setSlots(arr)
    }).catch(err => {
    })
  }

  const initSkill = () => {
    const item = AbilityC.selectAbility;
    getSkill(item.algorithmn_id).then(res => {
      const data: any = res.data;
      if (!data || !data.instances) return;
      const instances = data.instances;
      let arr = instances && instances.map(i => {
        return {
          label: i.skill_name,
          value: i.skill_id
        }
      })
      setSkillOption(arr);
    }).catch(err => {
    })
  }

  const formItem = useMemo(() => {
    const arr: formType[] = [];
    if (!formData || Object.keys(formData).length === 0) {
      arr.push({
        key: 'skill_refer',
        label: '所属技能',
        width: '800px',
        placeholder: '请选择所属技能',
        type: 'select',
        initialValue: selectSkill && Object.keys(selectSkill).length !== 0 ? selectSkill.skill_id:null,
        options: skillOption,
        rules: [{ required: true, message: '所属技能不能为空' }]
      })
    }
    return arr.concat([{
      key: 'intention_name',
      label: '意图名称',
      width: '800px',
      prefix: '#',
      placeholder: '请输入意图名称',
      tooltip: <span>
        用户的每一轮对话，都可以认为是一个意图。每一个意图都是为了实现用户进行这轮对话的目的。<br /><br />
        如意图[查询天气]，用户的目的就是为了查询某天某地的天气状况。一个任务或者一个问题，需要用户进行一轮或者多轮对话。<br /><br />
        用户的每一轮对话，都可以认为是一个意图。</span>,
      disabled: !!(formData && Object.keys(formData).length !== 0),
      rules: [{ required: true, message: '意图名称不能为空' }]
    }, {
      key: 'description',
      label: '描述',
      width: '800px',
      type: 'textarea',
      placeholder: '请输入描述',
    }])
  }, [skillOption])

  const slotsFormItem = useMemo(() => {
    const arr: formType[] = [];
    return arr.concat([
      {
      key: 'slots',
      name: '槽位',
      type: 'multi',
      onChange: (item) => {
        const arr = (item || []).map(i => {
          if (i.slot_name) {
            if (i.slot_name.indexOf('@') === -1) {
              return i.slot_name
            } else {
              return i.slot_name.split('@')[0]
            }
          }
        })
        setSlots(arr);
        setIsFormChange(true);
      },
    }])
  }, [])

  const dialogFormItem = useMemo(() => {
    const arr: formType[] = [{
      key: 'answer',
      width: '800px',
      type: 'textarea',
      placeholder: '请输入默认答复',
    }]
    return arr;
  }, [dialog, slots, intentsList])

  // 保存所有
  const onAddAll = () => {
    const intentForm = intentFormRef.current || {};
    const slotsForm = slotsFormRef.current || {};
    const dialogArr = dialogRef.current.getData();
    let similarArr: any = [];
    let createTime: any = [];
    let updateTime: any = [];
    dialogArr && dialogArr.forEach(d => {
      const innerArr = d.dialog.label;
      createTime.push(moment(d.created_at).format());
      updateTime.push(moment(d.updated_at).format());
      let text = '';
      if (!innerArr || innerArr.length === 0) {
        text = d.dialog.text;
      } else {
        innerArr && innerArr.forEach(w => {
          if (w.attribute && w.type === 'slot') {
            text = text + '${' + w.attribute + '=' + w.word + '}';
          } else {
            text = `${text}${w.word}`
          }
        })
      }
      similarArr.push(text)
    })
    if (intentForm.validateFieldsAndScroll) {
      intentForm.validateFieldsAndScroll((err, values) => {
        if (err) return;
        const dialogForm = dialogFormRef.current || {};
        dialogForm.validateFieldsAndScroll((errd, diaValue) => {
          let arr: any = [];
          arr.push({
            query: values.intention_name,
            answer: diaValue.answer || '',
            similar_query: similarArr,
            create_at: createTime,
            update_at: updateTime
          })
          let flag = false;
          let slots: any = [];
          slotsForm.validateFieldsAndScroll((errd, value) => { slots = value.slots })
          let newSlots = (slots || []).map(slot => {
            if (slot.slot_name.indexOf('@') === -1) {
              if (!slot.entity_name) {
                flag = true;
                return;
              } else {
                slot.slot_name = `${slot.slot_name}@${slot.entity_name}#${values.intention_name}`;
              }
            }
            delete slot['entity_name']
            return slot
          })
          if (flag) {
            message.warning('请选择槽位对应的关联实体');
            return;
          }
          let obj = {
            priority: 1,
            dialog: arr,
            slots: newSlots,
            ...values
          }
          onSave(obj).then(res => {
            if (res.status === 200) {
              resetFields('save');
            }
          }).catch(err => {
            console.log('err :>> ', err);
          })
        })
      })
    }
  }

  const resetFields = (type?) => {
    const intentForm = intentFormRef.current || {};
    const dialogForm = dialogFormRef.current || {};
    const slotsForm = slotsFormRef.current || {};
    if (isFormChange && type !== 'save') {
      Modal.confirm({
        title: '修改内容尚未保存，确认退出？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          intentForm.resetFields();
          dialogForm.resetFields();
          slotsForm.resetFields();
          setDialog({});
          setIntentsList([]);
          onClose();
        }
      });
    } else {
      intentForm.resetFields();
      dialogForm.resetFields();
      slotsForm.resetFields();
      setDialog({});
      setIntentsList([]);
      onClose();
    }
  }

  const renderDialog = useMemo(() => {
    return (
      <DialogTable dataSource={dialog} slots={slots} ref={dialogRef} />
    )
  }, [slots, dialog])

  return (
    <Drawer
      placement="bottom"
      className="intent-modal"
      height={'calc(100% - 50px)'}
      bodyStyle={{ padding: '20px 40px', height: '82vh', overflow: 'auto' }}
      title={title}
      closable={true}
      onClose={resetFields}
      visible={visible}
    >
      <div className="form-item">
        <p className="item-title">基本信息</p>
        <div className="item-wrapper">
          <IntentForm items={formItem} formData={intentsList} labelCol={24} wrapperCol={24} colon={false} ref={intentFormRef} onValuesChange={() => !isFormChange && setIsFormChange(true)} />
        </div>
        <p className="item-title">槽位</p>
        <div className="item-wrapper">
          <SlotsForm items={slotsFormItem} formData={intentsList} layout="inline" colon={false} ref={slotsFormRef} onValuesChange={() => !isFormChange && setIsFormChange(true)} />
        </div>
        <p className="item-title" style={{ marginTop: 20 }}>对话范例
          <Tooltip
            title={<span>
              对于某一个任务/问题，用户可能会有多种问法，采集用户的对话样本越多，系统就能越精确识别出用户的意图。<br /><br />
              例如对于用户想要查询天气，他的对话范例可能有如下：<br />
              帮我查一下上海的天气？<br />
              广州的天气怎样？<br />
              查一下广州的天气吧<br />
              今天上海是否会下雨？<br />
              ……
            </span>}
            placement="right"
          >
            <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
          </Tooltip>
        </p>
        <div className="item-wrapper">
          { renderDialog }
        </div>
        <p className="item-title">默认答复
          <Tooltip
            title={<span>
              开发者需要在这里定义系统应该如何响应用户需求，包括回应的内容（文本内容或函数）。 <br />
              触发回应的规则条件在[对话配置]里面进行配置
            </span>}
            placement="right"
          >
            <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
          </Tooltip>
        </p>
        <div className="item-wrapper">
          <DiglogForm style={{ marginTop: 10 }} items={dialogFormItem} formData={dialog} labelCol={24} wrapperCol={24} colon={false} ref={dialogFormRef} onValuesChange={() => !isFormChange && setIsFormChange(true)} />
        </div>
      </div>
      <Button type="primary" onClick={onAddAll}>保存</Button>
    </Drawer>
  )
}