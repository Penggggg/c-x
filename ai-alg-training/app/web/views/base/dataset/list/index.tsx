import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createColumns } from '@cvte/ai-web-util/util';
import { PageHeader, Table, Icon } from 'antd';
import { findDicCN } from '../../../../util/dic';
import { transferTime2CN } from '../../../../util/time';
import { useList } from '@cvte/ai-web-util/hooks';

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

export const List = ( props: RouteComponentProps ) => {
    
    /** 列表 */
    const [ list, list$ ] = useList< TDataset[ ]>({
        listUrl: '/t-apis/dataset/list',
    });

    /** 跳到数据集系统 */
    const goDatasetSys = ( ) => {
        const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');
        const DatasetSys = isProd ? 
            `http://drive.research.cvte.cn/` :
            `http://10.22.21.26:9081/#/dashboard`;

        window.open( DatasetSys )
    }

    /** 列表 */
    const listTable = useMemo(
        ( ) => createColumns( list, list[ 0 ], {
            dataset_name: {
                title: '名称',
                fixed: 'left',
                render: ( item: TDataset ) => (
                    <a>{ item.dataset_name }</a>
                )
            },
            bucket_name: '桶名',
            s3_name: '远程存储',
            create_time: {
                title: '创建时间',
                render: ( item: TDataset ) => (
                    <span>{ transferTime2CN( item.create_time )}</span>
                )
            },
            description: '备注',
            is_training: {
                title: '训练中',
                fixed: 'right',
                render: ( item: TDataset ) => (
                    <a>{ findDicCN('dataset.is_training', item.is_training )}</a>
                )
            },
        }), [ list ]
    )
    
    /** didMount */
    useEffect(( ) => {
        list$.load('');
    }, [ ]);

    return (
        <div className="animated fadeIn">
            <PageHeader 
                title="数据集管理" 
                subTitle={<div 
                    onClick={ goDatasetSys }
                    style={{ cursor: 'pointer' }}
                >
                    <Icon 
                        theme="twoTone"
                        type="info-circle"
                        style={{ marginRight: 5, marginLeft: 15 }}
                    />
                    查看更多
                </div>}
            />
            <Table 
                { ...listTable }
                scroll={{ x: 1300, y: 550 }}
                pagination={{ pageSize: 5 }}
                loading={ list$.isLoading }
            />
        </div>
    );
}