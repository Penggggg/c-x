import React, { useEffect, useState } from 'react';
import { Icon, Button, Divider, Modal } from 'antd';

import { transferTime2CN } from '../../util/time';
import { AbilityInstance } from '../ability/type';
import { useStore } from '../../store';
import './index.less';
import { chattingTest } from '../../api/version';
import { NlpDialogTest } from '../../containers';
import queryString from 'query-string';
import { http } from '@cvte/ai-web-util/util';

export const Banner = (props) => {
  const [ dialog, dialog$ ] = useState( false );
	const [ability, setAbility] = useState<AbilityInstance>();
  const { AbilityC } = useStore( );

	useEffect(() => {
    const localItem = localStorage.getItem('item')? JSON.parse(localStorage.getItem('item') ||'{}') : null;
    if (!localItem) {
      const { location } = props.history;
      const { search } = location;
      const searchParam = queryString.parse(search);
      if (searchParam.abilityId) {
        initCurrentAbility(searchParam.abilityId)
      }
      return;
    }
		const item = AbilityC.selectAbility;
    if (localItem && localItem.algorithmn_id && (localItem.algorithmn_id !== item.algorithmn_id)) {
      AbilityC.setselectAbility(localItem);
      setAbility(localItem);
      return;
    }
    item && setAbility(item);
  }, [])

  // 根据ID获取当前能力
  const initCurrentAbility = async (id) => {
    const res = await http.get({
      errorTips: false,
      url: `/t-apis/v1/algorithmn/${id}`
    });
    if (res.status && res.status === 200) {
      let item: any = res.data;
      item.algorithmn_id = Number(id);
      AbilityC.setselectAbility(item);
      localStorage.setItem('item', JSON.stringify(item));
      location.reload();
    }
  }

  const onSave = () => {
    Modal.confirm({
      title: '确认训练？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        chattingTest(ability?.algorithmn_id)
      }
    });
  }

  return (
    <div className="banner">
      <div className="banner-back" onClick={()=>props.history.push('/ability')}>
        <Icon type="arrow-left" /> 能力列表
      </div>
      <div>
        <span className="banner-title">
          <Icon type="smile" theme="twoTone" twoToneColor="#fb8c00" />
          {ability ? ability.algorithmn_name : ''}
        </span>
        {/* <span className="banner-title">seewo售后客服对话</span> */}
      </div>
      <div className="banner-btn">
        {/* <Button type="primary">版本保存</Button><br /> */}
        {/* <Button onClick={onSave} type="primary" ghost>训练</Button> */}
        <Button.Group>
          <Button onClick={onSave}>训练</Button>
          <Button onClick={( ) => dialog$( true )}>测试</Button>
        </Button.Group>
      </div>
      <div className="banner-time">最后更新：{ability && ability.update_time ?transferTime2CN(ability.update_time):'无'}</div>
      <Divider style={{ margin: 0 }} />
      {
          !!ability && (
            <NlpDialogTest 
              show={ dialog }
              robotPrefix='nlp_dev_'
              abilityId={ ability.algorithmn_id }
              onClose={( ) => dialog$( false )}
            />
          )
      }
      
  </div>
  )
}