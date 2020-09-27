import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';

type TDeployOnline = {
    show: boolean
    modelId: string
    onClose?: ( ) => void
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

const DeployForm = MyForm('deploy-offline-form')

export const DeployOffline = ({ show, modelId, onClose }: TDeployOnline ) => {

    const formRef = useRef( null );

    /** 环境变量 */
    const [ envs, env$ ] = useState<{[ key: string ]: string }>({ })

    /** 版本列表 */
    const [ versions, versions$ ] = useList< TAlgotithmModelVersion >({
        listUrl: '/t-apis/model/versions',
    });
    
    /** 提交确认 */
    const onSubmit = ( ) => {
        const form: any = formRef.current;
        form.validateFields(( err, value ) => {
            if ( !!err ) { return; }

            http.post({
                data: { 
                    ...value,
                    env: JSON.stringify( envs )
                },
                successMsg: '部署成功',
                url: '/t-apis/deploy/offline_add'
            }).then( res => {
                const { status } = res;
                if ( status !== 200 ) { return; }

                !!onClose && onClose( );
                form.resetFields( );
            });
        })
    };

    /** 表单 */
    const formItems$ = useMemo(( ) => {
        
        return [{
            key: 'model_version_id',
            label: '模型版本',
            type: 'select',
            placeholder: '请选择模型版本',
            options: versions.map( x => ({
                value: x.id,
                label: x.model_version_name
            })),
            rules: [{ required: true, message: '请选择模型版本' }]
        }, {
            key: 'app_name',
            label: '名称',
            type: 'input',
            placeholder: '请填写名称',
            rules: [{ required: true, message: '请填写名称' }]
        }, {
            key: 'api_address',
            label: '接口地址',
            type: 'input',
            placeholder: '请填写接口地址',
            rules: [{ required: true, message: '请填写接口地址' }]
        }, {
            key: 'description',
            label: '描述',
            type: 'input',
            placeholder: '请填写描述',
            rules: [ ]
        }]
    }, [ versions ]);

    /** 加载表单数据 */
    useEffect(( ) => {
        if ( !show ) { return; }
        versions$.load(`?model_id=${modelId}`)

    }, [ modelId, show ]);

    return (
        <div>
            {/* 部署表单 */}
            <DeployForm 
                ref={ formRef }
                formItems={ formItems$ }
            />

            {/* 环境变量动态表单 */}
            {/* <MulvalueActiveForm 
                label="环境变量："
                onChane={ e => env$( e )}
                placeholder={{ key: '请输入key', value: '请输入value' }}
            /> */}

            {/* 确认按钮 */}
            <div style={{ marginLeft: 40, marginTop: 40 }}>
                <Button 
                    type="primary"
                    onClick={ onSubmit }
                >
                    确定
                </Button>
            </div>
        </div>
    )
}