import React, { useMemo, useState, useEffect } from 'react';
import { Switch, message } from 'antd';
import { http } from '@cvte/ai-web-util/util';

import { TableColumns } from '../../../components/TableColumns';
import { TableManage } from '../../../components/TableManage';
import { transferTime2CN } from '../../../util/time';
import { useStore } from '../../../store';
import { switchSysEntity } from '../../../api/entity';

export const SysEntity = () => {
  const [ability, setAbility] = useState<any>({});
  const [isCheck, setIsCheck] = useState(false);
  const { AbilityC } = useStore( );

  useEffect(() => {
    const item = AbilityC.selectAbility;
		setAbility(item);
  }, [])

  const columns = useMemo(() => TableColumns({
    entity_name: {
      title: '实体名',
      width: '20%',
      render: (text) => <span>{text}</span>
    },
    created_at: {
      title: "创建时间",
      width: 180,
			render: (text) => <span>{transferTime2CN(text)}</span>
		},
    description: {
      title: '描述',
      width: '40%',
      render: (text) => <span>{text || '无'}</span>
    },
    is_open: {
      title: '是否开启',
      width: 100,
      render: (text, record) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          checked={!!text}
          onChange={(checked) => onChange(checked, record)}
        />
      )
    }
  }), [ability, isCheck])

  const onChange = (checked, record) => {
    record.is_open = checked;
    switchSysEntity(ability.algorithmn_id, {
      entity_id: record.entity_id,
      opt: checked ? 1 : -1
    }).then(res => {
      if (res.status !== 200) return;
      setIsCheck(!isCheck);
    }).catch(err => {
      message.error('操作失败')
    })
  }


  return (
    <div className="sys-entity">
      {
        ability && Object.keys(ability).length !== 0 &&
        <TableManage
          columns={columns}
          url={`/t-apis/v1/nlp/sysEntity/${ability.algorithmn_id}`}
          baseprops={{
            rowKey: 'entity_id',
          }}
        />
      }
    </div>
  )
}