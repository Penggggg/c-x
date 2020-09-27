import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Card, Button, Badge, Modal } from 'antd';

import './index.less';
import { AudioWave } from '../audio-wave';
import { AudioLabelTable } from '../audio-label-table';

type labelTag = {
  id: string
  name: string
  [key: string ]: any
}

type labelContent = {
  id?: string,
  label: string,
  start: number,
  end: number
  tags?: labelTag[],
}

interface Props {
  url: string,
  canAction: boolean,
  tags: Array<any>,
  labeledList: Array<labelContent>,
  onCreateLabel: (value: any) => void,
  onUpdateLabel: (value: any) => void,
  onDeleteLabel: (value: any) => void,
  onSave: (result: labelContent[]) => void
}

export const AudioWaveLabel = ( { url, labeledList, tags, canAction, onCreateLabel, onUpdateLabel, onDeleteLabel, onSave }: Props) => {
  // 当前选中区域
  const [current, setCurrent] = useState<any>({});
  const currentRef = useRef(current);
  currentRef.current = current;
  // 所有选中区域
  const [regions, setRegions] = useState<Array<labelContent>>([]);
  const regionsRef = useRef(regions);
  regionsRef.current = regions;
  // 音频
  const waveRef = useRef<{[ key: string ]: any }>({});
  // 有效性
  // const [isEffective, setIsEffective] = useState(true);

  useEffect(() => {
    if (labeledList.length === 0) setRegions([]);
  }, [url])

  // region 改变
  const onRegionChange = (value: any, r?: any) => {
    let arr = regionsRef.current;
    let index = arr && arr.findIndex(item => item.id === value.id);
    // 双击删除 region
    if (value.delete && index !== -1) {
      updateRegions(value);
      setCurrent({});
      return
    }
    (currentRef.current.id !== value.id && currentRef.current.element) &&
    (currentRef.current.element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)');
    // 更新 region
    if (index !== -1 ) {
      arr.splice(index, 1, {...value, label: arr[index].label, tags: arr[index].tags});
      setRegions(arr.slice(0));
      setCurrent({...value, label: arr[index].label, tags: arr[index].tags});
      return
    }
    // 添加 region
    setCurrent({...value});
    setRegions(r ? [...r] : [...arr, {...value}].slice(0));
  };

  // 输入内容改变
  const onLabelChange = (e: { target: { value: string; }; }) => {
    if (!e || !e.target) return;
    let label = e.target.value || '';
    setCurrent({...current, label});
    let index = regions.findIndex(item => item.id === currentRef.current.id);
    if (index === -1) return;
    let arr = regions;
    arr[index] = {...regions[index], label};
    setRegions(arr);
  }

  // 更新 regions
  const updateRegions = (value: any) => {
    let arr = regionsRef.current;
    let index = arr && arr.findIndex(item => item.id === value.id);
    arr.splice(index, 1);
    currentRef.current.element &&
    (currentRef.current.element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)');
    setRegions(arr.slice(0));
  }

  // 提交标注申请
  const onSubmit = () => {
    const arr = regions && regions.map(region => {
      return {
        id: region.id,
        start: Number(region.start.toFixed(3)),
        end: Number(region.end.toFixed(3)),
        label: region.label || '',
        tags: region.tags || [],
      }
    })
    onSave(arr);
  };

  // 表格行点击事件
  const onRowClick = (region: any) => {
    current.element && (current.element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)');
    region.element.style.backgroundColor = 'rgba(128, 128, 128, 0.6)';
    waveRef?.current?.updateRegion(region);
  }

  // 点击删除操作
  const onDelete = (record: any) => {
    Modal.confirm({
      title: '确定删除?',
      onOk() {
        if (current === record) {
          setCurrent({});
          waveRef?.current?.updateRegion({});
        }
        record.wavesurfer.regions.list[record.id].remove();
        updateRegions(record);
      },
    });
  }

  // 删除标签
  const onDelLabel = (value: any) => {
    Modal.confirm({
      title: '确定删除该标签?',
      onOk() {
        onDeleteLabel(value);
      },
    });
  }

  // 保存标签
  const onSaveLabel = (object: any) => {
    setCurrent(object);
    let index = regions.findIndex(item => item.id === currentRef.current.id);
    if (index === -1) return;
    let arr = regions;
    arr[index] = object;
    setRegions(arr.slice(0));
  }

  return (
    <div className="audio-label">
      <Card title="音频标注" size="small">
        {/* 音频展示 */}
        <AudioWave
          url={url}
          ref={waveRef}
          canAction={canAction}
          labeledList={labeledList}
          onRegionChange={onRegionChange}
        />
        {/* 已标注列表 */}
        <Card
          size="small"
          title={<Badge style={{ backgroundColor: '#52c41a' }} count={regions.length} offset={[20, 6]}>已标注列表</Badge>}
          extra={
            <Fragment>
              {/* 音频有效性：
              <Switch
                checkedChildren="有效"
                unCheckedChildren="无效"
                defaultChecked
                onChange={(value) => setIsEffective(value)}
              /> */}
              <Button type="primary" className="submit-button" onClick={onSubmit}>提交</Button>
            </Fragment>
          }
        >
          <AudioLabelTable
            id={current.id}
            regions={regions}
            canAction={canAction}
            tags={tags}
            onSave={onSaveLabel}
            onDelete={onDelete}
            onCreateLabel={onCreateLabel}
            onUpdateLabel={onUpdateLabel}
            onDeleteLabel={onDelLabel}
            onRowClick={onRowClick}
            onLabelChange={onLabelChange}
          />
        </Card>
      </Card>
    </div>
  );
}