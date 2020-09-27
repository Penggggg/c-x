import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, message, notification } from 'antd';
import { http } from '@cvte/ai-web-util/util';

import { addIntention, updateIntention, deleteIntention } from '../../../api/intention';
import { headerType, demoContent, illustration } from '../static';
import { TableColumns } from '../../../components/TableColumns';
import { TableManage } from '../../../components/TableManage';
import ImportManage from '../../../components/ImportManage';
import { transferTime2CN } from '../../../util/time';
import { IntentModal } from './intentmodal';
import { IntentsInstance } from '../type';
import { useStore } from '../../../store';
import moment from 'moment';

export const Intent = ({ skill, selectSkill, isSkillEmpty, deleteFlag}) => {
  const [currentIntents, setCurrentIntents] = useState<IntentsInstance>();
  const [selectedRowKeys, setSelectedRowKeys] = useState('');
  const [visible, setVisible] = useState(false);
  const [ability, setAbility] = useState<any>();
  const [reload, setReload] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const { AbilityC } = useStore( );
  const tableRef = useRef(null);
  const [entityAll, setEntityAll] = useState<any>();

  useEffect(() => {
    const item = AbilityC.selectAbility;
    if (!item) return;
    setAbility(item);
    setUrl(`/t-apis/v1/nlp/intention/${item.algorithmn_id}`);
    getEntity(item)
  }, [])

  // 获取实体列表
  const getEntity = (item) => {
    const getEntity = http.get({
      url: `/t-apis/v1/nlp/entity/${item.algorithmn_id}`,
      errorTips: false
    })
    const getSys= http.get({
      url: `/t-apis/v1/nlp/sysEntity/${item.algorithmn_id}`,
      errorTips: false
    })
    Promise.all([getEntity, getSys]).then((res:any) => {
      const entityList = res[0].data.instances;
      const sysEntityList = res[1].data.instances;
      setEntityAll({ entityList, sysEntityList })
    })
  }

  // 删除意图
  const onDelete = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的数据');
      return;
    }
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteIntention(ability.algorithmn_id, selectedRowKeys).then(res => {
          if (res.status && res.status === 200) {
            setReload(!reload);
            setSelectedRowKeys('');
          }
        })
      }
    });
  }

  // 初始化 table 列
  const columns = useMemo(
    () =>
      TableColumns(
        {
          intention_name: {
            title: '意图',
            width: '50%',
            render: (text, record) => <a onClick={() => {
              setCurrentIntents(record);
              setTitle('编辑意图');
              setVisible(true);
            }}>{text}</a>
          },
          created_at: {
            title: '创建时间',
            sorter: (a, b) => moment(a.created_at).valueOf()  - moment(b.created_at).valueOf(),
            sortDirections: ['descend', 'ascend'],
            render: text => transferTime2CN(text)
          },
          updated_at: {
            title: '修改时间',
            sorter: (a, b) => moment(a.updated_at).valueOf()  - moment(b.updated_at).valueOf(),
            sortDirections: ['descend', 'ascend'],
            render: text => transferTime2CN(text)
          },
        }
      ),
    [reload, isSkillEmpty, selectSkill, deleteFlag]
  );

  // 创建实体
  const createEntity = () => {
    if (isSkillEmpty) {
      message.warning('当前技能列表为空，请先添加技能');
      return;
    }
    setTitle('创建意图');
    setVisible(true);
  };

  // 关闭弹框
  const onClose = () => {
    setVisible(false);
    setTitle('');
    setReload(!reload);
    setCurrentIntents(undefined);
  };

  const onSave = (data) => {
    if (!currentIntents || Object.keys(currentIntents).length === 0) {
      return addIntention(ability.algorithmn_id, data)
    }
    return updateIntention(ability.algorithmn_id, currentIntents.intention_id, data)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // 导入
  const onImport = (array) => {
    let intentList: any = [];
    let result: any = [];

    try {
      array.forEach(intent => {
        const skillIndex = skill.findIndex(s => s.skill_name === intent.skill_name);
        if (intent.skill_name && skillIndex === -1) {
          result.push(`【${intent.intention_name}】意图导入失败，【${intent.skill_name}】技能不存在，请先添加该技能`)
          return;
        }
        let slots:any = [];
        if (intent.slot_list && entityAll && Object.keys(entityAll).length >0) {
          slots = slotFormat(intent, result);
        }
        const index = JSON.parse(JSON.stringify(intentList)).findIndex(e =>
          ((e.intention_name === intent.intention_name) && (e.skill_refer === skill[skillIndex].skill_id))
        );
        if (index !== -1) {
          intentList[index].dialog[0].similar_query.push(intent.similar_query)
        } else {
          intentList.push({
            intention_name: intent.intention_name,
            skill_refer: skill[skillIndex].skill_id,
            slots,
            dialog: [
              {
                query: intent.intention_name,
                answer: intent.answer.replace(/<br\/>/ig, "\n"),
                similar_query: [intent.similar_query]
              }
            ]
          })
        }
      })
      importConfirm(intentList, result);
    } catch (error) {
      console.log('导入出错 :>> ', error);
    }
  }

  // 槽位信息参数格式
  const slotFormat = (intent, result) => {
    let slots:any = [];

    const entityList = entityAll.entityList;
    const sysEntityList = entityAll.sysEntityList;
    const slotArr = intent.slot_list.split(',');
    slotArr && slotArr.forEach(slot => {
      if (!slot) return;
      let entityname = slot;
      if (slot.indexOf('@') !== -1) {
        entityname = slot.split('@')[1];
        const entityIndex = entityList.findIndex(e => entityname === e.entity_name);
        const sysIndex = sysEntityList.findIndex(e => entityname === e.entity_name)
        if (entityIndex === -1 && sysIndex === -1) {
          result.push(`【${intent.intention_name}】意图中【${entityname}】实体不存在，对应槽位信息导入失败`)
          return;
        }
        const entity_id = entityList[entityIndex]?entityList[entityIndex].entity_id : sysEntityList[sysIndex].entity_id
        slots.push({
          slot_name: `${slot}#${intent.intention_name}`,
          entity_id,
          slot_alias: ''
        })
      }
    })
    return slots;
  }

  // 确认导入，调用添加接口
  const importConfirm = (intentList, result) => {
    let successNum = 0;
    intentList && intentList.length > 0 &&
    intentList.forEach((i, index) => {
      addIntention(ability.algorithmn_id, i, 'add').then((res:any) => {
        if (res.status && res.status !== 200) {
          result.push(`【${i.intention_name}】导入失败，${res.message || '请求失败'}`);
        }
        if (res.status && res.status === 200) ++successNum;
        if (index === intentList.length - 1) importResult(result, successNum);
      }).catch(error => {
        console.log('error :>> ', error);
        result.push(`【${i.intention_name}】导入失败，${error.message || '请求出错'}`);
        if (index === intentList.length - 1) importResult(result, successNum);
      })
    })
  }

  // 导入结果提示
  const importResult = (result, successNum) => {
    const newResult = Array.from(new Set(result));
    setReload(!reload);
    notification.warning({
      message: <span>提示（导入成功 {successNum} 条，{newResult.length === 0?'失败 0 条':'失败信息如下'} ）</span>,
      duration: result.length !==0?60:10,
      style: result.length !==0?{ width: 600, marginLeft: 384 - 600 }:undefined,
      description: <div>
        { result.length !==0 ? newResult.map((r, index) => <span key={index}>{r}<br /></span>):'全部导入成功' }
      </div>
    })
  }

  // 导出
  const onExport = async() => {
    let params = {
      page: 1,
      size: 9999
    }
    selectSkill && selectSkill.skill_id && (params['skill_id'] = selectSkill.skill_id);
    const res = await http.get({
      url: `/t-apis/v1/nlp/intention/${ability.algorithmn_id}`,
      params
    });
    let dataSource: any = res.data;

    const intentList = dataSource.intentions || [];
    if (!intentList || intentList.length === 0) {
      notification.warning({
        message: '提示',
        description: '数据列表为空'
      })
      return
    }
    const formatIntent: any = [];
    intentList.map(intent => {
      const index = skill.findIndex(s => s.skill_id === intent.skill_refer);
      const dialog = intent.dialog || [];
      let slot_list = '';
      if (intent.slot_list) {
        const slotArr = intent.slot_list.split(',');
        const newSlot = slotArr.map(slot => slot && slot.split('#')[0]);
        slot_list = newSlot.join(',');
      }
      dialog.length >0 && dialog[0].similar_query.forEach(s => {
        formatIntent.push({
          intention_name: intent.intention_name,
          skill_name: skill[index].skill_name,
          slot_list,
          similar_query: s,
          answer: dialog[0].answer.replace(/\n/g,"<br/>")
        })
      })
    })
    const header = ['技能', '意图名', '槽位', '对话范例', '默认回复'];
    return { header, content: formatIntent, name: 'intent' }
  }

  return (
    <div className="intents">
      {/* 工具栏 */}
      <Button type="primary" icon="plus" onClick={createEntity}>
        创建意图
      </Button>
      <div className="icon-tools">
        <ImportManage
          type={headerType}
          separator="###"
          demoContent={demoContent}
          illustration={illustration}
          onImport={onImport}
          onExport={onExport} />
        <Tooltip title="删除">
          <Button icon="delete" onClick={onDelete} type="danger" />
        </Tooltip>
      </div>
      {/* table */}
      {
        url &&
        <TableManage
          ref={tableRef}
          columns={columns}
          url={url}
          fetchParams={selectSkill && selectSkill.skill_id ?{skill_id: selectSkill.skill_id}:null}
          baseprops={{
            rowKey: 'intention_id',
            rowSelection,
          }}
        />
      }
      {/* 弹框 */}
      {visible && (
        <IntentModal
          title={title}
          visible={visible}
          selectSkill={selectSkill}
          formData={currentIntents}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </div>
  );
};
