import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Icon, List, Dropdown, Menu, Modal, Layout, message, notification } from 'antd';

import { getAbility, addAbility, updateAbility, deleteAbility } from '../../api/ability';
import { AbilityModal } from './components/abilitymodal';
import { transferTime2CN } from '../../util/time';
import { useStore } from '../../../web/store';
import { AbilityInstance } from './type';
import './index.less';

export const Ability = (props) => {
  const [currentAbility, setCurrentAbility] = useState<AbilityInstance>();
  const [abilityList, setAbilityList] = useState<AbilityInstance[]>([]);
  const [voiceList, setVoiceList] = useState<AbilityInstance[]>([]);
  const [contentList, setContentList] = useState<AbilityInstance[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<any>({});
  const [totalList, setTotalList] = useState<any>({});
  const { AbilityC } = useStore( );

  const tabItem = [{
    name: '意图对话',
    type: 'nlp',
    addtitle: '创建能力',
    loading: spinning,
    dataSource: abilityList,
  }, {
    name: '语音识别',
    type: 'voice',
    addtitle: '创建能力',
    loading: spinning,
    dataSource: voiceList,
  }, {
    name: '内容识别',
    type: 'content',
    addtitle: '创建能力',
    loading: spinning,
    dataSource: contentList,
  }]

  useEffect(() => {
    initData()
  }, [])

  const initData = () => {
    setSpinning(true);
    getAbility().then((res: any) => {
      setSpinning(false);
      if(res.status && res.status === 200) {
        setTotalList(res.data);
        const { nlp, voice, content } = res.data;
        setAbilityList(nlp.algorithmns);
        setVoiceList(voice.algorithmns);
        setContentList(content.algorithmns);
      } else {
        if (res.message) {
          const obj = JSON.parse(res.message || "{}");
          notification.error({
            message: '提示',
            description: obj.message || '请求失败'
          });
        }
      }
    }).catch(err => {
      setSpinning(false);
      notification.error({
        message: '提示',
        description: '请求出错'
      });
    });
  }

  const menu = (item, tab) => {
    const actions = [{
      name: '编辑',
      onClick: () => {
        setCurrentAbility(item);
        setTitle('编辑');
        domainManage(tab.type)
        setVisible(true);
      }
    }, {
      name: '删除',
      style: {color: 'red'},
      onClick: () => {
        Modal.confirm({
          title: '确认删除？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            deleteAbility(item.algorithmn_id).then(res => {
              if (res.status === 200) initData();
            })
          }
        });
      }
    }]
    return (
      <Menu>
      { actions.map(action => (
          <Menu.Item key={action.name}>
            <Button type="link" style={action.style} onClick={action.onClick}> {action.name} </Button>
          </Menu.Item>
        )) }
      </Menu>
    )
  }

  // 关闭弹框
  const onClose = () => {
    setVisible(false);
    setTitle('');
    setDomain({});
    setCurrentAbility(undefined);
  }

  // 能力保存
  const onConfirm = (values) => {
    let temp;
    if (!currentAbility || Object.keys(currentAbility).length === 0) {
      temp = addAbility;
    } else {
      temp = updateAbility;
      values.algorithmn_id = currentAbility?.algorithmn_id
    }
    temp(values).then(res => {
      onClose();
      initData();
    }).catch(err => {
      message.error('操作失败');
    })
  }

  const onAdd = (tab) => {
    domainManage(tab.type);
    setVisible(true);
    setTitle('创建能力');
  }

  const domainManage = (type) => {
    const { nlp, content, voice } = totalList;
    let id = 0;
    switch(type) {
      case 'nlp':
        id = nlp.domain_id;
        break;
      case 'voice':
        id = voice.domain_id;
        break;
      case 'content':
        id = content.domain_id;
      default:
        break;
    }
    setDomain({ id, type });
  }

  // card 点击，跳转至实体
  const onClick = (item, tab) => {
    const { type } = tab;
    AbilityC.setselectAbility(item);
    localStorage.setItem('item', JSON.stringify(item));
    if ( type === 'nlp' ) {
      props.history.push(`/entity/my?abilityId=${item.algorithmn_id}`);
    } else if ( type === 'voice' ){
      props.history.push(`/speech/dic?abilityId=${item.algorithmn_id}&name=${encodeURIComponent(item.algorithmn_name)}`);
    }
  }

  // 列表详情
  const renderCardItem = (item, tab) => {
    return (
      <List.Item key={item.algorithmn_id}>
        <Card
          title={
            <span style={{ fontSize: 17, display: 'inline-block', width: '100%' }} onClick={() => onClick(item, tab)}>
              {item.algorithmn_name}
            </span>}
          size="small"
          className="item-list"
          hoverable
          extra={
            <>
              <span className="item-tag">{item.public?'系统内置':'自训练'}</span>
              <Dropdown overlay={menu(item,tab)} placement="bottomRight">
                <Icon type="more" className="setting-icon" />
              </Dropdown>
            </>
          }
        >
          <Row style={{ lineHeight: 2.5 }} onClick={()=> onClick(item, tab)}>
            <div style={{ width: '95%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={item.scene_name||''}>
              <b>场景：</b>{item.scene_name || '无'}
            </div>
            <div><b>创建时间：</b>{transferTime2CN(item.create_time) || '无'}</div>
            <div><b>更新时间：</b>{transferTime2CN(item.update_time) || '无'}</div>
            <div style={{ width: '95%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <b>描述：</b>{item.description || '无'}
            </div>
          </Row>
        </Card>
      </List.Item>
    )
  }

  return (
    <div className="ability">
      <Layout style={{ backgroundColor: '#fff' }}>
        {
          tabItem.map(tab => {
            return <div style={{ padding: '20px 0' }} key={tab.name}>
              <div className="ability-title">{tab.name}</div>
              <Button type="primary" className="add-btn" ghost onClick={() => onAdd(tab)}>{tab.addtitle}</Button>
              <List
                bordered={tab.dataSource.length === 0}
                grid={{ gutter: 16, xs: 3, sm: 3, md: 3, lg: 3, xl: 3, xxl: 3, }}
                dataSource={tab.dataSource}
                loading={tab.loading}
                renderItem={item => renderCardItem(item, tab)}
              />
            </div>
          })
        }
        {
          visible &&
          <AbilityModal
            visible={visible}
            domain={domain}
            title={title}
            formData={currentAbility}
            totalList={totalList}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        }
      </Layout>
    </div>
  );
}