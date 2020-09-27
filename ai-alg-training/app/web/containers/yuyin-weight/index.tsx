import { http } from '@cvte/ai-web-util/util';
import { useHistory } from 'react-router-dom';
import React, { useMemo, useRef } from 'react';
import { MyForm } from '@cvte/ai-web-util/components';
import { PageHeader, Button, Icon, Alert, List, Upload, notification } from 'antd';
import './index.less';

const WeightForm =  MyForm('weight-form');

// 语音标注，权重调整
export const YuyinWeight = ({ bucket }) => {

    const history = useHistory( );

    /** 权重表单 */
    const weightFormRef = useRef< any >( null );

    const goTrain = ( ) => {
        const pathArr = window.location.pathname.split('/');
        pathArr.pop( );
        history.push(`${pathArr.join('/')}/train`)
    }

    /** 测试集上传 */
    const onTestUpload = e => {
        const { status, response } = e.file;
        
        if ( status !== 'done' ) return;
        if ( response.status !== 200 ) return;

        // 展示句频调整
        notification.success({
            message: '提示',
            description: '上传成功'
        });

        // 跳到训练页面
        goTrain( );
    }

    /** 调整权重 */
    const justWeight = ( ) => {
        const form = weightFormRef.current;
        form.validateFields(( err, data ) =>{
            if ( !!err ) return;
            if ( Object.values( data ).reduce(( x: any, y: any ) => x + y, 0 ) !== 1 ) {
                return notification.error({
                    message: '提示',
                    description: '两个权重之和为：1'
                })
            }
            http.post({
                data: {
                    ...data,
                    bucket_name: bucket
                },
                successMsg: '设置成功',
                url: `/t-apis/voice/uploadWeight`
            }).then( res => {
                if ( res.status === 200 ) {
                    // 跳到训练
                    goTrain( );
                } 
            })
        })
    }

    /** 权重表单 */
    const weightForm$ = useMemo(( ) => {
        return [
            {
                min: 0,
                type: 'number',
                key: 'weight_train_data',
                label: '训练模型',
                placeholder: '权重如0.5',
                rules: [
                    { required: true, message: '请填写权重' }
                ]
            }, {
                min: 0,
                type: 'number',
                key: 'weight_base',
                label: '基础模型',
                placeholder: '权重如0.5',
                rules: [
                    { required: true, message: '请填写权重' }
                ]
            }
        ]
    }, [ ])

    return (
        <div className='con-yuyin-weight'>
            <div style={{ width: 400 }}>
                <div style={{ marginBottom: 45 }}>
                    <PageHeader
                        title='方式一：'
                        subTitle='上传测试集，自动生成权重'
                    />
                    <Upload
                        name='file'
                        data={{ bucket_name: bucket }}
                        action={`/t-apis/voice/uploadTest`}
                        onChange={ onTestUpload }
                    >
                        <Button>
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>
                </div>
                <div>
                    <PageHeader
                        title='方式二：'
                        subTitle='手动设置权重'
                    />
                    <WeightForm 
                        ref={ weightFormRef }
                        formItems={ weightForm$ }
                    />
                    <Button 
                        ghost
                        type="primary"
                        onClick={ justWeight }
                        style={{ marginTop: 20 }}
                    >
                        确认
                    </Button>
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
                            title='模型&权重'
                            description={
                                <div>
                                    有基础模型、训练模型2种。系统会两个模型合并的权重，权重和为 1
                                </div>
                            }
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='方式一：'
                            description={
                                <div>
                                    通过上传测试集，自动分析并生成权重
                                </div>
                            }
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='方式二：'
                            description={
                                <div>
                                    手段设置权重
                                </div>
                            }
                        />
                    </List.Item>
                </List>
            </div>
        </div>
    )
}

type YuyinWeight = {
    bucket: string
}