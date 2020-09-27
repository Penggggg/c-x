import React from 'react';
import { Divider } from 'antd';

interface TCreateColumns {

    metaArr: {
        [ key: string ]: any
    }[ ]

    meta: {
        [ key: string ]: any
    }

    metaTitle: {
        [ key: string ]: string | {
            title?: string,
            render?: any,
            fixed?: any,
            width?: number
        }
    }

    actions: {
        edit?: ( record: any ) => void
        delete?: ( record: any ) => void
    }
}

/**
 * 根据传入的对象、规则，生成table的columns
 */
export const createColumns = ( metaArr: TCreateColumns['metaArr'], meta: TCreateColumns['meta'], metaTitle: TCreateColumns['metaTitle'],  actions?: TCreateColumns['actions']) => {

    if ( !meta ) { return { };}

    let columns: {
        title: string,
        key: string,
        dataIndex?: string,
        render?: any
        fixed?: any,
        width?: number
    }[ ] = [ ];
    
    Object.keys( metaTitle )
        .map( metaKey => {
            if ( !!metaTitle[ metaKey ]) {

                const m = (metaTitle[ metaKey ] as any);

                let columnMeta: any = {
                    key: metaKey,
                    dataIndex: metaKey,
                    title: typeof metaTitle[ metaKey ] === 'string' ? metaTitle[ metaKey ] : m.title
                }

                if ( typeof metaTitle[ metaKey ] === 'object' ) {
                    columnMeta = {
                        ...columnMeta,
                        render: ( text: string, record: any ) => (
                            <span>{ m.render( record )}</span>
                        )
                    }
                    
                    if ( !!m.fixed ) {
                        columnMeta = {
                            ...columnMeta,
                            fixed: m.fixed ,
                            width: m.width || 150
                        }
                    } 
                }
                columns.push( columnMeta )
            }
        });

    const dataSource = metaArr.map(( x, k ) => ({
        key: k,
        ...x
    }));

    if ( !!actions ) {
        columns.push({
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: ( text: string, record: any ) => (
                <span>
                    {
                        !!actions.delete && (
                            <a onClick={ e => {!!actions.delete && actions.delete( record )}}>删除</a>
                        )
                    }
                    {
                        !!actions.edit && (
                            <span>
                                <Divider type="vertical" />
                                <a onClick={ e => {!!actions.edit && actions.edit( record )}}>编辑</a>
                            </span>
                        )
                    }
                </span>
            )
        })
    }

    return {
        columns,
        dataSource
    };

}