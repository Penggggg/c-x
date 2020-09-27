import React, { forwardRef, useEffect, useState } from 'react';
import { Input, Icon, message } from 'antd';

export const InputGroup = forwardRef((props: any, ref) => {
  let value = props.value || [];
  const [name, setName] = useState(props.name || '');

  useEffect(() => {
    if (!props.extraNode) return;

    const {value} = props.extraNode.props;
    let str = "";
    if (value === "entry") str = "同义词";
    if (value === "pattern") str = "正则表达式";
    setName(str);
  }, [props])

  const handleChange = (data, index) => {
    if (!data) return;
    value[index] = data;
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
    value.push("");
    props.onChange(value);
  }

  return (
    <span>
      { props.extraNode && props.extraNode }
      {
        !props.groupHidden &&
        <span style={{ display: 'inline-table', width: 500 }}>
          {
            value && value.map((v, index) =>
            <Input.Group
              key={Math.random() + index}
              compact
              style={{ width: '330px', paddingTop: props.extraInput ?4:0 }}
            >
              <Input
                style={{ width: '290px' }}
                defaultValue={ v }
                onBlur = { e => handleChange(e.target.value,index)}
              />
              <Icon
                type="minus-circle"
                style={{ padding: 9 }}
                onClick={ ()=>{
                handleRemove(index)
                } }
              />
            </Input.Group> )
          }
          <Icon
            type="plus-circle"
            theme="twoTone"
            onClick={handleAdd}/>
          <span style={{ paddingLeft: 6 }}>{name?`点击添加${name}`:''}</span>
        </span>
      }
    </span>
  )
})