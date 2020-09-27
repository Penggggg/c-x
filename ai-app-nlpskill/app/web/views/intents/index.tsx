import React, { useMemo, useState } from 'react';
import { Row, Col } from 'antd';

import { Intent } from './components/intent';
import { Skill } from './components/skill';
import { SkillInstance } from './type';
import './index.less';

export const Intents = () => {
  const [selectSkill, setSelectSkill] = useState<SkillInstance>();
  const [isSkillEmpty, setIsSkillEmpty] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [skill, setSkill] = useState<any>([]);

  const onChangeSkill = (skillList) => {
    if (!skillList) return;
    if (skillList.length === 0) setIsSkillEmpty(true);
    if (skill && skill.length > skillList.length) setDeleteFlag(!deleteFlag);
    if (skillList.length !== 0 && isSkillEmpty) setIsSkillEmpty(false);
    setSkill(skillList);
  }

  const onSelectSkill = (skill) => {
    if (selectSkill && skill.skill_name === selectSkill.skill_name) {
      setSelectSkill(undefined);
    } else {
      setSelectSkill(skill);
    }
  }

  const renderIntent = useMemo(() => {
    return (<Intent skill={skill} selectSkill={selectSkill} isSkillEmpty={isSkillEmpty} deleteFlag={deleteFlag} />)
  } , [skill, selectSkill, isSkillEmpty, deleteFlag])

  return (
    <div className="intents-wrapper">
      <Row>
        <Col span={5}>
          <Skill selectSkill={selectSkill} onSelectSkill={onSelectSkill} onChangeSkill={onChangeSkill} />
        </Col>
        <Col span={19}>
          {renderIntent}
        </Col>
      </Row>
    </div>
  );
};
