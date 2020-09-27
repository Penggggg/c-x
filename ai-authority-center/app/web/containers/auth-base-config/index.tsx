import moment from 'moment';
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Form, Input, Row, Col, DatePicker, Switch, Table, Modal } from 'antd';
import OrgModal from '../org-selector-modal'
import { http } from '../../util/http';
import { ERoleUserType } from '../../util/enum';
import { createColumns } from '../../util/antdTableColumns';
import './index.less';

type TAuthBaseConfig = {
    form: WrappedFormUtils
    sys_id: string
    app_id: string
    selectingRole: string
}

type TRoleBase = {
    role_id: string,
    name: string,
    remark?: string
    end_time?: number
    start_time?: number
    is_enable: boolean
}

type TRoleUser = {
    auth_user_id: string,
    role_id: string,
    type: string,
    name?: string,
    value: string
}

const formName = 'auth-base';
export const AuthBaseConfig = Form.create({ name: formName })(({ form, selectingRole, sys_id, app_id }: TAuthBaseConfig ) => {

    /** 组织架构弹框 */
    const [ orgModal, setOrgModal ] = useState( false );

    /** 账号列表 */
    const [ accountList, setAccountList ] = useState< TRoleUser[ ]>([ ]);

    /** 表单 */
    const formItems$ = useMemo(( ) => {
        return [{
            key: 'name',
            label: '名称',
            type: 'input',
            placeholder: '请填写名称',
            rules: [
                { required: true, message: '请填写名称' }
            ]
        }, {
            key: 'remark',
            label: '备注',
            type: 'input',
            placeholder: "角色备注",
            rules: [ ]
        }, {
            key: 'range',
            type: 'rangePicker',
            label: '有效期',
            rules: [
                { type: 'array', required: true, message: '请选择有效期' }
            ]
        }, , {
            key: 'is_enable',
            type: 'switch',
            label: '是否有效',
            rules: [ ]
        }]
    }, [ ]);

    /** 获取角色的基本信息 */
    const fetchBase = ( ) => {
        http.get< TRoleBase >({
            params: {
                role_id: selectingRole
            },
            url: '/apis/role/base'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            const { name, remark, is_enable, start_time, end_time } = data;
            form.setFieldsValue({
                name,
                remark,
                is_enable: !!is_enable,
                range: !!start_time && !!end_time ? [ 
                    moment( start_time ), 
                    moment( end_time )
                ] : [  ]
            });
        })
    }

    /** 获取角色的账号列表 */
    const fetchUsers = ( ) => {
        http.get< TRoleUser[ ]>({
            params: {
                role_id: selectingRole
            },
            url: '/apis/role/users'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            setAccountList( data );
        })
    }

    /** 更新基础信息 */
    const updateBase = ( ) => {
        form.validateFields(( err, value ) => {
            if ( !!err ) { return; }
            const { is_enable, range } = value;
            const [ start_time, end_Time ] = range;

            http.put({
                data: {
                    ...value,
                    role_id: selectingRole,
                    is_enable: !!is_enable ? 1 : 0,
                    end_time: !!end_Time ? end_Time.valueOf( ) : null,
                    start_time: !!start_time ? start_time.valueOf( ) : null
                },
                url: `/apis/role/base`
            });
        });
    }

    /** 选择组织架构、账号 */
    const onSelectAccount = ( e: any ) => {
        const { type, value, detail } = e;
        setOrgModal( false );

        let meta = [ ];
        if ( type === ERoleUserType.user ) {
            meta = detail.map(( x: any ) => ({
                type: 'user',
                name: x.name,
                value: x.account
            }))
        } else if ( type === ERoleUserType.org ) {
            meta = detail.map(( x: any ) => ({
                type: 'org',
                name: x.orgName,
                value: x.orgId
            }))
        } else if ( type === ERoleUserType.custom ) {
            meta = value.map(( x: any ) => ({
                type: 'custom',
                value: x
            }))
        }

        http.post<any>({
            data: {
                users: meta,
                role_id: selectingRole
            },
            url: `/apis/role/users`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
        })
    }

    const onDelteAccount = ( e: any ) => {
        Modal.confirm({
            title: '提示',
            content: '确定删除吗？',
            onOk: ( ) => {
                http.delete<any>({
                    params: { 
                        auth_user_ids: e.auth_user_id
                    },
                    url: `/apis/role/users`
                }).then( res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                    fetchUsers( );
                })
            }
        })
    }

    /** 模块 - 账号列表 */
    const accountTable = useMemo(
        ( ) => createColumns( accountList, accountList[ 0 ], { 
                type: {
                    fixed: 'left',
                    title: '类型',
                    render: ( item: TRoleUser ) => (
                        <span>
                            { item.type === 'user' ? 
                                '域账号' :
                                item.type === 'org' ?
                                    '组织架构' : 
                                    '自定义'
                            }
                        </span>
                    )
                },
                value: {
                    title: '名称',
                    render: ( item: TRoleUser ) => (
                        <span>{ item.name || item.value }</span>
                    )
                }
            }, {
                delete: onDelteAccount
            }),
        [ accountList ]
    );

    /** selectingRole变更 */
    useEffect(( ) => {
        fetchBase( );
        fetchUsers( );
    }, [ selectingRole ])

    /** DidMount */
    useEffect(( ) => {

    }, [ ]);

    return (
        <div className="con-auth-base-config">

            {/* 基础信息 */}
            <Card
                title="基础信息"
                extra={<a onClick={ e => updateBase( )}>更新</a>}
            >
                <Form>
                    <Row>
                        {
                            formItems$.map(( formItem: any, k: number ) => (
                                <Col 
                                    key={ k }
                                    span={ 11 } 
                                    offset={ 1 }
                                >
                                    <Form.Item
                                        label={ formItem.label }
                                    >
                                        {
                                            form.getFieldDecorator<any>( formItem.key, {
                                                rules: formItem.rules,
                                                valuePropName: formItem.type === 'switch' ? 'checked' : 'value'
                                            })(
                                                formItem.type === 'input' ?
                                                    <Input 
                                                        disabled={ !!formItem.disabled } 
                                                        placeholder={ formItem.placeholder || ''} 
                                                    /> :
                                                    formItem.type === 'rangePicker' ?
                                                        <DatePicker.RangePicker 
                                                            showTime 
                                                            format="YYYY-MM-DD" 
                                                        /> :
                                                        formItem.type === 'switch' ?
                                                            <Switch 
                                                            /> :
                                                        <div></div>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            ))
                        }
                    </Row>
                </Form>
            </Card>

            {/* 人员列表 */}
            <Card
                title="账号列表"
                style={{ marginTop: 15 }}
                extra={<a onClick={( ) => setOrgModal( true )}>添加</a>}
            >
                <Table 
                    { ...accountTable }
                    pagination={ false }
                />
            </Card>

            {/* 组织架构选择 */}
            <OrgModal
                show={ orgModal }
                onCancel={( ) => setOrgModal( false )}
                onConfirm={( e: any ) => onSelectAccount( e )}
            />

        </div>
    )
}) as any