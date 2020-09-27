import React from 'react';
import { PageHeader } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { DeployList } from '../../../../containers/deploy-list';

type TDeploy =  {
    id: string,
    create_time: null,
    description: string,
    delete_time: null,
    state: number,
    update_time: null,
    api_address: string,
    config: string,
    deploy_type: number,
    model_version_id: string,
    deploy_project_id: string,
    replicas: number,
    gpu_need: number,
    mem_limit: number,
    cpu_limit: number,
    service_name: string
}

export const List = ( props: RouteComponentProps ) => {


    return (
        <div className="animated fadeIn">
            <PageHeader title="部署管理" />

            {/* 表格 */}
            <DeployList 
                url='/t-apis/deploy/list'
            />
            
        </div>
    );
}