import { Layout, Modal, Radio, Input } from 'antd';
import React, { useState, useRef } from 'react';
import OrgTree from './OrgTree';
import OrgUsers from './OrgUsers';
import OrgSearch from './OrgSearch';
import { ERoleUserType } from '../../util/enum';
import './OrgModal.less';

const OrgModal = ({ show, onCancel, onConfirm }: any) => {

    /** 选择纬度 */
    const [ type, setType ] = useState( 0 );

    /** 自定义账号 */
    const [ customAccount, setCustomAccount ] = useState('');

    /** 所点击的组织架构id */
    const [ orgId, setOrgId ] = useState('');

    /** 所选择的组织架构列表 */
    const [ orgArr, setOrgArr ] = useState([ ]); 

    /** 查询选项 */
    const [ filter, setFilter ] = useState({ name: '', account: '' });

    /** 选项（用户域账号） */
    const [ accounts, setAccounts ] = useState([ ]);

    /** 选项（用户数据） */
    const [ users, setUsers ] = useState([ ]);

    /** 搜索 */
    const searchRef = useRef( null );

    /** 列表 */
    const usersRef = useRef( null );

    /** 树 */
    const treeRef = useRef( null );

    /** 确认 */
    const confirm = ( ) => {
        if ( !!onConfirm ) {
            if ( type === ERoleUserType.user ) {
                onConfirm({
                    type: ERoleUserType.user,
                    value: accounts,
                    detail: users
                })
            } else if ( type === ERoleUserType.org ) {
                onConfirm({
                    type: ERoleUserType.org,
                    detail: orgArr,
                    value: orgArr.map(( x: any ) => x.orgId )
                })
            } else if ( type === ERoleUserType.custom ) {
                onConfirm({
                    type: ERoleUserType.custom,
                    detail: { },
                    value: [ customAccount ]
                })
            }
        }

        setType( 0 );
        setOrgId('');
        setUsers([ ]);
        setOrgArr([ ]);
        setAccounts([ ]);
        setCustomAccount('');
        setFilter({
            name: '',
            account: ''
        });

        try {
            (treeRef as any).current.reset( );
            (searchRef as any).current.reset( );
            (usersRef as any).current.reset( );
        } catch ( e ) { }
    };

    /** 选择了用户 */
    const onSelect = ( ids: any, rows: any ) => {
        setUsers( rows );
        setAccounts( ids );
    }

    return (
        <div>
            <Modal 
                width={ 1000 }
                visible={ show }
                onOk={ confirm }
                title="选择用户/组织"
                className="c-org-modal"
                onCancel={( ) => !!onCancel && onCancel( )}
            >
                <div 
                    className="type-selector"
                >
                    选择纬度：<Radio.Group 
                        value={ type }
                        onChange={ e => setType( e.target.value )} 
                    >
                        <Radio value={ ERoleUserType.user }>
                            用户
                        </Radio>
                        <Radio value={ ERoleUserType.org }>
                            组织
                        </Radio>
                        <Radio value={ ERoleUserType.custom }>
                            自定义
                        </Radio>
                    </Radio.Group>
                </div>
                <Layout
                    className="layout-con"
                    style={{ justifyContent: type === ERoleUserType.org ? 'center' : 'start' }}
                >
                    {/* 自定义 */}
                    {
                        type === ERoleUserType.custom && (
                            <div>
                                <Input 
                                    value={ customAccount }
                                    placeholder="请输入账号"
                                    onChange={( e: any ) => setCustomAccount( e.target.value )}
                                />
                            </div>
                        )
                    }

                    {/* 组织架构树 */}
                    {
                        ( type === ERoleUserType.user || type === ERoleUserType.org ) && (
                            <div 
                                className="tree-con"
                                style={{ maxWidth: type === ERoleUserType.org ? 'none' : '200px' }}
                            >
                                <OrgTree
                                    ref={ treeRef }
                                    canSelect={ type === ERoleUserType.org }
                                    onTreeChoice={ setOrgId }
                                    onTreeSlect={ setOrgArr }
                                />
                            </div>
                        )
                    }

                    {/* 用户列表 */}
                    {
                        type === ERoleUserType.user && (
                            <div 
                                className="table-con"
                            >
                                <OrgSearch
                                    ref={ searchRef }
                                    initValue={ filter }
                                    onFilterChange={ setFilter }
                                />
                                <div
                                    className="table"
                                >
                                    <OrgUsers
                                        ref={ usersRef }
                                        { ...filter }
                                        orgId={ orgId }
                                        onSelect={ onSelect }
                                    />
                                </div>
                            </div>
                        )
                    }
                </Layout>
            </Modal>
        </div>
    );
};

export default React.memo( OrgModal );
