import React, { useState } from 'react';
import { Upload, Button, Tooltip, notification, Modal, message, Alert } from 'antd';
import JSZip from 'jszip';
import filesaver from 'file-saver';

interface PropsType {
  // header 列表对应字段，例：['skill_name', 'intention_name', 'slot_list'];
  type: Array<string>,
  // 分隔符
  separator?: any,
  // 模板内容
  demoContent?: any,
  // 导入说明文字
  illustration?: any,
  // 导入调用方法
  onImport?: (any) => any,
  // 导出调用方法
  onExport?: () => any,
}

const ImportManage = ({ type, separator = ',', illustration, demoContent, onImport, onExport }: PropsType) => {
  const [visible, setVisible] = useState(false);
  const [uploadFile, setUploadFile] = useState<any>();
  const [fileList, setFileList] = useState<any>([]);

  // 文件上传
  const props = {
    onRemove: file => {
      setFileList([]);
      setUploadFile(undefined);
    },
    // 数据导入
    beforeUpload: file => {
      if (!file || !file.name) return false;
      const surfix = file.name.split('.').pop();
      if (separator === ',' && surfix !== 'txt' && surfix !== 'csv') {
        message.error('仅支持 txt 和 csv 两种格式类型文件，请重新上传');
        return false;
      }
      if (separator !== ',' && surfix !== 'txt') {
        message.error('仅支持 txt 格式文件，请重新上传');
        return false;
      }
      setFileList([]);
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = () => {
        parseCsvToData(reader.result);
        message.warning('文件上传成功，点击确定保存数据');
        setFileList([file]);
      }
      return false;
    },
    fileList,
  };

  // 数据导出
  const handleExport = () => {
    Modal.confirm({
      title: '确认导出所有数据？',
      okText: '确认',
      cancelText: '取消',
      onOk: async() => {
        if (!onExport) return;
        const result: any = await onExport();
        const { header, content } = result;

        const csv = parseDataToCsv(header, content);
        if (separator !== ',') {
          tempDownload(csv, result.name || null, 'txt');
        } else {
          tempDownload(csv, result.name || null);
          tempDownload(csv, result.name || null, 'txt');
        }
      }
    });
  }

  // 解析 CSV 格式数据
  const parseCsvToData = (data) => {
    // 获取所有行数据
    let rows = data.split(/\n/);
    // 过滤空值
    rows = rows.filter(row => row);
    let rowsDetail: any = [];
    let finalData: any = []
    // 根据分隔符拆分每行数据，例："水果, entry" ==> ["水果", "entry"]
    rows.forEach((row, index) => {
      // 第一行默认为 title，不作为数据内容返回
      if(index === 0) return;
      const rowList = row.split(separator);
      rowsDetail.push(rowList)
    })
    // 根据对应类型名称解析为相应数据格式，例：["水果", "entry"] ==> [{ "name": "水果", "type": "entry" }]
    rowsDetail.forEach(arr => {
      if (!arr) return;
      let obj: any = {};
      arr.forEach((r, index) => obj[type[index]] = r);
      finalData.push(obj);
    })
    setUploadFile(finalData)
  }

  // 将数据列表转为 CSV 格式
  const parseDataToCsv = (head, content) => {
    const header = [head];
    if (!header || !content) {
      notification.warning({
        message: '提示',
        description: '导出失败，数据格式错误'
      })
      return;
    }
    // 将数据push到大数组中
    for (var i = 0; i < content.length; i++) {
      let arr: any = [];
      type.forEach(t => arr.push(content[i][t]));
      header.push(arr);
    }
    // 按照csv文件内容格式，把每个数组用 , 连接，形成一行，并存入新数组
    var csvRows:any = [];
    for (var j = 0; j < header.length; j++) {
      csvRows.push(header[j].join(separator));
    }
    // 新数组用 \n 回车连接
    var csvString = csvRows.join('\n');
    return csvString
  }

  // 模板下载
  const onDownloadDemo = () => {
    let zip = new JSZip();
    const demo =
`实体名${separator}词条名${separator}词条类型${separator}词条列表
食物${separator}米饭${separator}同义词${separator}大米|小米
食物${separator}豆类${separator}同义词${separator}黄豆|绿豆|眉豆
城市${separator}北京${separator}同义词${separator}首都`
    const text =
`1、行与行之间数据分隔符为“\n”(即换行)，字段间分隔符为","(英文状态下逗号)，请勿更改

2、如果数据列表中包含数组类型的长数据列表，需拆分为多条数据行；
如果数据列表中包含数组类型的简短词语，直接使用” | “ 符号分隔开。
示例：
原数据：
[{
  entity_name: '食物',
  dictionary_list: [{
    value: '米饭',
    data_type: '同义词',
    synonyms: ["大米","小米"]
  }, {
    value: '豆子',
    data_type: '同义词',
    synonyms: ["黄豆","绿豆","眉豆"]
  }]
}, {
  entity_name: '城市',
  dictionary_list: [{
    value: '北京',
    data_type: '同义词',
    synonyms: ["首都"]
  },
}]
数据中“米饭”和“豆子”类别都归属于”食物“，需拆分为两条数据行；
"黄豆"、"绿豆"和"眉豆"同属于”豆类“，使用” | “分开

综上，导入时数据格式为：
实体名${separator}词条名${separator}词条类型${separator}词条列表
食物${separator}米饭${separator}同义词${separator}大米|小米
食物${separator}豆类${separator}同义词${separator}黄豆|绿豆|眉豆
城市${separator}北京${separator}同义词${separator}首都`;

    zip.file('模板样例.txt', demoContent || demo);
    if (separator === ',') {
      zip.file('模板样例.csv', demoContent || demo);
    }
    zip.file('数据导入说明(必读).txt', illustration || text);
    zip.generateAsync({type:"blob"}).then(content => {
      const filename = '模板.zip';
      filesaver.saveAs(content, filename);
    })
  }

  const onClose = () => {
    setUploadFile(undefined);
    setVisible(false);
    setFileList([]);
  }

  // 下载功能实现
  const tempDownload = (content, name?, type?) => {
    var tmpa = document.createElement("a");
    if (type) {
      tmpa.download = `${name}.txt` || "download.txt";
      tmpa.href ='data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    } else {
      tmpa.download = `${name}.csv` || "download.csv";
      tmpa.href ='data:attachment/csv,' + encodeURIComponent(content);
    }
    tmpa.click();
    setTimeout(function () {
      URL.revokeObjectURL(content);
    }, 100);
  }

  return (
    <div style={{ display: 'flex' }}>
      <Tooltip title="导入">
        <Button icon="download" onClick={()=>setVisible(true)} />
      </Tooltip>
      <Tooltip title="导出">
        <Button icon="upload" style={{ margin: '0 10px' }} onClick={handleExport} />
      </Tooltip>
      {
        visible &&
        <Modal
          title="导入"
          okText="确定"
          cancelText="取消"
          visible={visible}
          onCancel={onClose}
          onOk={()=> {
            if (!uploadFile || fileList.length === 0) {
              message.warning('请先上传文件');
              return;
            }
            !!onImport && onImport(uploadFile);
            setTimeout(() => {
              onClose();
            }, 1000)
          }}
        >
          <Upload {...props} accept={separator === ','? ".csv, .txt":'.txt' } showUploadList={true}>
            <Tooltip title="请确认已仔细阅读下方注意事项，并严格按照模板格式填写数据后上传">
              <Button type="primary" ghost size="small">点击上传文件</Button>
            </Tooltip>
          </Upload>
          <div style={{ marginTop: 20, padding: '10px 20px', fontSize: 13, lineHeight: '22px', backgroundColor: 'rgba(128, 128, 128, 0.07)'}}>
            <b>注意事项：</b><br />
            1、文件仅支持{ separator === ','? ' .csv 和 .txt 两种类型':' .txt 类型' } <br />
            2、每次只能导入一个文件，大小不超过 2M，编码类型 UTF-8<br />
            3、内容需严格参照模板
              <a onClick={onDownloadDemo}>(点击下载模板)</a>
            格式填写，以避免由数据格式引起的错误<br />
          </div>
        </Modal>
      }
    </div>
  );
};

export default ImportManage;