import { useComputed } from 'mobx-react-lite';
import { useList } from '@cvte/ai-web-util/hooks';
import { MyForm } from '@cvte/ai-web-util/components';
import { createColumns, http } from '@cvte/ai-web-util/util';
import { PageHeader, Empty, Table, Button, Modal } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useMemo, useRef } from 'react';

import { useStore } from '../../../store';
import { ETaskRole } from '../../../util/enum';
import { parseQuery } from '../../../util/query';
import { findDic, findDicCN } from '../../../util/dic';

const UpateForm = MyForm('taskRole-update');
const CreateForm = MyForm('createForm-update');

/**
 * 任务的权限管理
 */
export const TaskRole = ({ }: TaskRole ) => {

    const updateFormRef = useRef< any >( null );
    const createFormRef = useRef< any >( null );

    const history = useHistory( );
    const { User } = useStore( );

    /** 添加框 */
    const [ modal, modal$ ] = useState( false );

    /** 更新框 */
    const [ modelEdit, modelEdit$ ] = useState( false );

    /** 当前选中的成员 */
    const [ selectingMember, selectingMember$ ] = useState('');

    /** 任务id */
    const [ taskId, taskId$ ] = useState('');

    /** 任务成员 */
    const [ taskUsers, taskUsers$ ] = useList<any>({
        listUrl: `/t-apis/admin/labeltask/users`
    });

    /** 更新成员的权限 */
    const readyUpdate = ( item ) => {
        const { role, user_login_name } = item;

        modelEdit$( true );
        selectingMember$( user_login_name );

        setTimeout(( ) => {
            const form = updateFormRef.current;
            form.setFieldsValue({ role })
        }, 100 );
    }

    /** 更新成员权限 */
    const onUpdate = ( ) => {
        const form = updateFormRef.current;
        form.validateFields(( err, values ) => {
            if ( !!err ) { return; }
            const { role } = values;
            const data = {
                role,
                label_task_id: taskId,
                user_login_name: selectingMember
            };
            
            http.put({
                data,
                successMsg: '更新成功',
                url: `/t-apis/admin/labeltask/users`
            }).then( res => {
                const { status } = res;
                if ( status !== 200 ) { return; }

                form.resetFields( );
                modelEdit$( false );
                taskUsers$.load(`?label_task_id=${taskId}`)
            })
        })
    }

    /** 添加成员 */
    const onCreate = ( ) => {
        const form = createFormRef.current;
        form.validateFields(( err, values ) => {
            if ( !!err ) { return; }
            const { role, accounts } = values;

            const data = {
                role,
                label_task_id: taskId,
                user_login_name_list: accounts.map( x => x.split('-')[ 1 ])
            };
            
            http.post({
                data,
                successMsg: '添加成功',
                url: `/t-apis/admin/labeltask/users`
            }).then( res => {
                const { status } = res;
                if ( status !== 200 ) { return; }

                form.resetFields( );
                taskUsers$.load(`?label_task_id=${taskId}`)
                modal$( false );
            })
        })
    }

    /** 列表 */
    const listTable = useMemo(
        ( ) => createColumns( taskUsers, taskUsers[ 0 ], {
            user_login_name: '用户',
            role: {
                title: '权限',
                render: ( item: any ) => (
                    <a 
                        style={{ color: item.role === ETaskRole.noRole ? '#f5222d' : '#1890ff' }}
                    >
                        { findDicCN('task.role', item.role )}
                    </a>
                )
            }
        }, {
            edit: readyUpdate
        }), [ taskUsers ]
    );

    /** 权限表单 - 更新 */
    const formItems$ = useMemo(( ) => {
        return [{
            key: 'role',
            label: '权限',
            type: 'select',
            placeholder: '请选择权限',
            options: findDic('task.role'),
            rules: [{ required: true, message: '请选择权限' }]
        }]
    }, [ ]);

    /** 权限表单 - 创建 */
    const formItems2$ = useMemo(( ) => {
        return [{
            key: 'accounts',
            label: '成员',
            type: 'cvtersearch',
            multipul: true,
            placeholder: '请选择成员',
            query: 'login_name',
            nameKey: 'staff_name_zh',
            accountKey: 'staff_alias_name',
            url:'/t-apis/admin/user/staff',
            rules: [{ required: true, message: '请选择成员' }]
        }, {
            key: 'role',
            label: '权限',
            type: 'select',
            placeholder: '请选择权限',
            options: findDic('task.role'),
            rules: [{ required: true, message: '请选择权限' }]
        }]
    }, [ ]);

    /** 用户是否为当前任务的创建人 */
    const isAdm$ = useComputed(( ) => {
        const target = taskUsers.find( x => x.user_login_name === User.account.login_name );
        return !!target && target.role === ETaskRole.use
    }, [ taskUsers, User.account ]);

    /** didMount 任务详情、检查权限 */
    useEffect(( ) => {
        const { taskId } = parseQuery( location.search );
        
        taskId$( taskId );
        taskUsers$.load(`?label_task_id=${taskId}`)
    }, [ ])

    return (
        <div className="animated fadeIn">

            {/* 头部 */}
            <PageHeader
                title='成员管理'
                onBack={( ) => history.goBack( )}
            />

            {/* 表格 */}
            {
                !!isAdm$ && (
                    <div style={{ paddingTop: 20 }}>

                        <div style={{ padding: '0 0 20px 10px' }}>
                            <Button
                                icon='plus'
                                type='primary'
                                onClick={( ) => modal$( true )}
                            >
                                添加
                            </Button>
                        </div>

                        <Table 
                            { ...listTable }
                            scroll={{ x: 800, y: 550 }}
                            pagination={{ pageSize: 10 }}
                            loading={ taskUsers$.isLoading }
                        />
                    </div>
                )
            }

            {/* 无权限 */}
            {
                !isAdm$ && (
                    <div 
                        style={{ paddingTop: 20 }}
                    >
                        <Empty 
                            description='暂无权限'
                        />
                    </div>
                )
            }

            {/* 添加成员 */}
            <Modal
                title='添加成员'
                onOk={ onCreate }
                visible={ modal }
                onCancel={( ) => modal$( false )}
            >
                <CreateForm 
                    ref={ createFormRef }
                    formItems={ formItems2$ }
                />
            </Modal>

            {/* 修改成员 */}
            <Modal
                title='更新权限'
                onOk={ onUpdate }
                visible={ modelEdit }
                onCancel={( ) => modelEdit$( false )}
            >
                <UpateForm 
                    ref={ updateFormRef }
                    formItems={ formItems$ }
                />
            </Modal>
        </div>
    )
}

type TaskRole = { } & RouteComponentProps;