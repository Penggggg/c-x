import { http } from '@cvte/ai-web-util/util';
import React, { useState, useEffect } from 'react';
import { Upload, Button, Icon, Steps, Tabs, Alert, List, notification, Input, Modal, Tag, Tooltip, Divider } from 'antd';
import { YuyinPY } from '../../../../../containers/yuyin-py';
import { YuyinWeight } from '../../../../../containers/yuyin-weight';
import { YuyinFrequency } from '../../../../../containers/yuyin-frequency';
import './index.less';

const { Step } = Steps;
const { TabPane } = Tabs;

export const Train2 = ({ bucket, defaultStep }: Train1 ) => {

    /** 分类弹框 */
    const [ showClassify, showClassify$ ] = useState( false );

    /** 分类名称 */
    const [ classifyName, classifyName$ ] = useState( '' );

    /** 分类列表 */
    const [ classify, classify$ ] = useState<{ name: string, pys: Py[ ], isBefore?: boolean }[ ]>([ ]);

    /** 自动生成训练文本的配置列表 */
    const [ trainTxt, trainTxt$ ] = useState< string[ ]>([ ]);

    /** 当前步骤 */
    const [ step, step$ ] = useState( 0 );

    /** 最大步骤，之前的步骤都能被切换 */
    const [ maxStep, maxStep$ ] = useState( 0 );

    /** 正在生成训练文本 */
    const [ generatingTrain, generatingTrain$ ] = useState( false );

    const err = description => {
        notification.error({
            description,
            message: '提示'
        });
        return false;
    }

    /** 获取已有分类 */
    const fetchClassify = ( ) => {
        if ( !bucket ) return;
        http.get< any >({
            params: {
                bucket_name: bucket
            },
            url: `/t-apis/voice/labelCategory`
        }).then(({ status, data }) => {
            if ( status !== 200 ) return;
            classify$( data.map( x => ({
                name: x,
                pys: [ ],
                isBefore: true
            })));
            trainTxt$( data.map( x => `@${x}`))
        })
    }

    /** 词典上传 */
    const onDicUpload = ( e, name ) => {
        const { status, response } = e.file;
        
        if ( status !== 'done' ) return;
        if ( response.status !== 200 ) return;

        const temp = [ ...classify ];
        const Index = temp.findIndex( x => x.name === name );

        temp.splice( Index, 1, {
            name,
            isBefore: true,
            pys: response.data.filter( x => !!x.cn )
        });
        classify$( temp );
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

    /** 创建分类 */
    const createClassify = ( ) => {
        classifyName$( classify.length === 0 ? 'default' : '');
        showClassify$( true );
    }
    
    /** 确认创建分类 */
    const onSureClassify = ( ) => {

        const temp = [ ...classify ];

        // 校验
        if ( !classifyName.trim( )) {
            return err('不能为空')
        }

        if ( !!temp.find( x => x.name === classifyName )) {
            return err('名称重复')
        }
        
        classify$([
            ...temp,
            {
                pys: [ ],
                name: classifyName,
            }
        ]);
        classifyName$('');
        showClassify$( false );
    }

    /** 跳到音标调整、提示 */
    const pyClassifyJudst = ( ) => {

        // 校验
        const isEmpty = classify
            .filter( x => !x.isBefore )
            .some( x => x.pys.length === 0 );
        if ( isEmpty ) {
            return notification.info({
                message: '提示',
                description: '每个分类都要上传词典'
            })
        }

        jumpTo('next');
    }

    /** 增加一个生成训练文本配置 */
    const appendTrainTxt = ( classifyName: string ) => {
        const temp = [ ...trainTxt ];
        trainTxt$([
            ...temp,
            classifyName
        ])
    }

    /** 更改配置 */
    const changeTrainTxt = ( txt: string, Index: number ) => {
        const temp = [ ...trainTxt ];
        temp.splice( Index, 1, txt );
        trainTxt$( temp );
    }

    /** 生成训练文本 */
    const onSureTrain = ( ) => {

        if ( trainTxt.some( x => !x.trim( ))) {
            return err('不能为空')
        }

        if ( trainTxt.some( x => !x.includes('@'))) {
            return err(`格式错误`)
        }

        generatingTrain$( true );

        http.post< any >({
            data: {
                sentence: trainTxt,
                bucket_name: bucket
            },
            url: `/t-apis/voice/generateTrain`
        }).then( res => {
            const { status } = res;
            if ( status !== 200 ) return;

            jumpTo('next');
            generatingTrain$( false )
        })
    }

    /** 删除训练配置 */
    const onDelTrain = ( Index: number ) => {
        const temp = [ ...trainTxt ];
        temp.splice( Index, 1 );
        trainTxt$( temp );
    }

    useEffect(( ) => {
        if ( defaultStep === undefined ) return;
        step$( defaultStep );
        maxStep$( defaultStep );
    }, [ defaultStep ])

    useEffect( fetchClassify, [ ])

    return (
        <div className="p-user-model-yuyin-train-1 animated fadeIn">

            {/* 步骤提示 */}
            <Steps 
                current={ step }
                onChange={ onPage }
            >
                <Step title="上传词典" />
                <Step title="音标调整" />
                <Step title="生成训练文本" />
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
                        
                        <div 
                            style={{ width: 400 }}
                        >
                            <List>
                                {
                                    classify.map(( c, k ) => (
                                        <List.Item
                                            key={ k }
                                            style={{ padding: '30px 0' }}
                                        >
                                            <List.Item.Meta
                                                title={(
                                                    <div
                                                        style={{ fontSize: 15 }}
                                                    >
                                                        {
                                                            c.isBefore && (
                                                                <Tooltip
                                                                    title='已上传'
                                                                >
                                                                    <Icon 
                                                                        theme='filled'
                                                                        type="check-circle" 
                                                                        style={{ marginRight: 6, color: '#52c41a' }}
                                                                    />
                                                                </Tooltip>
                                                            )
                                                        }
                                                        分类：{c.name}
                                                    </div>
                                                )}
                                                description={
                                                    <div>
                                                        <Upload
                                                            name='file'
                                                            action={`/t-apis/voice/translate`}
                                                            onChange={ e => onDicUpload( e, c.name )}
                                                        >
                                                            <Button>
                                                                <Icon type="upload" /> 上传词典
                                                            </Button>
                                                        </Upload>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    ))
                                }
                            </List>
                            <div
                                style={{ marginTop: classify.length > 0 ? 50 : 0 }}
                            >
                                <Button 
                                    type='primary'
                                    onClick={ createClassify }
                                    style={{ marginRight: 25 }}
                                >   
                                    { classify.length === 0 ? '创建分类' : '继续添加' }
                                </Button>
                                {
                                    classify.length > 0 && (
                                        <Button 
                                            ghost
                                            type='primary'
                                            onClick={ pyClassifyJudst }
                                        >   
                                            下一步
                                        </Button>
                                    )
                                }
                            </div>
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
                                        title='分类'
                                        description={
                                            <div>
                                                <p>您可以给词典添加分类， 方便您再后面的步骤里面生成训练文本。</p>
                                                <p>如创建一个“姓名”分类，那此分类下的词典内容就是「姓名」列表。</p>
                                            </div>
                                        }
                                    />
                                </List.Item>
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

                {/* 音标 */}
                <TabPane
                    tab=''
                    key='1'
                >
                    <div className="tab-panel">

                        <YuyinPY 
                            bucket={ bucket }
                            data={ classify }
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
                        
                        <div>

                            <Tooltip
                                title='点击创建输入框'
                            >
                                <div>
                                    你已创建：
                                    {
                                        classify
                                            .filter( c => c.isBefore )
                                            .map(( c, k ) => (
                                                <Tag 
                                                    key={ k }
                                                    color='cyan'
                                                    onClick={ e => appendTrainTxt(`@${c.name}`)}
                                                >
                                                    @{ c.name }
                                                </Tag>
                                            ))
                                    }
                                </div>
                            </Tooltip>

                            {
                                <div 
                                    style={{ marginTop: 25, width: 300 }}
                                >
                                {
                                    trainTxt.map(( t, k ) => (
                                        <div
                                            key={ k }
                                            style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}
                                        >
                                            <Input 
                                                key={ k }
                                                value={ t }
                                                onChange={ e => changeTrainTxt( e.target.value, k )}
                                            />
                                            <Tooltip
                                                title='删除此行配置'
                                            >
                                                <Button 
                                                    size='small'
                                                    icon='minus'
                                                    type='dashed'
                                                    shape='circle' 
                                                    style={{ marginLeft: 15 }}
                                                    onClick={( ) => onDelTrain( k )}
                                                />
                                            </Tooltip>
                                        </div>
                                    ))
                                }
                                </div>
                            }
                            {/* sdankj */}
                            {
                                trainTxt.length > 0 && (
                                    <Button
                                        type='primary'
                                        onClick={ onSureTrain }
                                        style={{ marginTop: 30 }}
                                        loading={ generatingTrain }
                                    >
                                        确定
                                    </Button>
                                )
                            }

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
                                        title='配置/生成训练文本'
                                        description={
                                            <div>
                                                输入：自定义语句 + '@你设置的分类'
                                                <p>可自动生成训练文本，如：</p>
                                                <pre>
                                                    {`
    我想吃@dish
    打开@device
                                                    `} 
                                                </pre>
                                            </div>
                                        }
                                    />
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta
                                        title='Tips'
                                        description={
                                            <div>
                                                点击右侧标签，增加输入框
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

            <Modal
                title='新建分类'
                visible={ showClassify }
                onOk={ onSureClassify }
                onCancel={( ) => showClassify$( false )}
            >
                <Input 
                    placeholder='分类名称'
                    value={ classifyName }
                    onChange={ e => classifyName$( e.target.value )}
                />
            </Modal>

        </div>
    )
}

type Train1 = {
    bucket: string,
    defaultStep?: number
}

type Py = { 
    cn: string, 
    py: string[ ][ ]
}