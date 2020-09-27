import { http } from '@cvte/ai-web-util/util';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Layout, Input, Button, Table } from 'antd';
import './OrgUsers.less';

const OrgUsers = React.forwardRef(({ orgId, name, account, onSelect }: any, ref ) => {

    const [ pageSize ] = useState( 10 );
    /** 分野 */
    const [ total, setTotal ] = useState( 0 );
    /** 分页 */
    const [ pageNum, setPageNum ] = useState( 0 );
    /** 表格数据 */
    const [ row, setRow ] = useState([ ]);
    /** 选中 - id */
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([ ]);
    /** 选中 - 整条记录 */
    const [ selectedRows, setSelectedRows ] = useState([ ]);

    /** 表格 */
    const tableColumns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '用户账号',
            dataIndex: 'account',
            key: 'account'
        }, {
            title: '手机号码',
            dataIndex: 'telephone',
            key: 'telephone'
        }, {
            title: '邮箱地址',
            dataIndex: 'email',
            key: 'email'
        }
    ]

    /** 拉取数据 */
    const fetchUsers = (page: any) => {
        if ( !orgId && !name && !account ) { return; }
        let reqData: any = {
            pageNum: page !== undefined ? page : (pageNum + 1),
            pageSize, orgId, name, account 
        };
        Object.keys( reqData ).map( key => {
            if ( reqData[ key ] === undefined ) {
                delete reqData[ key ]
            }
        });
        http.get< any >({
            params: reqData,
            url: '/apis/common/org/users',
        }).then( res => {
            const { pagination, rows } = res.data;
            setRow( rows );
            setTotal( pagination.total );
            setPageNum( pagination.pageNum );
        });
    }

    /** 选择 */
    const selectHandler = ( ids: any, rows: any ) => {
        setSelectedRows( rows );
        setSelectedRowKeys( ids );
    }

    useEffect(( ) => {
        setPageNum( 0 );
        fetchUsers( 1 );
    }, [ orgId, name, account ]);

    useEffect(( ) => {
        !!onSelect && onSelect( selectedRowKeys, selectedRows );
    }, [ selectedRowKeys ]);

    useImperativeHandle( ref, ( ) => ({
        reset: ( ) => {
            setRow([ ]);
            setTotal( 0 );
            setPageNum( 0 );
            setSelectedRowKeys([ ]);
            setSelectedRows([ ]);
        }
    }));

    return (
        <div className="c-org-users">
            <Table 
                size="middle"
                rowKey="account"
                dataSource={ row } 
                columns={ tableColumns } 
                pagination={{ total, simple: true }}
                onChange={ p => fetchUsers( p.current )}
                rowSelection={{
                    selectedRowKeys,
                    onChange: selectHandler
                }}
            />
        </div>
    );
});

export default React.memo( OrgUsers );

