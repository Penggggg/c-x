import { Button, Popover, Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { MyForm } from '../my-form';

const CheckableTag = ({ checked, children, block, onChange, onDelete, onUpdate }: TComCheckableTag ) => {

    /** pop */
    const shouldPopover = ( item: any ) => {
        return !!onDelete || !!onUpdate ?
            <Popover 
                placement="right"
                content={(
                    <div>
                        {
                            !!onDelete && (
                                <Button 
                                    ghost
                                    size="small"
                                    type="danger"
                                    onClick={( e: any ) => { e.stopPropagation; onDelete( )}}
                                >
                                    删除
                                </Button>
                            )
                        }
                        {
                            !!onUpdate && (
                                <Button 
                                    ghost
                                    size="small"
                                    type="primary"
                                    style={{ marginLeft: 10 }}
                                    onClick={( e: any ) => { e.stopPropagation; onUpdate( )}}
                                >
                                    更新
                                </Button>
                            )
                        }
                    </div>
                )}
            >
                { item }
            </Popover> :
            item
    }

    return (
        shouldPopover( 
            <Button
                block={ block }
                type={ checked ? 'primary' : 'dashed' }
                onClick={( ) => !!onChange && onChange( !checked )}
                style={{ marginTop: block ? 15: 10, marginRight: block ? 0 : 15 }}
            >
                { children }
            </Button>
        )
    )
}

const UpdateTagForm = MyForm('update-tag-form');
export const CheckboxTags = ({ defaultSelected, tags, block, type, onChange, onDelete, onUpdate }: TComChexkboxTag ) => {

    const formRef: any = useRef( null );

    /** 已选择tag( id ) */
    const [ selecteds, selecteds$ ] = useState< string[ ]>([ ]);

    /** 正在编辑中的tag */
    const [ editingTag, editingTag$ ] = useState< any >( null );

    /** 编辑框 */
    const [ updateModal, updateModal$ ] = useState< boolean >( false );

    /** 设置已选择tag( id ) */
    const onsetSelected = ( tagids: string[ ]) => {
        selecteds$( tagids );
        !!onChange && onChange( tagids );
    }

    /** 设置check */
    const onTagCheck = ( isCheck: boolean, tagId: string ) => {
        // 单选
        if ( type === 'single' ) {
            onsetSelected( !!isCheck ? [ tagId ] : [ ]);
        
        // 多选
        } else if ( type === 'multipul' ) {
            if ( !!isCheck ) {
                onsetSelected([ ...selecteds, tagId ]);
            } else {
                const tagIndex = selecteds.findIndex( x => x === tagId );
                if ( tagIndex !== -1 ) {
                    selecteds.splice( tagIndex, 1 )
                }
                onsetSelected([ ...selecteds ]);
            }
        }
    }

    /** 更新标签 */
    const onUpdateTag = ( ) => {
        const form = formRef.current;
        form.validateFields(( err: any, values: any ) => {
            const { name } = values;
            if ( !!err ) { return; }

            form.resetFields( );
            updateModal$( false );
            !!onUpdate && onUpdate({
                ...editingTag,
                name
            })
        })
    }

    /** 取消弹框 */
    const cancelModal = ( ) => {
        const form = formRef.current;
        form.resetFields( );
        updateModal$( false )
    }

    /** 打开弹框 */
    const openModal = ( tag: TChexkboxTag ) => {

        editingTag$( tag );
        updateModal$( true );

        setTimeout(( ) => {
            const form = formRef.current;
            form.setFieldsValue({
                name: tag.name
            });
        }, 100 );
    }

    /** didMount 初始化选中的值 */
    useEffect(( ) => {
        // 单选
        if ( type === 'single' ) {
            const first = ( defaultSelected || [ ]).filter( x => !!x )[ 0 ];
            onsetSelected( !!first ? [ first ] : [ ]);

        // 多选
        } else if ( type === 'multipul' ) {
            onsetSelected(( defaultSelected || [ ]))
        }
    }, [ defaultSelected ]);

    return (
        <div>
            {
                tags.map(( t, k ) => (
                    <CheckableTag 
                        key={ k }
                        block={ block }
                        onChange={( e: any ) => onTagCheck( e, t.id )}
                        checked={ !!selecteds.find( x => x === t.id )}
                        onDelete={ !!onDelete ? ( ) => onDelete( t ) : undefined }
                        onUpdate={ !!onUpdate ? ( ) => openModal( t ) : undefined }
                    >
                        { t.name }
                    </CheckableTag>
                ))
            }
            {/* 添加标签 */}
            <Modal
                title="创建标签"
                visible={ updateModal }
                onCancel={ cancelModal }
                onOk={ onUpdateTag }
            >
                <UpdateTagForm
                    ref={ formRef }
                    formItems={[
                        {
                            key: 'name',
                            label: '标签名称',
                            type: 'input',
                            placeholder: '请填写标签名称',  
                            rules: [ 
                                { required: true, message: '请填写标签名称' } 
                            ]
                        }
                    ]}
                />
            </Modal>
        </div>
    )
}


type TComChexkboxTag = {
    tags: TChexkboxTag[ ]
    type: 'single' | 'multipul'
    block?: boolean
    defaultSelected?: string[ ]
    onChange?: ( selecteds: string[ ]) => void,
    onDelete?: ( tag: TChexkboxTag ) => void,
    onUpdate?: ( tag: TChexkboxTag ) => void,
}

type TComCheckableTag = {
    checked: boolean,
    block?: boolean
    children?: any
    onDelete?: any
    onUpdate?: any
    onChange?: ( checked: boolean ) => void
}

type TChexkboxTag = {
    id: string
    name: string
    [ key: string ]: any
}