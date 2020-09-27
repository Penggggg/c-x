import React, { useMemo, useState, useEffect, useImperativeHandle } from 'react';
import { Button, Input, Modal, Divider, Popover, Empty, Tooltip, message, notification } from 'antd';
import { http } from '@cvte/ai-web-util/util';

import { TableManage } from '../../../components/TableManage';
import { TableColumns } from '../../../components/TableColumns';
import { transferTime2CN } from '../../../util/time';
import { AutoSimilar } from './autoSimilar';
import useThrottleFn from '../util';
import '../index.less';
import moment from 'moment';

interface PropType {
  dataSource: any,
  slots: any,
  onEdit?: (record) => void,
  onDelete?: (any) => void
}

export const DialogTable = React.forwardRef(({dataSource, slots}: PropType, ref) => {
  const [dialogList, setDialogList] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>('');
  const [similarList, setSimilarList] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<any>();
  const [currentEdit, setCurrentEdit] = useState<any>();
  const [currentWord, setCurrentWord] = useState<any>();
  const [cWordIndex, setCWordIndex] = useState<any>(-1);
  const [tempLabel, setTempLabel] = useState<any>();
  const [hoveredRow, setHoveredRow] = useState<any>();
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [oldSlots, setOldSlots] = useState<any>();

  useImperativeHandle(ref, () => ({
    getData: () => dialogList
  }))

  useEffect(() => {
    if (!dataSource || !dataSource.similar_query) return;
    const { similar_query } = dataSource;
    const arr = similar_query && similar_query.map((s, i) => {
      let text = '';
      let dialog: any = [];
      if (s.indexOf('${') !== -1) {
        let splitArr = s.replace(/\${/g, ' ').replace(/}/g, ' ').split(' ');
        const label = splitArr && splitArr.map((item, index) => {
          if (item.indexOf('=') !== -1) {
            const temp = item.split('=');
            text = `${text}${temp[1]}`;
            return {
              word: temp[1],
              type: 'slot',
              attribute: temp[0],
            }
          } else {
            text = `${text}${item}`;
            return {
              word: item
            }
          }
        })
        dialog = { text, label: label.filter(l => l) }
      } else {
        dialog = { text: s, label: [] };
      }
      const tempLabel = dialog.label.map(t => {
        const wordIndex = dialog.text.indexOf(t.word);
        return ({
          ...t,
          position: wordIndex+1
        })
      })

      return {
        uid: Math.random(),
        dialog: { text: dialog.text, label: tempLabel},
        created_at: dataSource.create_at?dataSource.create_at[i] : new Date(),
        updated_at: dataSource.update_at?dataSource.update_at[i] : new Date(),
      }
    })
    setDialogList(arr)
  }, [dataSource])

  useEffect(() => {
    let oldSlot = '';
    let newSlot = '';
    let tempDialog = JSON.parse(JSON.stringify(dialogList)) || [];

    if (oldSlots && oldSlots.length === slots.length) {
      oldSlots.forEach((old, index) => {
        if (old !== slots[index]) {
          oldSlot = old;
          newSlot = slots[index];
        }
      })
      tempDialog = tempDialog.map(dialog => {
        let label = dialog.dialog.label || [];
        if (label.length >0) {
          label = label.map(l => {
            if (l.type === 'slot' && l.attribute === oldSlot) {
              return {
                ...l,
                attribute: newSlot
              }
            } else {
              return l
            }
          })
        }
        return {
          ...dialog,
          dialog: {
            ...dialog.dialog,
            label
          }
        }
      })
    }
    if (oldSlots && oldSlots.length > slots.length) {
      const index = oldSlots && oldSlots.filter(os => slots.findIndex(s => s === os) === -1);
      oldSlot = index[0];

      tempDialog = tempDialog.map(dialog => {
        let label = dialog.dialog.label || [];
        if (label.length >0) {
          label = label.map(l => {
            if (l.type === 'slot' && l.attribute === oldSlot) {
              return {
                word: l.word
              }
            } else {
              return l
            }
          })
        }
        return {
          ...dialog,
          dialog: {
            ...dialog.dialog,
            label
          }
        }
      })
    }
    setDialogList(tempDialog.slice(0));
    setOldSlots(slots);
  }, [slots])

  // 槽位弹出框
  const popContent = useMemo(() => (data?, textArr?, index?, id?) => {
    let currentSlot = '';
    return <>
      {slots && slots.length>0 ? slots.map((s, indexSlot) => {
        data.attribute === s && (currentSlot = s);
        return (
          <div
            key={indexSlot}
            className={data && data.attribute === s?"slot-item slot-item-active":"slot-item"}
            onClick={() => {
              setCurrentWord(undefined);
              setCWordIndex(-1);
              let tempArr = JSON.parse(JSON.stringify(textArr));
              let offset = 0;
              tempArr && tempArr.forEach((temp, tindex) => {
                if (tindex<index) { offset = offset+temp.word.length }
              })
              tempArr[index] = { ...data, attribute: s, type: 'slot', position: offset+1 };
              updateDialogList(id, tempArr);
            }}
          >{s}</div>
        )
      }): <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="槽位信息为空" />}
      <Divider style={{ margin: '4px 0' }} />
      <div style={{ textAlign: 'right', margin: '8px 0 6px' }}>
        <Button type="primary" size="small" style={{ marginRight: 12 }} disabled={!currentWord || currentWord.length <= 1} onClick={() => {
          let newWordArr = currentWord.split('').map(c => { return { word: c } });
          newWordArr.unshift(index, 0);
          let tempArr = JSON.parse(JSON.stringify(textArr));
          // 删除当前已合并的词语
          tempArr.splice(index, 1);
          // 加入拆分后的字
          Array.prototype.splice.apply(tempArr, newWordArr);
          updateDialogList(id, tempArr);

          setCWordIndex(-1);
          setCurrentWord('');
        }}>切词</Button>
        <Button type="primary" size="small" disabled={!currentSlot} onClick={() => {
          let tempArr = JSON.parse(JSON.stringify(textArr));
          tempArr[index] = { word: data.word };
          updateDialogList(id, tempArr);
        }}>移除</Button>
      </div>
    </>
  },[slots, currentWord, dialogList])

  // 更新列表数据
  const updateDialogList = (id, tempArr) => {
    const dialogIndex = dialogList.findIndex(d => d.uid === id);
    if (dialogIndex !== -1) {
      let tempDialog = JSON.parse(JSON.stringify(dialogList));
      tempDialog[dialogIndex].dialog.label = tempArr;
      tempDialog[dialogIndex].updated_at = new Date();
      setDialogList(tempDialog);
    }
  }

  // 对话范例 table
  const dialogColumn = useMemo(() => {
    return TableColumns({
      dialog: {
        title: '文本',
        render: (textObj, record) => {
          // 不包含槽位
          if ((!currentEdit || (currentEdit && (currentEdit.uid !== record.uid))) && (!textObj.label || textObj.label.length === 0)) {
            return <span>{textObj.text}</span>
          }
          const textArr = JSON.parse(JSON.stringify(textObj.label));
          let tempArr = JSON.parse(JSON.stringify(textObj.label));

          // 记录槽位奇偶数，设置提示框位置
          let count = 0;
          if (currentEdit && (currentEdit.uid === record.uid)) {
            return <Input
              autoFocus
              defaultValue={textObj.text}
              onBlur={(e) => {
                let result: any = {};
                // 编辑时数据格式确定
                const value = e.target.value || '';
                if (!value) return;

                if (!record.dialog.label || record.dialog.label.length === 0) {
                  // 无槽位信息
                  result = { text: value, label: [] }
                } else if (record.dialog.text === value) {
                  // 没有改变
                  result = record.dialog;
                } else {
                  // 有槽位信息
                  let label: any = [];
                  let tempIndex = 0;
                  let labelIndexArr:any = [];
                  record.dialog.label && record.dialog.label.forEach((d, index) => {
                    if (d.attribute) labelIndexArr.push({ index, offset: d.position });
                  })
                  const labelT = record.dialog.label;

                  const isLabelIndex = labelIndexArr.findIndex(lab => value.indexOf(labelT[lab.index].word) !== -1);
                  if (isLabelIndex === -1) {
                    result = { text: value, label: [] }
                  } else {
                    labelIndexArr.forEach((l, i) => {
                      const valueIndex = value.indexOf(labelT[l.index].word);
                      if (valueIndex !== -1) {
                        label = [
                          ...label,
                          { word: value.substring(tempIndex, valueIndex) },
                          { word: labelT[l.index].word, attribute: labelT[l.index].attribute, type: labelT[l.index].type, position: valueIndex+1 },
                        ]
                        const length = valueIndex + labelT[l.index].word.length;
                        tempIndex = length;
                        if (i === labelIndexArr.length-1 && value.length > length) {
                          label = [
                            ...label,
                            { word: value.substring(length, value.length) }
                          ]
                          tempIndex = tempIndex+(value.length-length);
                        }
                      } else {
                        if (i === labelIndexArr.length-1 && value.length > tempIndex) {
                          label = [
                            ...label,
                            { word: value.substring(tempIndex+labelT[l.index].word.length, value.length) }
                          ]
                          tempIndex = tempIndex +value.length-(tempIndex+labelT[l.index].word.length);
                        }
                      }
                    })
                    result = { text: value, label: Array.from(new Set(label)) }
                  }
                }
                const dialogIndex = dialogList.findIndex(d => d.uid === record.uid);
                if (dialogIndex !== -1) {
                  let tempDialog = JSON.parse(JSON.stringify(dialogList));
                  tempDialog[dialogIndex].dialog = result;
                  tempDialog[dialogIndex].updated_at = new Date();
                  setDialogList(tempDialog);
                  setCurrentEdit(undefined);
                }
              }}
            />
          }

          const eleNode = <span>
          {
            textArr && textArr.map((wordArr, wordIndex) => {
              // 正常状态
              if ((!currentEdit || (currentEdit.uid !== record.uid))  && (!currentLabel || (currentLabel.uid !== record.uid))) {
                // 有槽位列表
                if (wordArr.attribute) {
                  ++count;
                  return <Tooltip title={wordArr.attribute} placement={count%2===0?"bottom":"top"} visible={hoveredRow && hoveredRow.uid === record.uid} key={wordIndex}>
                      <span className="has-slot">{wordArr.word}</span>
                    </Tooltip>
                }
                // 无槽位
                return <span key={wordIndex}>
                  {wordArr.word}
                </span>
              }
              // 标注状态
              if (currentLabel && currentLabel.uid === record.uid) {
                if (!wordArr.attribute) {
                  // 点击空白区域取消弹出
                  document.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentWord && setCurrentWord(undefined);
                  })
                  // 无槽位
                  return <Popover content={popContent(wordArr, textArr, wordIndex, record.uid)} title="选择槽位" visible={cWordIndex===wordIndex} placement="top" key={wordIndex}>
                    <span
                      className={currentWord===wordArr.word && cWordIndex===wordIndex?"segment-word segment-word-active":
                          (!currentWord || (cWordIndex === -1 || wordIndex === cWordIndex + 1 || wordIndex === cWordIndex -1)?"segment-word":"segment-word is-disabled")}
                      onClick={(e) => {
                        // e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        // 如果当前没有选中词，则将当前点击的词设为当前选中，并返回
                        if (!currentWord) {
                          setCurrentWord(wordArr.word);
                          setCWordIndex(wordIndex);
                          return;
                        }
                        if (currentWord && cWordIndex===wordIndex) {
                          setCurrentWord(undefined);
                          setCWordIndex(-1);
                          return;
                        }
                        if (!(cWordIndex === -1 || wordIndex === cWordIndex + 1 || wordIndex === cWordIndex -1)) return;
                        // 合并当前选中词前或者后面的字词
                        if (cWordIndex !== -1 ) {
                          (wordIndex === cWordIndex + 1) && (tempArr = combineWord(cWordIndex, tempArr));
                          (wordIndex === cWordIndex - 1) && (tempArr = combineWord(cWordIndex-1, tempArr));
                        }

                        // 修改列表
                        updateDialogList(record.uid, tempArr);
                      }}
                    >
                      {wordArr.word}
                    </span>
                  </Popover>
                }
                // 有槽位
                return <Popover content={popContent(wordArr, textArr, wordIndex, record.uid)} title="选择槽位" trigger="click" placement="topLeft" key={wordIndex} onVisibleChange={show => {
                  if (!show) return;
                  setCurrentWord(undefined);
                  setCWordIndex(-1);
                }}>
                    <span className="dialog-item has-slot">{wordArr.word}</span>
                  </Popover>
              }
            })
          }
          </span>
          return eleNode;
        }
      },
      created_at: {
        title: '创建时间',
        defaultSortOrder: 'descend',
        sorter: (a, b) => moment(a.created_at).valueOf()  - moment(b.created_at).valueOf(),
        render: text => transferTime2CN(text)
      },
      updated_at: {
        title: '更新时间',
        render: text => transferTime2CN(text)
      },
    }, {
      customs: [{
        render: (record) => {
          if (currentLabel && currentLabel.uid === record.uid) {
            return (
              <>
                <a onClick={ () => {
                  tempLabel && setDialogList(tempLabel);
                  setCurrentLabel(undefined);
                  setTempLabel(undefined);
                  setCurrentWord('');
                  setCWordIndex(-1);
                } }>取消标注</a>
                <Divider type="vertical" />
                <a onClick={ () => {
                  setCurrentLabel(undefined);
                  setCurrentWord('');
                  setCWordIndex(-1);
                 } }>保存</a>
              </>
            )
          }
          return (
            <>
              <a onClick={() => onLabelDialog(record)}>标注</a>
              <Divider type="vertical" />
              <a onClick={() => {
                setCurrentEdit(record);
              }}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => onDeleteDialog(record)} style={{ color: 'red' }}>删除</a>
            </>
          )
        }
      }],
    })
  }, [dialogList, currentLabel, currentEdit, slots, currentWord, tempLabel, hoveredRow])

  // 合并前后字词
  const combineWord = (index, list) => {
    let tempArr = JSON.parse(JSON.stringify(list));
    let newword = '';
    newword = `${list[index].word}${list[index+1].word}`;
    tempArr[index].word = newword;
    tempArr.splice(index+1,1);
    // 修改当前选中词为最新
    setCurrentWord(newword);
    setCWordIndex(index);
    return tempArr;
  }

  // 添加范例
  const onAddDialog = () => {
    if (!inputValue) {
      message.warning('请先输入要添加的数据');
      return;
    }
    let arr = dialogList;
    arr.push({
      uid: Math.random(),
      dialog: {text: inputValue, label: [{ word: inputValue }]},
      created_at: new Date(),
      updated_at: new Date(),
    })
    setDialogList(arr.slice(0));
    setInputValue('');
  }

  // 删除范例
  const onDeleteDialog = record => {
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const index = dialogList.findIndex(d => d.uid === record.uid)
        dialogList.splice(index, 1);
        setDialogList(dialogList.slice(0));
      }
    });
  }

  // 标注范例
  const onLabelDialog = record => {
    if (isSplitting) {
      message.warning('正在请求分词接口');
      return;
    }
    if (currentLabel) setCurrentLabel(undefined);
    let temp = JSON.parse(JSON.stringify(dialogList));
    setTempLabel(dialogList);
    const filterLabel = (record.dialog.label || []).filter(l => l.attribute);
    setIsSplitting(true);
    // 请求分词接口
    http.post({
      url: `/t-apis/v1/data_record/word_segm`,
      data: {
        text: record.dialog.text,
        label: filterLabel || []
      }
    }).then(res => {
      setIsSplitting(false);

      const data = res.data;
      const index = dialogList.findIndex(d => d.uid === record.uid);
      temp[index].dialog = { text: record.dialog.text, label: data }
      setDialogList(temp.slice(0));

      setCurrentLabel(record);
    }).catch(error => {
      setIsSplitting(false);

      notification.error({
        message: '提示',
        description: '请求分词接口出错'
      })
    })
  }

  // 关闭生成范例弹框
  const onClose = () => {
    setVisible(false);
    setSimilarList([]);
    setInputValue('');
  }

  return (
    <div className="dialog-table">
      <Input
        allowClear
        style={{ width: 450 }}
        placeholder="请输入用户可能触发该意图的话，按 Enter 或点击添加范例保存"
        value={inputValue}
        onPressEnter={onAddDialog}
        onChange={e => setInputValue(e.target.value)}
      />
      <Button
        ghost
        type="primary"
        icon="plus-circle"
        style={{ margin: '0 10px 0 20px' }}
        disabled={!inputValue}
        onClick={onAddDialog}
      >添加范例</Button>
      <Button
        type="primary"
        ghost
        icon="file-sync"
        disabled={!inputValue}
        onClick={() => {
          http.post({
            url: `/t-nlp/encode`,
            data: { id: 1, texts: [inputValue] }
          }).then((res: any) => {
            if (res.status === 200) {
              const {result} = res.data;
              const content = result.res[0];
              setSimilarList(Array.from(new Set(content)));
              setVisible(true);
            }
          })
        }}
      >生成范例</Button>
      <TableManage
        columns={dialogColumn}
        dataSource={dialogList}
        baseprops={{
          size: 'small',
          style: { margin: '20px 0 20px 0px' },
          rowKey: () => Math.random(),
          onRow: record => {
            return {
              onMouseEnter: e => {
                e.stopPropagation();
                if (!currentLabel && !currentEdit) setHoveredRow(record);
              },
              onMouseLeave: e => {
                e.stopPropagation();
                hoveredRow && setHoveredRow(undefined)
              }
            }
          }
        }}
      />
      {
        visible &&
        <AutoSimilar
          visible={visible}
          similarList={similarList}
          onClose={onClose}
          onOk={(checkedList) => {
            const arr = Array.from(new Set(checkedList)).map(c => ({
              uid: Math.random(),
              dialog: { text: c, label: [{ word: c }] },
              created_at: new Date(),
              updated_at: new Date(),
            }));
            const newArr = Array.from(new Set([...dialogList, ...arr]));
            setDialogList(newArr);
            onClose();
          }}
        />
      }
    </div>
  )
})