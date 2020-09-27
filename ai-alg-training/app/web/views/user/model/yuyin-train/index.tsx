import { http } from '@cvte/ai-web-util/util';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';
import { Button, Tooltip, Icon, PageHeader } from 'antd';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Train1 } from './train-1';
import { Train2 } from './train-2';
import './index.less';
import { Divider } from 'rc-menu';

const TrainForm1 = MyForm('yuyin-train');
const TrainForm2 = MyForm('yuyin-train');

export const YuyinTrain = ({ aIndex, aid }: YuyinTrain ) => {

    const formRef1 = useRef< any >( null );

    const formRef2 = useRef< any >( null );

    /** 当前的桶名 */
    const [ bucket, bucket$ ] = useState('');

    /** 是否在表单选择了方式1或2 */
    const [ hasSelected, hasSelected$ ] = useState( false );

    /** 新建数据集名称 */
    const [ newsetName, newsetName$ ] = useState('');

    /** 数据集列表 */
    const [ list, list$ ] = useList< any >({
        listUrl: '/t-apis/dataset/list',
    });

    /** 最大步骤 */
    const [ defaultStep, defaultStep$ ] = useState( 0 );

    /** 选择类型 */
    const [ type, type$ ] = useState< ETrain | ''>( '' );

    /** 类型选择 */
    const onSelectType = ( type: EFormType ) => {

        // 方式1
        if ( type === EFormType.select ) {
            const form = formRef1.current;
            form.validateFields(( e, r ) => {
                if ( e ) return; 
                bucket$( r.dataset );
                checkStep( r.dataset, r.type, true );
            })
        }

        // 方式2
        if ( type === EFormType.create ) {
            const form = formRef2.current;
            form.validateFields(( e, r ) => {
                if ( e ) return; 

                http.post< any >({
                    successMsg: '创建成功',
                    data: { group_name: r.newset },
                    url: `/t-apis/voice/createDataset`
                }).then(({ status, data }) => {
                    if ( status !== 200 ) return;
                    bucket$( data.bucket_name );
                    checkStep( data.bucket_name, r.type, false );
                })
            })
        }
    }

    /** 查询在第几步了 */
    const checkStep = ( bucket_name, type: ETrain | '', needCheck = true ) => {
        
        if ( needCheck ) {
            http.get< any >({
                params: {
                    bucket_name
                },
                url: `/t-apis/voice/listFile`
            }).then(({ status, data }) => {
                if ( status !== 200 ) return;
                // 0、词典，1、音标调整，2、上传训练文本，3、调整语频，4、调整权重
    
                const hasLabel = data.some( x => x.includes('label_'));
                const hasTrain = data.some( x => x.includes('train_'));
    
                if ( hasTrain ) {
                    defaultStep$( 3 )
                } else if ( hasLabel ) {
                    defaultStep$( 2 )
                }
                type$( type )
            });
        } else {
            type$( type )
        }
    }

    /** 表单变更 */
    const onForm = ( e, type: EFormType ) => {
        if ( type === EFormType.select ) {
            !!e.dataset && hasSelected$( true );
        }
        if ( type === EFormType.create ) {
            const { newset } = e;
            newsetName$( newset );
        }
    }

    /** 表单 */
    const formItems1$ = useMemo(( ) => {
        const result: any[ ] = [
            {
                key: 'dataset',
                label: '数据集',
                type: 'select',
                horizon: false,
                options: list.map( l => ({
                    value: l.bucket_name,
                    label: l.dataset_name,
                })),
                placeholder: '选择已有数据集',
                rules: [ ]
            }
        ]
        if ( !!hasSelected ) {
            result.push({
                key: 'type',
                label: '训练文本',
                type: 'radio',
                options: [{
                    label: '已有',
                    value: ETrain.hasTrain
                }, {
                    label: '尚无',
                    value: ETrain.noTrain
                }],
                extra: <div>
                    选若择“尚无”，系统将通过热词/操作语，生成训练文本
                </div>,
                rules: [{ required: true, message: '请选择' }]
            })
        }
        return result;
    }, [ list, hasSelected ]);

    /** 表单 */
    const formItems2$ = useMemo(( ) => {
        const result: any[ ] = [{
            key: 'newset',
            label: `数据集`,
            type: 'input',
            placeholder: '新数据集名称',              
            rules: [{ required: true, message: '请填写数据集名称' }]
        }];
        if ( !!newsetName ) {
            result.push({
                key: 'type',
                label: '训练文本',
                type: 'radio',
                options: [{
                    label: '已有',
                    value: ETrain.hasTrain
                }, {
                    label: '尚无',
                    value: ETrain.noTrain
                }],
                extra: <div>
                    选若择“尚无”，系统将通过热词/操作语，生成训练文本
                </div>,
                rules: [{ required: true, message: '请选择' }]
            })
        }
        return result;
    }, [ list, newsetName ]);

    /** didMount */
    useEffect(( ) => {
        list$.load('');
    }, [ ])

    return (
        <div className="p-user-model-yuyin-train animated fadeIn">
            
            <div className="title">
                <Tooltip
                    title='更多文档'
                >
                    <a 
                        target='blank'
                        style={{ fontSize: 14 }}
                        href='http://aidoc.gz.cvte.cn/docs/customer-model-train/customer-model-train-1c7ttd280vhrs'
                    >
                        语音标注
                    </a>    
                </Tooltip>  
                {
                    !!type && (
                        <Tooltip
                            title={`返回`}
                        >
                            <div
                                onClick={( ) => { type$('');defaultStep$( 0 )}}
                                style={{ marginLeft: 10, display: 'inline-block' }}
                            >
                                <Icon 
                                    type="double-left" 
                                    style={{ color: '#1890ff', fontSize: 14, cursor: 'pointer' }}
                                />
                            </div>
                        </Tooltip>
                    )
                }
            </div>

            {
                !type && (
                    <div 
                        className='flex-block'
                    >
                        <div
                            className='flex-item'
                        >
                            <PageHeader 
                                title='方式一：'
                                subTitle='选择已有数据集'
                            />
                            <div>
                                <TrainForm1 
                                    ref={ formRef1 }
                                    formItems={ formItems1$ }
                                    onChange={ e => onForm( e, EFormType.select )}
                                />
                                <div className='btn-block'>
                                    <Button 
                                        type="primary"
                                        onClick={( ) => onSelectType( EFormType.select )}
                                    >
                                        确定
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='line'></div>
                        <div
                            className='flex-item'
                        >
                            <PageHeader 
                                title='方式二'
                                subTitle='创建新数据集'
                            />
                            <div>
                                <TrainForm2
                                    ref={ formRef2 }
                                    formItems={ formItems2$ }
                                    onChange={ e => onForm( e, EFormType.create )}
                                />
                                <div className='btn-block'>
                                    <Button 
                                        type="primary"
                                        onClick={( ) => onSelectType( EFormType.create )}
                                    >
                                        确定
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 第一种训练类型 */}
            {
                type === ETrain.hasTrain && (
                    <Train1 
                        bucket={ bucket }
                        defaultStep={ defaultStep }
                    />
                )
            }

            {/* 第二种训练类型 */}
            {
                type === ETrain.noTrain && (
                    <Train2 
                        bucket={ bucket }
                        defaultStep={ defaultStep }
                    />
                )
            }

        </div>
    )
}

type YuyinTrain = {
    aid: string
    aIndex: any
}

enum EFormType {
    select = 1,
    create
}

enum ETrain {
    hasTrain = 1,
    noTrain
}