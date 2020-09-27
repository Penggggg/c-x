import { RouteComponentProps } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { Table, Modal, Input, Card, Tag, Tooltip, Select, Button } from 'antd';

import { http } from '../../util/http';
import { useList } from '../../hooks/useList';
import { parseQuery } from '../../util/query';
import { createColumns } from '../../util/antdTableColumns';
import './index.less';

type TAppPageConfigProps = {
    router: RouteComponentProps
}

type TBtn = {
    btn_id?: string,
    page_id?: string,
    name?: string,
    code?: string,
    remark?: null
}

type TPageModule = {
    page_module_id?: string, 
    name?: string, 
    code?: string
}

type TPage = {
    page_id?: string,
    page_module_id?: string,
    name?: string,
    code?: string,
    remark?: string,
    btns?: TBtn[ ]
}

export const AppPageConfig = ( props: TAppPageConfigProps ) => {

    /** 模块 */
    const [ menuList, menuList$ ] = useList< TPageModule >({
        listUrl: '/apis/app/page-module',
    });

    /** 页面 */
    const [ pageList, pageList$ ] = useList< TPage >({
        listUrl: '/apis/app/page',
    });

    /** 页面参数 */
    const [ pageQuery, pageQuery$ ] = useState({ });

    /** 模块 - 编辑框 */
    const [ editMenuModal,  editMenuModal$ ] = useState( false );

    /** 模块 - 当前编辑 */
    const [ editingMenu, editingMenu$ ] = useState< TPageModule >({ });

    /** 页面 - 编辑框 */
    const [ editPageModal,  editPageModal$ ] = useState( false );

    /** 页面 - 当前编辑 */
    const [ editingPage, editingPage$ ] = useState< TPage >({ });

    /** 按钮 - 编辑框 */
    const [ editBtnModal,  editBtnModal$ ] = useState( false );

    /** 按钮 - 当前编辑 */
    const [ editingBtn, editingBtn$ ] = useState< TBtn >({ });

     /** 按钮 - 预备添加 */
     const [ creatingBtnPageId,  creatingBtnPageId$ ] = useState('');

    /** 模块 - 删除 */
    const onDeleteMenu = ( item: TPageModule ) => {
        const { page_module_id } = item;
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.delete({
                    params: { page_module_id },
                    url: `/apis/app/page-module`
                }).then( res => {
                    if ( res.status !== 200 ) { return; }
                    editingMenu$({ });
                    fetchMenu( );
                })
            }
        })
    };

    /** 模块 - 编辑 */
    const onEdieMenu = ( item: TPageModule ) => {
        editingMenu$( item );
        editMenuModal$( true )
    };

    /** 页面 - 删除 */
    const onDeletePage = ( item: TPage ) => {
        const { page_id } = item;
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.delete({
                    params: { page_id },
                    url: `/apis/app/page`
                }).then( res => {
                    if ( res.status !== 200 ) { return; }
                    editingPage$({ });
                    fetchPage( );
                })
            }
        })
    };

    /** 按钮 - 删除 */
    const onDeleteBtn = ( item: TBtn ) => {
        const { btn_id } = item;
        Modal.confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk: ( ) => {
                http.delete({
                    params: { btn_id },
                    url: `/apis/app/btn`
                }).then( res => {
                    if ( res.status !== 200 ) { return; }
                    fetchPage( );
                })
            }
        })
    }

    /** 页面 - 编辑 */
    const onEditPage = ( item: TPage ) => {
        editingPage$( item );
        editPageModal$( true )
    };

    /** 按钮 - 编辑 */
    const onEditBtn = ( item: TBtn ) => {
        editingBtn$( item );
        editBtnModal$( true )
    }

    /** 按钮 - 创建 */
    const onCreateBtn = ( page_id: any ) => {
        creatingBtnPageId$( page_id );
        editBtnModal$( true );
    }

    /** 模块 - 编辑或者创建 */
    const addOrEditMenu = ( ) => {
        const { page_module_id } = editingMenu;

        let data: any = editingMenu;
        if ( !page_module_id ) {
            data = {
                ...data,
                ...pageQuery
            }
        }

        http[ !!page_module_id ? 'put' : 'post' ]({
            data,
            url: `/apis/app/page-module`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            editingMenu$({ });
            editMenuModal$( false );
            fetchMenu( );
        })
    }

    /** 页面 - 编辑或者创建 */
    const addOrEditPage = ( ) => {
        const { page_id } = editingPage;

        let data: any = editingPage;
        if ( !page_id ) {
            data = {
                ...data,
                ...pageQuery
            }
        }

        http[ !!page_id ? 'put' : 'post' ]({
            data,
            url: `/apis/app/page`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            editingPage$({ });
            editPageModal$( false );
            fetchPage( );
        })
    }

     /** 按钮 - 编辑或者创建 */
    const addOrEditBtn = ( ) => {
        const { btn_id } = editingBtn;

        let data: any = editingBtn;
        if ( !btn_id ) {
            data = {
                ...data,
                page_id: creatingBtnPageId
            }
        }

        http[ !!btn_id ? 'put' : 'post' ]({
            data,
            url: `/apis/app/btn`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            editingBtn$({ });
            editBtnModal$( false );
            fetchPage( );
        })
    }

    /** 模块 - 关闭弹窗 */
    const closeMenuModal = ( ) => {
        editingMenu$({ });
        editMenuModal$( false );
    }

    /** 页面 - 关闭弹窗 */
    const closePageModal = ( ) => {
        editingPage$({ });
        editPageModal$( false );
    }

    /** 按钮 - 关闭弹窗 */
    const closeBtnModal = ( ) => {
        editingBtn$({ });
        editBtnModal$( false );
    }

    /** 模块 - 拉取 */
    const fetchMenu = ( ) => {
        const { search } = props.router.location;
        menuList$.load(`${search}`);
    }

    /** 页面 - 拉取 */
    const fetchPage = ( ) => {
        const { search } = props.router.location;
        pageList$.load(`${search}`);
    }

    /** 模块 - 列表 */
    const menuTable = useMemo(
        ( ) => createColumns( menuList, menuList[ 0 ], { 
                name: {
                    title: '模块名称',
                    fixed: 'left',
                    render: ( pageModuleItem: any ) => (
                        <a>{ pageModuleItem.name }</a>
                    )
                },
                code: '模块编码'
            }, {
                edit: onEdieMenu,
                delete: onDeleteMenu
            }),
        [ menuList ]
    );

    /** 页面 - 列表 */
    const pageTable = useMemo(
        ( ) => createColumns( pageList, pageList[ 0 ], { 
            name: {
                title: '页面名称',
                fixed: 'left',
                render: ( pageItem: any ) => (
                    <a>{ pageItem.name }</a>
                )
            },
            code: '页面编码',
            page_module_id: {
                title: '所属模块',
                render: ( record: TPage ) => {
                    const target = menuList.find( x => x.page_module_id === record.page_module_id );
                    return !!target ? target.name : ''
                }
            },
            btns: {
                title: '页面按钮',
                render: ( pageItem: TPage ) => (
                    <span>
                        {
                            ( pageItem.btns || [ ]).map(( btn: TBtn,  k: number ) => (
                                <Tooltip 
                                    key={ k }
                                    placement="top"
                                    title={`编码：${btn.code}`}
                                >
                                    <div
                                        onClick={( e: any )=> onEditBtn( btn )}
                                        style={{ marginRight: 5, display: 'inline-block' }}
                                    >
                                        <Tag 
                                            closable
                                            color="blue"
                                            onClose={( e: any ) => { e.preventDefault(); onDeleteBtn( btn )}}
                                        >
                                            { btn.name }
                                        </Tag>
                                    </div>
                                </Tooltip>
                            ))
                        }
                        <Button 
                            icon="plus" 
                            type="dashed" 
                            size="small"
                            onClick={ e => onCreateBtn( pageItem.page_id )}
                        />
                    </span>
                ),
            }
        }, {
            edit: onEditPage,
            delete: onDeletePage
        }),
        [ pageList, menuList ]
    );

    /** didMount */
    useEffect(( ) => {
        fetchMenu( );
        fetchPage( );
        const { search } = props.router.location;
        pageQuery$( parseQuery( search ))
    }, [ ]);

    return (
        <div className="con-app-page-config">

            {/* 模块 */}
            <Card 
                title="页面模块"
                extra={<a onClick={( ) => editMenuModal$( true )}>创建</a>}
            >
                <Table 
                    { ...menuTable }
                    pagination={ false }
                />
            </Card>
            
            {/* 页面 */}
            <Card 
                title="页面列表"
                style={{ marginTop: 50 }}
                extra={<a onClick={( ) => editPageModal$( true )}>创建</a>}
            >
                <Table 
                    { ...pageTable }
                    pagination={ false }
                />
            </Card>

            {/* 模块编辑 */}
            <Modal
                title="模块 - 编辑"
                className="editing-menu"
                visible={ editMenuModal }
                onOk={ addOrEditMenu }
                onCancel={ e => closeMenuModal( )}
            >
                {
                    [
                        { label: '名称', key: 'name' },
                        { label: '编码', key: 'code' }
                    ].map(( editingLine, key ) => (
                        <label
                            key={ key }
                            className="editing-line"
                        >
                            <span className="editing-label">{ editingLine.label }: </span>
                            <Input 
                                value={( editingMenu as any )[ editingLine.key ]}
                                onChange={ e => editingMenu$({
                                    ...editingMenu,
                                    [ editingLine.key ]: e.target.value
                                })}
                            />
                        </label>
                    ))
                }
            </Modal>

            {/* 页面编辑 */}
            <Modal
                title="模块 - 编辑"
                className="editing-menu"
                visible={ editPageModal }
                onOk={ addOrEditPage }
                onCancel={ e => closePageModal( )}
            >
                {
                    [
                        { label: '名称', key: 'name' },
                        { label: '编码', key: 'code' },
                        { label: '所属模块', key: 'page_module_id', type: 'select' }
                    ].map(( editingLine, key ) => (
                        <label
                            key={ key }
                            className="editing-line"
                        >
                            <span className="editing-label">{ editingLine.label }: </span>
                            {
                                (!editingLine.type || editingLine.type === 'input') && (
                                    <Input 
                                        value={( editingPage as any )[ editingLine.key ]}
                                        onChange={ e => editingPage$({
                                            ...editingPage,
                                            [ editingLine.key ]: e.target.value
                                        })}
                                    />
                                )
                            }
                            {
                                (editingLine.type === 'select') && (
                                    <Select
                                        style={{ width: 250 }}
                                        value={( editingPage as any )[ editingLine.key ] || ''}
                                        onChange={( v: string ) => editingPage$({
                                            ...editingPage,
                                            [ editingLine.key ]: v
                                        })}
                                    >
                                        {
                                            menuList.map(( menu, k: number ) => (
                                                <Select.Option
                                                    key={ k }
                                                    value={ menu.page_module_id }
                                                >
                                                    { menu.name }
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </label>
                    ))
                }
            </Modal>

            {/* 按钮编辑 */}
            <Modal
                title="按钮 - 编辑"
                className="editing-menu"
                visible={ editBtnModal }
                onOk={ addOrEditBtn }
                onCancel={ e => closeBtnModal( )}
            >
                {
                    [
                        { label: '名称', key: 'name' },
                        { label: '编码', key: 'code' }
                    ].map(( editingLine, key ) => (
                        <label
                            key={ key }
                            className="editing-line"
                        >
                            <span className="editing-label">{ editingLine.label }: </span>
                            <Input 
                                value={( editingBtn as any )[ editingLine.key ]}
                                onChange={ e => editingBtn$({
                                    ...editingBtn,
                                    [ editingLine.key ]: e.target.value
                                })}
                            />
                        </label>
                    ))
                }
            </Modal>

        </div>
    )
}