import React, { forwardRef, useState, useEffect } from 'react';
import { Input, Icon, Select, message } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { useStore } from '../../store';

export const MultiInputGroup = forwardRef((props: any, ref) => {
  const { AbilityC } = useStore( );
  const [entityOption, setEntityOption] = useState<any>([]);

  useEffect(() => {
    initEntityData()
  }, [])

  const initEntityData = () => {
    const item = AbilityC.selectAbility;

    http.get({
      url: `/t-apis/v1/nlp/entity/${item.algorithmn_id}`
    }).then(res => {
      if (res.status && res.status === 200) {
        let dataSource: any = res.data;
        if (!dataSource || !dataSource.instances) return;
        const option = dataSource.instances.map(i => ({
          label: i.entity_name,
          value: i.entity_id
        }))
        const optionObj = { group: '自定义实体', option };
        initSysEntityData(item, optionObj)
      } else {
        initSysEntityData(item)
      }
    }).catch(err => {
      initSysEntityData(item)
    })
  }

  const initSysEntityData = (item, optionObj?) => {
    http.get({
      url: `/t-apis/v1/nlp/sysEntity/${item.algorithmn_id}`
    }).then(res => {
      let dataSource: any = res.data;
      if (!dataSource || !dataSource.instances) return;
      const option = dataSource.instances.map(i => ({
        label: i.entity_name,
        value: i.entity_id,
        disabled: !i.is_open
      }))
      setEntityOption([...entityOption, optionObj, { group: '内置实体', option }]);
    })
  }

  let value = props.value || [];

  const handleChange = (data, index, name) => {
    const temp = JSON.parse(JSON.stringify(value));
    const slot_name = temp[index].slot_name;
    if (!data) return;
    if (name === 'entity_id') {
      value[index]['entity_name'] = data.label || data.props.children;
      value[index][name] = data.key;
    } else if (name === 'slot_name' && !value[index]['entity_name'] && value[index]['entity_id']) {
      value[index][name] = `${data}@${slot_name.split('@')[1]}`;
    } else {
      value[index][name] = data;
    }
    props.onChange(value);
  }
  const handleRemove = (index) => {
    value.splice(index, 1);
    props.onChange(value);
  }
  const handleAdd = () => {
    const flag = value && value.some(item => !item);
    if (flag) {
      message.warning(`请先完善当前数据`);
      return;
    }
    if (!value) value = [];
    value.push({ slot_name: '', entity_id: '', slot_alias: '' });
    props.onChange(value);
  }

  return (
    <span>
      { props.extraNode && props.extraNode }
      <span style={{ display: 'inline-table', width: '836px' }}>
        {
          value && value.map((v, index) =>
          <Input.Group
            key={Math.random() + index}
            compact
          >
            <Input.Group compact style={{ lineHeight: '30px' }}>
              名称：
              <Input
                style={{ width: 200, marginRight: 20 }}
                defaultValue={v.slot_name?v.slot_name.split('@')[0]:''}
                onBlur={ e => handleChange(e.target.value, index, 'slot_name')}
              />
              别名：
              <Input
                style={{ width: 200, marginRight: 20 }}
                defaultValue={v.slot_alias}
                onBlur = { e => handleChange(e.target.value, index, 'slot_alias')}
              />
              关联实体：
              <Select
                style={{ width: 200 }}
                defaultValue={v.entity_id}
                onChange={(value, option) => handleChange(option, index, 'entity_id')}>
                  {
                    entityOption && entityOption.map(e => {
                      return (
                        <Select.OptGroup label={e.group} key={e.group}>
                          {
                            e.option && e.option.map(option => {
                              return <Select.Option value={option.value} key={option.value} disabled={option.disabled}>{option.label}</Select.Option>
                            })
                          }
                        </Select.OptGroup>
                      )
                    })
                  }
              </Select>
              <Icon
                type="minus-circle"
                style={{ padding: 9 }}
                onClick={ ()=>{
                  handleRemove(index)
                } }
              />
            </Input.Group>
          </Input.Group> )
        }
        <Icon
          type="plus-circle"
          theme="twoTone"
          onClick={handleAdd}/>
        <span style={{ paddingLeft: 6 }}>添加槽位</span>
      </span>
    </span>
  )
})