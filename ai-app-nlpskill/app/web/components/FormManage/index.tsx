import React from 'react';
import { Form, Input, Select, Radio, InputNumber, Switch, Tooltip, Icon } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import { MultiInputGroup } from '../InputGroup/multi';
import { InputGroup } from '../InputGroup';

type FormType = {
  // 表单布局
  layout?: 'horizontal'|'vertical'|'inline',
  // 标签布局
  labelCol?: object,
  // 输入控件布局
  wrapperCol?: object,
  // 是否显示 label 后冒号
  colon: boolean,
  // label 标签对齐方式
  labelAlign?: 'left' | 'right',
  items: any[],
  form: WrappedFormUtils,
  formData?: object,
  style?: object,
  onValuesChange?: () => void
  onChange?: (data: any) => void
}

export const FormManage = (name: string) =>
  Form.create({ name })(
    React.forwardRef(({
      layout, labelCol, wrapperCol, colon, items, form, formData, style, onValuesChange
    }: FormType, ref) => {

    const renderFields = (item) => {
      switch (item.type) {
        case 'textarea':
          return (
          <Input.TextArea
            style={{ width: item.width, maxWidth: item.width }}
            rows={3}
            disabled={!!item.disabled}
            placeholder={item.placeholder || ''}
            onBlur={() => {!!onValuesChange && onValuesChange()}}
          />)
        case 'switch':
          return <Switch checkedChildren="是" unCheckedChildren="否" />
        case 'select':
          return (
            <Select
              style={{ width: item.width }}
              placeholder={item.placeholder || ''}
              disabled={!!item.disabled}
              onBlur={() => {!!onValuesChange && onValuesChange()}}
            >
              { (item.options || []).map((o, i) => (
                <Select.Option key={i} value={o.value}>
                  {o.label}
                </Select.Option>
              )) }
            </Select>
          )
        case 'radio':
          return <Radio.Group>
              { (item.radios || []).map((r, i) => (
                <Radio key={i} value={r.value} disabled={!!item.disabled}>{r.label}</Radio>
              )) }
            </Radio.Group>
        case 'text':
          return <span>{item.content}</span>
        case 'inputnumber':
          return <InputNumber />
        case 'multi':
          return <MultiInputGroup name={item.name} style={{ width: item.width }} onChange={item.onChange} />
        case 'custom':
          return <InputGroup name={item.name || item.label} style={{ width: item.width }} groupHidden={item.groupHidden} extraNode={item.extraNode} extraInput={item.extraInput} />
        default:
          return (
            <Input
              allowClear
              prefix={item.prefix}
              placeholder={item.placeholder || ''}
              disabled={!!item.disabled}
              onBlur={() => {!!onValuesChange && onValuesChange()}}
              style={{ width: item.width }} />
          )
      }
    }

    return (
      <Form
        style={style}
        layout={ layout || 'horizontal' }
        colon={ colon }
        labelCol={ labelCol || { sm: { span: 6 }, xs: { span: 6 }, }}
        wrapperCol={ wrapperCol || { sm: { span: 16 }, xs: { span: 16 }, }}
      >
        {
          items && items.map((item: any, index: number) => (
            <Form.Item
              key={index}
              label={ item.label ?
                <span style={{ fontWeight: 'bold' }}>
                  {item.label}
                  {
                    item.tooltip &&
                    <Tooltip title={item.tooltip} placement="right">
                      <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                    </Tooltip>
                  }
                </span>:null}
              extra={item.extra || null} style={{ width: item.itemWidth }}
            >
              {
                form.getFieldDecorator<any>(item.key, {
                  rules: item.rules || null,
                  initialValue: item.initialValue || (formData?formData[item.key] : null),
                  valuePropName: item.type === 'switch' ? 'checked' : 'value'
                })(renderFields(item))
              }
            </Form.Item>
          ))
        }
      </Form>
    )
  })) as any
