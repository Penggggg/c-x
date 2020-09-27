import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Icon } from 'antd';

/** 面包屑 */
export const AppBreadcrumb = ( ) => {

    /** 面包屑中文 */
    const [ breadcrumbCN, breadcrumbCN$ ] = useState< any[ ]>([ ]);

    /** 字段值 */
    const routeDic = {
        dataset: {
            label: '数据集',
            to: '/base/dataset/list'
        },
        algorithm: {
            label: '算法管理',
            to: '/base/algorithm/list'
        },
        train: {
            label: '训练管理',
            to: '/base/train/list'
        },
        deploy: {
            label: '部署管理',
            to: '/base/deploy/list'
        },
        model: {
            label: '模型管理'
        },
        swagger: {
            label: '在线文档'
        }
    };

    /** 检测路由 */
    const detectUrl = ( ) => {
        const resultCN: any[ ] = [ ];
        const { pathname } = window.location;
        const routeArr = pathname.split('/').filter( x => !!x );
        routeArr.map( x => {
            if ( !!routeDic[ x ]) {
                resultCN.push( routeDic[ x ])
            }
        });

        const someDifferent = resultCN.some(( x, k ) => x !== breadcrumbCN[ k ]);

        if (( resultCN.length !== breadcrumbCN.length ) || someDifferent ) {
            return breadcrumbCN$( resultCN );
        }
    };

    useEffect(( ) => {
        setInterval(( ) => detectUrl( ), 500 );
    }, [ ]);
    
    return (
        <Breadcrumb>
            <Breadcrumb.Item href="">
                <Icon type="home" />
            </Breadcrumb.Item>
            {
                breadcrumbCN.map(( x, k ) => (
                    <Breadcrumb.Item key={ k }>
                    {
                        ( k === breadcrumbCN.length - 1 ) || !x.to ? 
                            x.label :
                            <Link to={ x.to }>{ x.label }</Link> 
                    }
                    </Breadcrumb.Item>
                ))
            }
        </Breadcrumb>
    )

};