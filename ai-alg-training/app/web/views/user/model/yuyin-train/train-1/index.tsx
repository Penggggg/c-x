import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Icon, Steps, Tabs, Alert, List, notification, Tooltip } from 'antd';
import { YuyinPY } from '../../../../../containers/yuyin-py';
import { YuyinWeight } from '../../../../../containers/yuyin-weight';
import { YuyinFrequency } from '../../../../../containers/yuyin-frequency';

import './index.less';

const { Step } = Steps;
const { TabPane } = Tabs;

export const Train1 = ({ bucket, defaultStep }: Train1 ) => {

    /** 拼音表单 */
    const pyFormRef = useRef< any >( null );

    /** 当前步骤 */
    const [ step, step$ ] = useState( 0 );

    /** 最大步骤，之前的步骤都能被切换 */
    const [ maxStep, maxStep$ ] = useState( 0 );

    /** 拼音数据 */
    const [ pys, pys$ ] = useState< { name: string, pys: Py[ ]}[ ]>([ ]);

    /** 上传训练文本的文件名 */
    const [ trainName, trainName$ ] = useState('');

    /** 词典上传 */
    const onDicUpload = e => {
        const { status, response } = e.file;
        
        if ( status !== 'done' ) return;
        if ( response.status !== 200 ) return;

        jumpTo('next');
        pys$([
            {
                name: 'default',
                pys: response.data.filter( x => !!x.cn )
            }
        ]);
    }

    /** 训练文本上传 */
    const onTrainUpload = e => {
        const { status, response } = e.file;
        
        if ( status !== 'done' ) return;
        if ( response.status !== 200 ) return;

        // 展示句频调整
        notification.success({
            message: '提示',
            description: '上传成功'
        });

        jumpTo('next');
        trainName$(`train_${e.file.name}`)
    }

    /** 跳步骤 */
    const jumpTo = ( page: number | 'next' | 'pre' ) => {
        if ( typeof page === 'number' ) {
            return step$( page );
        }
        step$( page === 'next' ? step + 1 : step - 1 );
        if ( maxStep === step && page === 'next' ) {
            maxStep$( maxStep + 1 );
        }
    }

    /** 跳页面 */
    const onPage = ( step: number ) => {
        if ( step > maxStep ) return;
        step$( step );
    }

    useEffect(( ) => {
        if ( defaultStep === undefined ) return;
        step$( defaultStep );
        maxStep$( defaultStep );
    }, [ defaultStep ])

    return (
        <div className="p-user-model-yuyin-train-1 animated fadeIn">

            {/* 步骤提示 */}
            <Steps 
                current={ step }
                onChange={ onPage }
            >
                <Step title="上传词典" />
                <Step title="音标调整" />
                <Step title="上传训练文本" />
                <Step title="调整句频" />
                <Step title="调整权重" />
            </Steps>

            <Tabs
                activeKey={`${step}`}
                tabBarStyle={{ display: 'none' }}
            >

                {/* 上传词典 */}
                <TabPane
                    tab=''
                    key='0'
                >
                    <div className="tab-panel">
                        
                        <div>
                            {
                                maxStep > 0 && (
                                    <div
                                        style={{ fontSize: 15 }}
                                    >
                                        <Tooltip
                                            title='已上传'
                                        >
                                            <Icon 
                                                theme='filled'
                                                type="check-circle" 
                                                style={{ marginRight: 6, color: '#52c41a' }}
                                            />
                                        </Tooltip>
                                        已上传
                                    </div>
                                )
                            }
                            <Upload
                                name='file'
                                action={`/t-apis/voice/translate`}
                                onChange={ onDicUpload }
                            >
                                <Button>
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>
                        </div>

                        {/* 提示 */}
                        <div style={{ width: 300 }}>
                            <Alert 
                                showIcon 
                                type="info" 
                                message={
                                    <div>
                                        详细说明 
                                    </div>
                                } 
                            />
                            <List
                                style={{ padding: '15px 10px 0' }}
                            >
                                <List.Item>
                                    <List.Item.Meta
                                        title='词典'
                                        description={
                                            <div>
                                                一份后缀为.txt的文件。每词之间需要换行，如：
                                                <pre>
                                                    {`
    鸡肉 
    牛肉
                                                    `} 
                                                </pre>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            </List>
                        </div>
                    </div>
                </TabPane>

                {/* 词典确认 */}
                <TabPane
                    tab=''
                    key='1'
                >
                    <div className="tab-panel">
                        
                    <YuyinPY 
                        data={ pys }
                        bucket={ bucket }
                        cb={( ) => jumpTo('next')}
                    />

                    </div>
                </TabPane>

                {/* 训练文本 */}
                <TabPane
                    tab=''
                    key='2'
                >
                    <div className="tab-panel">
                        <Upload
                            name='file'
                            data={{ bucket_name: bucket }}
                            action={`/t-apis/voice/uploadTrain`}
                            onChange={ onTrainUpload }
                        >
                            <Button>
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>

                        {/* 提示 */}
                        <div style={{ width: 300 }}>
                            <Alert 
                                showIcon 
                                type="info" 
                                message={
                                    <div>
                                        详细说明 
                                    </div>
                                } 
                            />
                            <List
                                style={{ padding: '15px 10px 0' }}
                            >
                                <List.Item>
                                    <List.Item.Meta
                                        title='训练数据集'
                                        description={
                                            <div>
                                                一份后缀为.txt的文件。每行之间需要换行，如：
                                                <pre>
                                                    {`
    8 把 左灶台 打开
    6 把 左灶台 关闭
    17 把 右灶台 打开
    15 把 右灶台 关闭
                                                    `} 
                                                </pre>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            </List>
                        </div>
                    </div>
                </TabPane>

                {/* 调整句频 */}
                <TabPane
                    tab=''
                    key='3'
                >
                    <div className="tab-panel">
                        <YuyinFrequency 
                            bucket={ bucket }
                            filename={ trainName }
                            cb={( ) => jumpTo('next')}
                        />
                    </div>
                </TabPane>

                {/* 调整权重 */}
                <TabPane
                    tab=''
                    key='4'
                >
                    <div className="tab-panel">
                        <YuyinWeight 
                            bucket={ bucket }
                        />
                    </div>
                </TabPane>

            </Tabs>

        </div>
    )
}

type Train1 = {
    bucket: string
    defaultStep?: number
}

type Frequency = {
    txt: string
    ok: boolean
}

type Py = { 
    cn: string, 
    py: string[ ][ ]
}