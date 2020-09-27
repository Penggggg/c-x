import Iframe from 'react-iframe'
import { useHistory } from 'react-router-dom';
import { http } from '@cvte/ai-web-util/util';
import { Button, Icon, Alert, List } from 'antd';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { systems } from '../../../../util/const';
import './index.less';

const TrainForm = MyForm('normal-user-train-form')
export const Train = ( props: TPTrain ) => {

    const formRef = useRef( null );

    const history = useHistory( );

    /** 模型 extra提示 */
    const [ modelTips, modelTips$ ] = useState('')

    /** 数据集 预览url */
    const [ datasetUrl, datasetUrl$ ] = useState('');

    /** 场景列表 */
    const [ sceneList, sceneList$ ] = useList< any >({
        listUrl: `/t-apis/scenarios/all`
    })

    /** 数据集列表 */
    const [ list, list$ ] = useList< any >({
        listUrl: '/t-apis/dataset/list',
    });

    /** 提交 */
    const onSubmit = ( ) => {
        const form: any = formRef.current;
        form.validateFields(( err, value ) => {
            const { model_id } = value;
            if ( !!err ) { return; }

            http.post({
                data: { 
                    ...value,
                    model_id: model_id[ 1 ],
                    scenarios_id: model_id[ 0 ]
                },
                successMsg: '正在排队',
                url: '/t-apis/public/train_model'
            }).then( res => {
                const { status } = res;
                if ( status !== 200 ) { return; }

                form.resetFields( );
                history.push(`/user/model/${props.aid}/${props.aIndex}/my`);

            });
        });
    }

    /** 表单变动 - 显示iframe、模型详情 */
    const onChange = e => {
        const { dataset_manage_id, model_id } = e;

        // 显示iframe
        if ( !!dataset_manage_id ) { 
            const dataset = list.find( x => x.dataset_manage_id === dataset_manage_id );
            !!dataset && datasetUrl$( dataset.info )
        } else {
            datasetUrl$(''); 
        }

        // 模型详情
        if ( !!model_id && !!model_id[ 1 ]) {
            try {
                const scene: any = sceneList.find( x => x.id === model_id[ 0 ]);
                const model: any = scene.models.find( x => x.id === model_id[ 1 ]);
                modelTips$( model.description );
            } catch ( e ) {
                modelTips$('');
            }
        }
        
    }

    /** 表单 */
    const formItems$ = useMemo(( ) => {

        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        const DatasetSys = isProd ? 
            `http://drive.research.cvte.cn/` :
            `http://10.22.21.26:9081/#/dashboard`;

        const sceneOpts = sceneList
            .filter( x => Array.isArray( x.models ) && x.models.length > 0 )
            .map( scene => {
                return {
                    value: scene.id,
                    label: scene.scenarios,
                    children: scene.models.map( x => ({
                        value: `${x.id}`,
                        label: x.model_name
                    }))
                }
            });

        return [{
            key: 'model_id',
            label: '模型',
            type: 'cascader',
            placeholder: '请选择模型',
            options: sceneOpts,
            rules: [{ required: true, message: '请选择模型' }],
            extra: modelTips ? <div style={{ marginBottom: '-5px' }}>
                <Icon 
                    theme="twoTone"
                    type="info-circle"
                    style={{ marginRight: 8 }}
                />
                { modelTips }
            </div> : ''
        }, {
            key: 'dataset_manage_id',
            label: '数据集',
            type: 'select',
            placeholder: '请选择数据集',
            options: list.map( x => ({
                value: x.dataset_manage_id,
                label: x.dataset_name
            })),
            rules: [
                { required: true, message: '请选择数据集' }
            ],
            extra: <div 
                style={{ cursor: 'pointer' }}
                onClick={( ) => window.open( DatasetSys )}
            >
                <Icon 
                    theme="twoTone"
                    type="info-circle"
                    style={{ marginRight: 8 }}
                />
                创建数据集
            </div>,
            popover: !!datasetUrl ? (
                <Iframe 
                    width="400px"
                    height="500px"
                    url={ datasetUrl }
                />
            ) : ''
        }, {
            key: 'description',
            label: '描述',
            type: 'textarea',
            placeholder: '请填写描述',
            rules: [ ]
        }]
    }, [ list, datasetUrl, sceneList, modelTips ]);

    /** didMount */
    useEffect(( ) => {
        list$.load('');
        sceneList$.load(`?algorithm_id=${props.aid}`)
    }, [ ]);

    return (
        <div className="p-model-train animated fadeIn">

            <div>
                <div className="title">
                    训练模型
                </div>
                
                <div className="content-block">

                    {/* 表单 */}
                    <div className="form-block">
                        <TrainForm 
                            ref={ formRef }
                            onChange={ onChange }
                            formItems={ formItems$ }
                        />
                        <div
                            style={{ padding: '20px 0 0 30px' }}
                        >
                            <Button
                                type="primary"
                                onClick={ onSubmit }
                            >
                                确认
                            </Button>
                        </div>
                    </div>

                    {/* 提示 */}
                    <div className="tips-block">
                        <Alert 
                            showIcon 
                            type="info" 
                            message={
                                <div>
                                    详细说明 
                                    <a 
                                        target="blank"
                                        style={{ fontSize: 12, marginLeft: 8 }}
                                        href="http://aidoc.gz.cvte.cn/docs/customer-model-train/customer-model-train-user-train" 
                                    >
                                        (更多)
                                    </a>
                                </div>
                            } 
                        />
                        <List
                            style={{ padding: '15px 10px 0' }}
                        >
                            <List.Item>
                                <List.Item.Meta
                                    title='训练模型'
                                    description="通过指定的数据集，可训练出适合不同场景的模型"
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    title='模型'
                                    description="已有的模型为研究院相关方向研究出来的模型，已经通过实际项目的验证，为稳定可用的「原始模型」"
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    title='数据集'
                                    description={<div>训练用的数据集，需要您自行上传到<a href={ systems.Datasets } target="blank">数据集管理平台</a>，并进行管理，如果上传的数据为未标注数据，需要先进行标注。在<a href={ systems.Datasets } target="blank">数据集管理平台</a>中：「组名」即数据集名称，在「data」路径下存储数据集的数据，而「README.json」则用来描述数据集,  如果是您上传的是已标注数据集，需要您手工创建「README.json」文件。<a href='http://aidoc.gz.cvte.cn/docs/customer-model-train/customer-model-train-dataset' target="blank">详细说明</a></div>}
                                />
                            </List.Item>
                        </List>
                    </div>
                </div>
            </div>
        </div>
    )
}

type TPTrain = {
    aid: string
    aIndex: any
}