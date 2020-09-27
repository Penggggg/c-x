import { Card, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useList } from '@cvte/ai-web-util/hooks';

import { findAlgorithmCover } from '../../../util/const';
import './index.less';

export const Panel = ( ) => {

    const history = useHistory( );

    /** 算法列表 */
    const [ list, list$ ] = useList< any >({
        listUrl: '/t-apis/public/algorithm_info',
    }); 

    /** 生成卡片封面 */
    const generCoverImg = ( item, key ) => {

        const { algorithm_name } = item;
        const bg = findAlgorithmCover( algorithm_name );

        return (
            <div 
                className="card-container"
            >
                <img 
                    src={ bg || `/dist/img/ai-${ key % 10 }.jpg`}
                />
                <div className="label">
                    { item.model_num }个模型
                </div>
            </div>
        )
    }

    /** 跳到算法详情 */
    const goDetail = ( item ) => {
        history.push(`/user/model/${item.id}/${encodeURIComponent( item.algorithm_name )}/my`)
    }

    /** didMount */
    useEffect(( ) => {
        list$.load(``);
    }, [ ]);

    return (
        <div className="p-user-panel">

            {/* 加载中 */}
            {
               list$.isLoading && (
                    <div className="spin">
                        <Spin 
                            size="large" 
                            spinning={ true }
                        />
                    </div>
               )
            }

            {/* 卡片列表 */}
            {
                !list$.isLoading && (
                    <div className="animated fadeIn">
                        <div className="list-block">
                            {
                                list.map(( item, key ) => (
                                    <div 
                                        key={ key }
                                        className="item"
                                        onClick={ e => goDetail( item )}
                                    >
                                        <Card
                                            hoverable
                                            cover={ generCoverImg( item, key )}
                                            style={{ width: 300, height: 290, marginRight: key !== list.length - 1 ? 60 : 0 }}
                                        >
                                            <Card.Meta
                                                title={ item.algorithm_name }
                                                description={ item.description }
                                            />
                                        </Card>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }

        </div>
    )
}