import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { findDicCN } from '../../util/dic';
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

const DeployForm = MyForm('deploy-form')

export const DeployOnline = ({ show, modelId, onClose }: TDeployOnline ) => {

    const formRef = useRef( null );

    /** 环境变量 */
    const [ envs, env$ ] = useState<{[ key: string ]: string }>({ })

    /** 版本列表 */
    const [ versions, versions$ ] = useList< TAlgotithmModelVersion >({
        listUrl: '/t-apis/model/versions',
    });

    /** 项目列表 */
    const [ propjects, propjects$ ] = useList< any >({
        listUrl: '/t-apis/project/list',
    });
    
    /** 提交确认 */
    const onSubmit = ( ) => {
        const form: any = formRef.current;
        form.validateFields(( err, value ) => {
            const { project_id } = value;
            if ( !!err ) { return; }

            http.post({
                data: { 
                    ...value,
                    env: JSON.stringify( envs ),
                    project_id: project_id[ 1 ]
                },
                successMsg: '部署成功',
                url: '/t-apis/deploy/online'
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
        
        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        const cdscaderOpts = Object.keys( propjects )
            .map( name => {
                return {
                    label: name,
                    value: name,
                    children: propjects[ name ].map( x => ({
                        value: `${x.id}`,
                        label: findDicCN( 'project.envType', x.env_type )
                    }))
                }
            });

        const SysUrl = isProd ? 
            `http://server.research.cvte.cn` :
            `http://10.22.21.27:8090`;

        return [{
            key: 'project_id',
            label: '项目',
            type: 'cascader',
            placeholder: '请选择项目',
            options: cdscaderOpts,
            rules: [{ required: true, message: '请选择项目' }],
            extra: <div 
                style={{ cursor: 'pointer' }}
                onClick={( ) => window.open( SysUrl )}
            >
                <Icon 
                    theme="twoTone"
                    type="info-circle"
                    style={{ marginRight: 8 }}
                />
                创建项目
            </div>
        }, {
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
            min: 0,
            key: 'replicas',
            label: '实例个数',
            type: 'number',
            defaultValue: 1,
            placeholder: '请填写实例个数',
            rules: [
                { required: true, message: '请填写实例个数' }
            ],
            extra: <div style={{ fontSize: 12 }}>
                多实例可提高并发，但会消耗更多资源
            </div>
        }]
    }, [ propjects, versions ]);

    /** 加载表单数据 */
    useEffect(( ) => {
        if ( !show ) { return; }

        propjects$.load('')
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