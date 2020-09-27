import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Button, Drawer, Icon, Steps } from 'antd';
import { FormManage } from '../../../components/FormManage';
import { getScene } from '../../../api/ability';

const MainForm = FormManage('main-form');

export const AbilityModal = ({ title, domain, totalList, visible, formData, onConfirm, onClose }) => {
  const mainFormRef = useRef< any >( null );
  const [tabIndex, setTabIndex] = useState(formData && Object.keys(formData).length !== 0 ? 1: 0);
  const [sceneOption, setSceneOption] = useState([]);
  const [currentAbility, setCurrentAbility] = useState(domain && domain.type ? domain.type : 'nlp');
  const [domainId, setDomainId] = useState(domain?domain.id:null);

  useEffect(() => {
    formData && Object.keys(formData).length !== 0 &&
    initScene(domain.id)
  }, [])

  const initScene = (id?) => {
    if (!id && !domainId) return;
    getScene(id || domainId).then(res => {
      if (res.status && res.status ===200) {
        const data: any = res.data;
        const option = (data || []).map(d => {
          return {
            label: d.scene_name,
            value: d.scene_id
          }
        })
        setSceneOption(option);
      }
    })
  }

  const steps = ['请选择创建方式', '请填写能力信息'];
  const cardItems = [{
    name: '意图对话能力',
    icon: 'apartment',
    type: 'nlp',
    description: '通过参数化配置构建对话能力，如：预定【明天】去【北京】的火车票'
  }, {
    name: '语音识别能力',
    icon: 'sound',
    type: 'voice',
    description: '自训练处能识别特定场景术语、专有名词的语音识别能力'
  }, {
    name: '内容识别能力',
    icon: 'container',
    type: 'content',
    description: '自训练处能识别特定场景术语、专有名词的内容识别能力'
  }]

  const formItem = useMemo(() => {
    return [
      {
        key: 'algorithmn_name',
        label: '能力名称',
        rules: [{ required: true, message: '能力名称不能为空' }]
      },
      {
        key: 'scene_id',
        label: '场景选择',
        type: 'select',
        options: sceneOption,
        rules: [{ required: true, message: '场景不能为空' }]
      },
      {
        key: 'description',
        label: '能力描述',
        type: 'textarea',
        rules: [{ required: true, message: '能力描述不能为空' }]
      },
    ]
  }, [sceneOption])

  const handleConfirm = () => {
    const form = mainFormRef.current || {};
    if (form.validateFieldsAndScroll) {
      form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        values.domain_id = domainId;
        onConfirm(values);
      })
    }
  }

  const handleNext = () => {
    initScene();
    setTabIndex(1);
  }

  const handlePre = () => {
    setTabIndex(0);
  }

  const onChangeTab = (type) => {
    setCurrentAbility(type);
    if (!totalList || !totalList[type]) return;
    const { domain_id } = totalList[type];
    setDomainId(domain_id)
  }

  const renderCardItems = useMemo(() => {
    return cardItems.map(item => {
      return (
        <div
          key={item.name}
          className={item.type===currentAbility? 'ability-modal ability-modal-active': 'ability-modal'}
          onClick={() => (!formData || Object.keys(formData).length ===0) && onChangeTab(item.type)}
        >
          <div className="ability-modal-icon">
            <Icon type={item.icon} />
          </div>
          <div className="ability-meta">
            <div className="ability-meta-title">{item.name}</div>
            <div className="ability-meta-description">{item.description}</div>
          </div>
        </div>
      )
    })
  }, [cardItems, currentAbility])

  const handleClose = () => {
    setTabIndex(0);
    setCurrentAbility('nlp');
    onClose();
  }

  return (
    <Drawer
      placement="right"
      width="700"
      // height={'calc(100% - 64px)'}
      title={title}
      closable={true}
      onClose={handleClose}
      visible={visible}
      bodyStyle={{ padding: '20px 50px' }}
    >
      <Steps current={Number(tabIndex)} style={{ padding: '0 50px 30px' }}>
        {steps.map(item => (
          <Steps.Step key={item} title={item} />
        ))}
      </Steps>
      {
        tabIndex === 0 &&
        <div>
          <p className="ability-modal-span">自训练能力</p>
          { renderCardItems }
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={handleNext}>下一步</Button>
          </div>
        </div>}
      {
        tabIndex === 1 &&
        <>
          <MainForm
            colon={false}
            labelCol={24}
            wrapperCol={24}
            ref={mainFormRef}
            items={formItem}
            formData={formData}
          />
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" ghost onClick={handlePre}>上一步</Button>
            <Button type="primary" style={{ marginLeft: 30 }} onClick={handleConfirm}>确定</Button>
          </div>
        </>
      }
    </Drawer>
  );
}