import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Button, Row, Col, Spin } from 'antd';
import WaveSurfer from 'wavesurfer.js';
const RegionsPlugin = require('wavesurfer.js/dist/plugin/wavesurfer.regions.min.js');
const CursorPlugin = require('wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js');

import { SliderInput } from '../slider-input';

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
  tags?: labelTag[]
}

interface Region {
  id: string,
  label: string,
  start: number,
  end: number,
  wavesurfer: WaveSurfer,
  [key: string ]: any
}

interface Props {
  url: string,
  canAction: boolean,
  labeledList: Array<labelContent>,
  onRegionChange: (region: Region, regions?: Array<Region>) => void,
}

export const AudioWave = React.forwardRef(({url, labeledList, canAction, onRegionChange}: Props, ref) => {
  // 频谱
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const waveRef = useRef(wavesurfer);
  waveRef.current = wavesurfer;
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 当前选择区域
  const [currentRegion, setCurrentRegion] = useState<any>();
  // 音频暂停所在时间
  const [time, setTime] = useState(0);
  // 音频时长
  const [duration, setDuration] = useState(0);
  // 是否正在播放
  const [isPlay, setIsplay] = useState(false);
  // 是否正在创建
  const [isCreating, setIsCreating] = useState(false);

  const regionRef = useRef(currentRegion);
  regionRef.current = currentRegion;

  useEffect(() => {
    if (waveRef.current) waveRef.current.destroy();
    if (!isCreating) init();
  }, [url, labeledList]);

  useEffect(() => {
    if (!currentRegion) return;
    onRegionChange(currentRegion);
  }, [currentRegion])

  useImperativeHandle(ref, () => ({
    updateRegion: (region: any) => setCurrentRegion(region),
  }))

  const init = () => {
    // 初始化 WaveSurfer
    const wave = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'blue',
      normalize: true,
      plugins: [
        RegionsPlugin.create(),
        CursorPlugin.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            color: '#fff',
            'font-size': '10px',
            'background-color': '#000',
          },
        }),
      ],
    });
    setIsCreating(true);
    // 已标记区域初始化
    let length = labeledList.length;
    if (labeledList && length !== 0) {
      let regions: any = [];
      labeledList.forEach(((v: any, index: number) => {
        if (length === 1  || index > length - 2) return;
        const region = addRegion(wave, v);
        updateRegionBg(region, 'deep');
        regions.push(region);
        onRegionChange(region, (index === length - 2)?regions:null);
      }));
      let obj = labeledList[length-1];
      const cregion = addRegion(wave, obj);
      (length === 1) && onRegionChange(cregion, [cregion]);
      setCurrentRegion(cregion);
    };

    // 加载音频数据
    wave.load(url);

    // 允许鼠标划选区间
    if (canAction) wave.enableDragSelection({});

    wave.on('ready', () => {
      setIsCreating(false);
      setLoading(false);
      setWavesurfer(wave);
      setTime(wave.getCurrentTime());
      setDuration(wave.getDuration());
      updateRegionBg(regionRef.current, 'deep');
    });

    wave.on('region-mouseenter', (r) => {
      updateRegionBg(r, 'deep');
    });

    wave.on('play', () => setIsplay(true));
    wave.on('pause', () => setIsplay(false));
    wave.on('finish', () => setIsplay(false));
    wave.on('audioprocess', () => setTime(wave.getCurrentTime()));

    wave.on('region-created', (r) => {
      updateRegionBg(regionRef.current, 'shalow');
      handleRegionClick(r, wave);
    })

    // 选择区域松开鼠标
    wave.on('region-update-end', (r) => {
      updateRegionBg(r, 'deep');

      wave.play(r.start, r.end);
      setCurrentRegion(r);
      if (r === regionRef.current) onRegionChange(r);
    });
  };

  // 添加区域
  const addRegion = (wave: WaveSurfer, v: any) => {
    const region = wave.addRegion({ start: v.start, end: v.end });
    region.label = v.label;
    region.tags = v.tags;
    handleRegionClick(region, wave);
    return region
  }

  // 选择区域点击事件
  const handleRegionClick = (region: any, wave: WaveSurfer) => {
    // 鼠标离开区域调用
    region.on('mouseleave', () => {
      if (regionRef.current !== region) updateRegionBg(region, 'shalow');
    })

    // 避免单击和双击冲突执行
    let clickTime: any;
    // 单击选择区域播放区域内音频
    region.on('click', (e: { stopPropagation: () => void; }) => {
      e.stopPropagation();
      clearTimeout(clickTime);
      clickTime = setTimeout(() => {
        updateRegionBg(regionRef.current, 'shalow');
        updateRegionBg(region, 'deep');
        setCurrentRegion(region);
        if (region === regionRef.current) onRegionChange(region);
        wave.play(region.start, region.end);
      }, 300);
    });

    // 无权限不能执行删除操作
    if (!canAction) return;

    // 双击区域移除当前选择区域
    region.on('dblclick', (e: { stopPropagation: () => void; }) => {
      e.stopPropagation();
      clearTimeout(clickTime);
      region.delete = true;
      updateRegionBg(region, 'shalow');
      onRegionChange(region);
      region.remove();
      if (region === regionRef.current) setCurrentRegion(null);
    });
  };

  // 修改选择区域背景颜色
  const updateRegionBg = (region: any, type: string) => {
    if (!region || !region.element) return;
    if (type === 'shalow') region.element.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    if (type === 'deep') region.element.style.backgroundColor = 'rgba(128, 128, 128, 0.6)';
  }

  // 转换展示时间格式
  const secondsToString = (seconds: any) => {
    if (!seconds) return 0;
    let timeStr = '00:';
    if (seconds >= 10) {
      timeStr += seconds.toFixed(3);
    } else {
      timeStr += `0${seconds.toFixed(3)}`;
    }
    return timeStr;
  };

  // 音量调节
  const onChangeVolume = (volume: number) => wavesurfer?.setVolume(volume);

  return (
    <div>
      <Spin spinning={loading}>
        <span style={{ color: 'red', fontSize: 12 }}>
          提示：鼠标拖拽可选择音频区域，点击已选择区域会自动播放当前区域音频
          {canAction ? '，双击区域会执行删除操作' : ''}
        </span>
        {/* 频谱展示区域 */}
        <div id="waveform" />
        {/* 播放暂停按钮以及音频时间显示 */}
        <Row className="button-tools">
          <Col span={1}>
            <Button
              type="primary"
              shape="circle"
              icon={isPlay ? 'pause' :'caret-right'}
              onClick={() => { wavesurfer && (isPlay ? wavesurfer.pause() : wavesurfer.play()); }}
            />
          </Col>
          <Col span={5}>
            <span className="time-show">
              {`${secondsToString(time)} / ${secondsToString(duration)}`}
            </span>
          </Col>
          <Col span={4} offset={14}>
            {
              wavesurfer &&
              <SliderInput min={0} max={1} defaultValue={Number(wavesurfer.getVolume())} onChange={onChangeVolume} />
            }
          </Col>
        </Row>
      </Spin>
    </div>
  );
})