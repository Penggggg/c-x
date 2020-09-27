import React, { useEffect, useMemo, useRef } from 'react';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { Drawer, Button, Icon } from 'antd';
import { useList } from '@cvte/ai-web-util/hooks';
import { http } from '@cvte/ai-web-util/util';
import { MyForm } from '@cvte/ai-web-util/components';

type PTrainModel = {
    show: boolean
    modelId: string
    onClose: ( ) => void
}

type TDataset = {
    id: string,
    create_time: string,
    description: string,
    dataset_name: string,
    bucket_name: string,
    s3_name: string,
    is_training: number,
    dataset_manage_id: string
}

type TAlgotithmModelVersion = {
    id: string,
    create_time: string,
    description: string,
    delete_time: string,
    model_version_name: string,
    state: number,
    update_time: string,
    result_model_remote: string,
    result_check_file_path: string,
    offline_tar_path: string,
    model_id: string,
    tar_error_msg: string
}


const TrainForm = MyForm('train-model')

export const TrainModel = ( props: PTrainModel ) => {
    
    const formRef = useRef( null );

    /** 数据集列表 */
    const [ list, list$ ] = useList< TDataset >({
        listUrl: '/t-apis/dataset/list',
    });

    /** 版本列表 */
    const [ versions, versions$ ] = useList< TAlgotithmModelVersion >({
        listUrl: '/t-apis/model/versions',
    });

    /** 拉取版本列表 */
    const fetchVersion = ( id: string ) => {
        !!id && versions$.load(`?model_id=${id}`)
    }

    /** 创建训练 */
    const onTrain = ( ) => {
        const form: any = formRef.current;
        form.validateFields(( err, value ) => {
            if ( !!err ) { return; }
            http.post({
                data: { ...value},
                url: '/t-apis/train/start'
            }).then( res => {
                const { status } = res;
                if ( status !== 200 ) { return; }
                !!props.onClose && props.onClose( );
            });
        })
    }

    /** 表单 */
    const formItems$ = useMemo(( ) => {

        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        const DatasetSys = isProd ? 
            `http://drive.research.cvte.cn/` :
            `http://10.22.21.26:9081/#/dashboard`;

        return [{
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
            </div>
        }, {
            key: 'base_model_version_id',
            label: '版本',
            type: 'select',
            placeholder: '请选择版本',
            options: versions.map( x => ({
                value: x.id,
                label: x.model_version_name
            })),
            rules: [
                { required: true, message: '请选择版本' }
            ]
        }, {
            key: 'model_version_name',
            label: '名称',
            type: 'input',
            placeholder: '请填写名称',
            rules: [
                { required: true, message: '请填写名称' }
            ]
        }, {
            key: 'description',
            label: '描述',
            type: 'input',
            placeholder: '请填写描述',
            rules: [ ]
        }]
    }, [ versions, list ]);

    /** 加载数据集、版本 */
    useEffect(( ) => {
        if ( !props.show ) { return; }

        list$.load('');
        fetchVersion( props.modelId );

    }, [ props.modelId, props.show ])

    /** 表单重置 */
    useEffect(( ) => {
        const form: any = formRef.current;
        !!form && form.resetFields( );
    }, [ props.show ]);


    return (
        <Drawer
            title="开始训练"
            placement="right"
            width={ 450 }
            closable={ false }
            visible={ props.show }
            onClose={ props.onClose }
        >
            <TrainForm 
                ref={ formRef }
                formItems={ formItems$ }
            />
            <div
                style={{ paddingTop: 20, textAlign: 'right' }}
            >
                <Button 
                    type="primary"
                    onClick={ onTrain }
                >
                    提交
                </Button>
            </div>
        </Drawer>
    )
}