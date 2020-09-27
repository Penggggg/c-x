import React, { useState, useEffect, useMemo } from 'react';
import { Divider, Input, Icon, Tooltip, Modal } from 'antd';

import { useStore } from '../../../store';
import { SkillInstance } from '../type';
import { getSkill, addSkill, deleteSkill } from '../../../api/skill';

interface SkillProps {
  selectSkill: SkillInstance | undefined,
  onSelectSkill: (skill) => void,
  onChangeSkill: (skill) => void
}

export const Skill = ({ selectSkill, onSelectSkill, onChangeSkill }: SkillProps) => {
  const [ability, setAbility] = useState<any>();
  const [skill, setSkill] = useState<any>();
  const [hoverSkill, setHoverSkill] = useState<any>();
  const [skillName, setSkillName] = useState('');
  const { AbilityC } = useStore( );
  useEffect(() => {
    const item = AbilityC.selectAbility;
    setAbility(item);
		initData(item);
  }, [])

  const initData = (item?) => {
    getSkill(item?item.algorithmn_id : ability.algorithmn_id).then((res:any) => {
      if (res.status === 200) {
        const data = res.data.instances;
        setSkill(data);
        onChangeSkill(data);
      }
    })
  }

  // 点击技能列表
  const onClick = (skill) => {
    if (selectSkill && skill.skill_name === selectSkill.skill_name) {
      onSelectSkill({});
    } else {
      onSelectSkill(skill);
    }
  }

  // 技能列表
  const renderSkillList = useMemo(() => (
    skill && skill.map((s, index) => {
      return (
        <div
          className={selectSkill && selectSkill.skill_name === s.skill_name?"skill-item skill-item-active":"skill-item"}
          key={index}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHoverSkill(s)
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setHoverSkill(undefined)
          }}
          onClick={() => onClick(s)}
        >
          <Tooltip title={s.skill_name}>
            <span className="skill-item-title">{s.skill_name}</span>
          </Tooltip>
          {
            hoverSkill && s.skill_name === hoverSkill.skill_name &&
            <Tooltip title="删除">
              <Icon
                type="close"
                style={{ color: 'red', position: 'absolute', right: 5, top: 13, cursor: 'pointer' }}
                onClick={(e) => onDelete(e, s)}
              />
            </Tooltip>
          }
        </div>
      )
    })
  ), [skill, selectSkill, hoverSkill])

  // 添加技能
  const onAddSkill = (e?) => {
    const value = e?e.target.value:skillName;
    if (!value) return;
    addSkill(ability.algorithmn_id, { skill_name: value }).then(res => {
      if (res.status === 200) {
        setSkillName('');
        initData();
      }
    })
  }

  // 点击删除
  const onDelete = (e, value) => {
    if(e.stopPropagation){
      e.stopPropagation();
    }
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        if (selectSkill && selectSkill.skill_id && value.skill_id === selectSkill.skill_id) {
          onSelectSkill({})
        }
        deleteSkill(ability.algorithmn_id, value.skill_id).then(res => {
          if (res.status === 200) {
            initData();
          }
        })
      }
    });
  }

  return (
    <div className="skill">
      <h3>技能列表</h3>
      <Tooltip
        trigger={'focus'}
        title="输入名称，按 Enter 或点 + 号添加"
        placement="topLeft"
      >
        <Input
          value={skillName}
          placeholder="添加技能"
          style={{ marginBottom: 10 }}
          onPressEnter={onAddSkill}
          prefix={
            <Tooltip
              title="技能是管理意图的一个超集. 可以看作是意图的大分类，创建技能以方便你管理意图。
                一个技能下面可能有多个意图： 例如音乐播放[技能]，可能会有以下意图：点歌，播放，暂停。"
            >
              <Icon type="question-circle-o" />
            </Tooltip>
          }
          onChange={e => setSkillName(e.target.value)}
          addonAfter={
            <Icon type="plus" style={{ color: '#1890ff' }} onClick={()=> onAddSkill()} />
          }
        />
      </Tooltip>
      <Divider />
      <div className="skill-content">
        { renderSkillList }
      </div>
    </div>
  )
}