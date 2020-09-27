import React, { useState } from 'react';
import { Slider, Icon } from 'antd';
import { SliderMarks } from 'antd/lib/slider';
import './index.less';

interface Props {
  min: number,
  max: number,
  // 步长
  step?: number,
  defaultValue: number,
  // 前缀图标
  preIcon?: string,
  // 后缀图标
  sufIcon?: string,
  disabled?: boolean,
  // 刻度标记
  marks?: SliderMarks | undefined,
  onChange: (value: number) => void
}

export const SliderInput= ({ min, max, step = 0.1, defaultValue, preIcon, sufIcon = 'sound', disabled = false, marks, onChange } : Props) => {
  const [value, setValue] = useState(0);

  const handleChange = (value: any) => {
    setValue(value);
    onChange(value);
  };

  const mid = Number(((max - min) / 2).toFixed(5));
  const preColor = value >= mid ? 'rgba(0, 0, 0, .2)' : 'rgba(0, 0, 0, .5)';
  const nextColor = value >= mid ? 'rgba(0, 0, 0, .5)' : 'rgba(0, 0, 0, .2)';
  return (
    <div className="icon-wrapper">
      {
        !!preIcon &&
        <Icon style={{ color: preColor }} type={preIcon} />
      }

      <Slider
        min={min}
        max={max}
        step={step}
        marks={marks}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange}
      />
      {
        !!sufIcon &&
        <Icon style={{ color: nextColor }} type={sufIcon} />
      }
    </div>
  );
}
