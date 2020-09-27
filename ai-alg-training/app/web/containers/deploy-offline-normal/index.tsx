import { Button, Alert, List } from 'antd';
import { http } from '@cvte/ai-web-util/util';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';
import React, { useRef, useMemo, useEffect, useState } from 'react';

type TDeployOnlineNormal = {
    aid: string
    defaultVersion?: string
}

const DeployForm = MyForm('deploy-offline-normal')

/**
 * @description
 * 普通用户的离线部署
 */
export const DeployOfflineNormal = ({ aid, defaultVersion }: TDeployOnlineNormal ) => {

    const formRef = useRef( null );

    /** 环境变量 */
    const [ envs, env$ ] = useState<{[ key: string ]: string }>({ })

    /** 模型列表 */
    const [ list, list$ ] = useList< any >({ listUrl: `/t-apis/public/my_models` })

    /** 表单 */
    const formItems$ = useMemo(( ) => {

        return [{
            key: 'model_version_id',
            label: '模型版本',
            type: 'select',
            placeholder: '请选择模型版本',
            options: list.map( x => ({
                value: x.version_id,
                label: `${x.name} - ${x.version_name}`
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
            type: 'textarea',
            placeholder: '请填写描述',
            rules: [ ]
        }]
    }, [ list ]);

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

                form.resetFields( );
            });
        })
    };

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
                            title='离线部署'
                            description="是指获取训练出来的「模型版本离线包」，部署在自己的「私有服务器」"
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='名称'
                            description="用于标识「服务」，无特殊用途"
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='接口地址'
                            description="在本系统在线调试时使用。填写内容为「私有服务器」的内网访问地址，例如 http://私有服务器ip:部署端口。如您现在无法确定私有服务器ip和端口，可以先随便填，等待部署完成后修改即可。当然您也可以使用postman进行调试。"
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='使用流程'
                            description={<div>
                                <img src="/dist/img/use-example-1.png" />
                            </div>}
                        />
                    </List.Item>
                </List>
            </div>

        </div>
    )
}