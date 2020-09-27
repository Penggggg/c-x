import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, message, notification } from 'antd';

import { deleteEntity, updateEntity, addEntity } from '../../../api/entity';
import { headerType, demoContent, illustration } from '../static';
import { TableColumns } from '../../../components/TableColumns';
import { TableManage } from '../../../components/TableManage';
import ImportManage from '../../../components/ImportManage';
import { EntityModal } from '../components/entitymodal';
import { transferTime2CN } from '../../../util/time';
import { useStore } from '../../../store';
import { EntityInstance } from '../type';
import { http } from '@cvte/ai-web-util/util';

export const MyEntity = () => {
  const [currentEntity, setCurrentEntity] = useState<EntityInstance>();
  const [selectedRowKeys, setSelectedRowKeys] = useState('');
  const [ability, setAbility] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const { AbilityC } = useStore( );
  const tableRef = useRef(null);

  useEffect(() => {
    const item = AbilityC.selectAbility;
    setAbility(item);
		item && setUrl(`/t-apis/v1/nlp/entity/${item.algorithmn_id}`);
  }, [])

  // 删除实体
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
        deleteEntity(ability.algorithmn_id, selectedRowKeys).then(res => {
          if (res.status && res.status === 200) {
            setReload(!reload);
            setSelectedRowKeys('');
          }
        })
      }
    });
  }

  // 初始化 table 列
  const columns = useMemo(() => TableColumns({
    entity_name: {
      title: '实体名',
      width: '20%',
      render: (text, record) => <a onClick={() => {
        setCurrentEntity(record);
        setTitle('编辑实体');
        setVisible(true);
      }}>{text}</a>
    },
    created_at: {
      title: "创建时间",
      width: 180,
			render: (text) => <span>{transferTime2CN(text)}</span>
		},
		updated_at: {
      title: "更新时间",
      width: 180,
			render: (text) => <span>{transferTime2CN(text)}</span>
		},
    description: {
      title: '描述',
      width: '40%',
    }
  }), [reload, ability])

  // 创建实体
  const createEntity = () => {
    setTitle('创建实体');
    setVisible(true);
  }

  // 关闭弹框
  const onClose = () => {
    setVisible(false);
    setTitle('');
    setReload(!reload);
    setCurrentEntity(undefined);
  }

  const onSave = (data) => {
    if (!currentEntity || Object.keys(currentEntity).length === 0) {
      return addEntity(ability.algorithmn_id, data)
    }
    return updateEntity(ability.algorithmn_id, currentEntity.entity_id, data)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // 导入
  const onImport = (entityArray) => {
    let entityList: any = [];
    let result: any = [];

    try {
      entityArray.forEach(entity => {
        const index = JSON.parse(JSON.stringify(entityList)).findIndex(e => e.entity_name === entity.entity_name);
        if (index !== -1) {
          entityList[index].dictionary_list.push({
            value: entity.dictionary_value,
            data_type: entity.dictionary_type === '正则表达式'?'pattern':'entry',
            synonyms: Number(entity.dictionary_synonyms)===0?null:entity.dictionary_synonyms.split('|')
          })
        } else {
          let obj = {
            entity_name: entity.entity_name,
            dictionary_list: [{
              value: entity.dictionary_value,
              data_type: entity.dictionary_type === '正则表达式'?'pattern':'entry',
              synonyms: Number(entity.dictionary_synonyms)===0 || !entity.dictionary_synonyms?null:entity.dictionary_synonyms.split('|')
            }]
          }
          entityList.push(obj);
        }
      })
      importConfirm(entityList, result)
    } catch (error) {
      console.log('导入出错 :>> ', error);
    }
  }

  // 确认导入，调用添加接口
  const importConfirm = async(entityList, result) => {
    let successNum = 0;
    entityList && entityList.length>0 &&
    entityList.forEach((e, index) => {
      addEntity(ability.algorithmn_id, e, 'add').then((res:any) => {
        if (res.status && res.status !== 200) {
          result.push(`【${e.entity_name}】导入失败，${res.message || '请求失败'}`);
        }
        if (res.status && res.status === 200) ++successNum;
        if (index === entityList.length-1) importResult(result, successNum);
      }).catch(error => {
        console.log('error :>> ', error);
        result.push(`【${e.entity_name}】导入失败，${error.message || '请求出错'}`);
        if (index === entityList.length-1) importResult(result, successNum);
      })
    })
  }

  // 导入结果提示
  const importResult = (result, successNum) => {
    const newResult = Array.from(new Set(result));
    setReload(!reload);
    notification.warning({
      message: <span>提示（导入成功 {successNum} 条，{newResult.length === 0?'失败 0 条':'失败信息如下'}）</span>,
      duration: result.length !==0?60:10,
      style: result.length !==0?{ width: 550, marginLeft: 384 - 550 }:undefined,
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
    const res = await http.get({
      url: `/t-apis/v1/nlp/entity/${ability.algorithmn_id}`,
      params
    });
    let dataSource: any = res.data;
    const entityList = dataSource.instances || [];
    if (!entityList || entityList.length === 0) {
      notification.warning({
        message: '提示',
        description: '数据列表为空'
      })
      return
    }
    const formatEntity: any = [];
    entityList.map(entity => {
      entity.dictionary_list && entity.dictionary_list.length !== 0 &&
      entity.dictionary_list.map(dic => {
        formatEntity.push({
          entity_name: entity.entity_name,
          dictionary_value: dic.value,
          dictionary_type: dic.data_type === 'pattern'?'正则表达式':'同义词',
          dictionary_synonyms: dic.synonyms?dic.synonyms.join('|'):''
        })
      })
    })
    const header = ['实体名', '词条名', '词条类型', '词条列表'];
    return { header, content: formatEntity, name: 'entity' }
  }

  return (
    <div className="my-entity">
      {/* 工具栏 */}
      <Button type="primary" icon="plus" onClick={createEntity}>创建实体</Button>
      <div className="icon-tools">
        <ImportManage
          type={headerType}
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
          baseprops={{
            rowKey: 'entity_id',
            rowSelection,
          }}
        />
      }
      {/* 弹框 */}
      {
        visible &&
        <EntityModal
          title={title}
          visible={visible}
          formData={currentEntity}
          onSave={onSave}
          onClose={onClose}
        />
      }
    </div>
  )
}