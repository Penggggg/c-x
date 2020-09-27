import { findDicCN } from '../../util/dic';
import { http } from '@cvte/ai-web-util/util';
import { Button, Icon, Alert, List } from 'antd';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { systems } from '../../util/const';

type TDeployOnlineNormal = {
    aid: string
    defaultVersion?: string
}

const DeployForm = MyForm('deploy-online-normal')

/**
 * @description
 * 普通用户的在线部署
 */
export const DeployOnlineNormal = ({ aid, defaultVersion }: TDeployOnlineNormal ) => {

    const formRef = useRef( null );

    /** 环境变量 */
    const [ envs, env$ ] = useState<{[ key: string ]: string }>({ })

    /** 项目列表 */
    const [ propjects, propjects$ ] = useList< any >({ listUrl: '/t-apis/project/list' });

    /** 模型列表 */
    const [ list, list$ ] = useList< any >({ listUrl: `/t-apis/public/my_models` })

    /** 提交确认 */
    const onSubmit = ( ) => {
        const form: any = formRef.current;
        form.validateFields(( err, value ) => {
            const { project_id } = value;
            if ( !!err ) { return; }

            http.post({
                data: { 
                    ...value,
                    replicas: 1, // 实例个数
                    env: JSON.stringify( envs ),
                    project_id: project_id[ 1 ]
                },
                successMsg: '部署成功',
                url: '/t-apis/deploy/online'
            }).then( res => {
                const { status } = res;
                if ( status !== 200 ) { return; }

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
        } , {
            key: 'model_version_id',
            label: '版本',
            type: 'select',
            placeholder: '请选择版本',
            options: list.map( x => ({
                value: x.version_id,
                label: `${x.version_name}`
            })),
            rules: [{ required: true, message: '请选择版本' }]
        }
        , {
            key: 'app_name',
            label: '服务名称',
            type: 'input',
            placeholder: '请填写服务名称',
            rules: [{ required: true, message: '请填写服务名称' }]
        }]
    }, [ propjects, list ]);

    /** 设置版本默认值 */
    useEffect(( ) => {
        const form: any = formRef.current;
        const hasItem = !!list.find( x => x.version_id === defaultVersion );
        
        if ( hasItem ) {
            form.setFieldsValue({
                model_version_id: defaultVersion
            })
        }
    }, [ list ]);

    /** 模型列表 */
    useEffect(( ) => {
        list$.load(`?algorithm_id=${aid}`);
    }, [ aid ]);

    /** didMount */
    useEffect(( ) => {
        propjects$.load('');
    }, [ ]);

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>

            <div style={{ width: 450, paddingLeft: 20, marginRight: 100 }}>
                {/* 部署表单 */}
                <DeployForm 
                    ref={ formRef }
                    formItems={ formItems$ }
                />

                {/* 确认按钮 */}
                <div style={{ marginLeft: 50, marginTop: 40 }}>
                    <Button 
                        type="primary"
                        onClick={ onSubmit }
                    >
                        确定
                    </Button>
                </div>
            </div>

            {/* 提示 */}
            <div style={{ width: 400 }}>
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
                            title='在线部署'
                            description={<div>是指通过研究院工程组的<a href={ systems.Sys } target="blank">服务管理系统</a>进行算法模型的部署使用。算法服务部署在研究院的服务器集群中，部署完成后，您可以直接调用相应接口使用。</div>}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='项目'
                            description={<div>在<a href={ systems.Sys } target="blank">服务管理系统</a>创建的项目。 您的算法服务将会部署在自己创建的项目下。</div>}
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='名称'
                            description="只接受英文字符串，用于访问部署后的模型，生成的「可访问地址」为：http://general-ai.research.cvte.cn:3001/你设置的服务名称"
                        />
                    </List.Item>
                </List>
            </div>

        </div>
    )
}