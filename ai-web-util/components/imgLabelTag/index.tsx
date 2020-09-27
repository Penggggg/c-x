import { Alert, Button, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { ImgPreview, MyForm } from '../index';
import { CheckboxTags } from '../checkbox-tags';
import './index.less';

const CreateLabel = MyForm('your-form-name');

/**
 * @description
 * 图片标注里面的，标签标注
 */
export const ImgLabelTag = ({ src, height, tags, type, canAction, defaultSelected, onCreate, onSave, onDelete, onUpdate }: TComImgLabelTag ) => {

    const conRef: any = useRef( null );
    const formRef: any = useRef( null );

    /** 计算图片宽度 */
    const [ imgWidth, imgWidth$ ] = useState( 0 );

    /** 创建框 */
    const [ createModal, createModal$ ] = useState( false );

    /** 当前选择的标签 */
    const [ selectedTagIds, selectedTagIds$ ] = useState< string[ ]>([ ]);

    /** 设置图片宽度 */
    const setImgWidth = ( ) => {
        try {
            const { offsetWidth } = conRef.current;
            imgWidth$( offsetWidth );
        } catch ( e ) { }
    }

    /** 取消弹框 */
    const cancelModal = ( ) => {
        const form = formRef.current;
        form.resetFields( );
        createModal$( false )
    }

    /** 添加标签 */
    const onCreateLabel = ( ) => {
        const form = formRef.current;
        form.validateFields(( err: any, values: any ) => {
            const { name } = values;
            if ( !!err ) { return; }

            !!onCreate && onCreate( name );
            form.resetFields( );
            createModal$( false );
        })
    }

    /** 标签选择 */
    const onLabelChange = ( tagIds: string[ ]) => {
        selectedTagIds$( tagIds );
    }

    /** 保存当前的标签选择 */
    const onSaveAction = ( ) => {
        const selectedTags = tags
            .filter( t => selectedTagIds.includes( t.id ))
        !!onSave && onSave( selectedTags )
    }

    /** didMount，设置图片 */
    useEffect(( ) => {
        setTimeout( setImgWidth, 100 );
        window.addEventListener('resize', setImgWidth );
    }, [ ]);

    return (
        <div 
            style={{ height }}
            className="com-img-label-tag"
        >
            {/* 预览的图片 */}
            <div
                ref={ conRef }
                className="preview-block"
            >
                <ImgPreview 
                    src={ src }
                    height={ height }
                    width={ imgWidth }
                    background='#fafafa'
                />
            </div>

            {/* 操作区 */}
            <div className="action-block">
                
                {/* 提示 */}
                <Alert 
                    showIcon 
                    type="info" 
                    message={ !canAction ? '暂无权限操作' : '请选择标签' }
                />

                {/* 标签框 */}
                <div className="tags-block">

                    {/* 创建按钮 */}
                    {
                        ( canAction && onCreate ) && (
                            <Button 
                                block
                                icon="plus"
                                style={{ marginTop: 15 }}
                                onClick={( ) => createModal$( true )}
                            >
                                标签
                            </Button>
                        )
                    }
                    
                    {/* 标签列表 */}
                    <CheckboxTags 
                        block
                        type={ type }
                        tags={ tags }
                        onChange={ onLabelChange }
                        defaultSelected={ defaultSelected }
                        onDelete={ canAction ? onDelete : undefined }
                        onUpdate={ canAction ? onUpdate : undefined }
                    />

                    <div 
                        className="tags-block-con"
                        style={{ pointerEvents: canAction ? 'none' : 'auto' }}
                    >
                    </div>
                </div>

                {/* 操作框 */}
                <div style={{ marginTop: 15 }}>
                    {
                        canAction && (
                            <Button 
                                block
                                ghost
                                type="primary" 
                                onClick={ onSaveAction }
                            >
                                保存
                            </Button>
                        )
                    }
                </div>

            </div>

            {/* 添加标签 */}
            <Modal
                title="创建标签"
                visible={ createModal }
                onCancel={ cancelModal }
                onOk={ onCreateLabel }
            >
                <CreateLabel
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
};

type TLabelTag = {
    id: string
    name: string
    [ key: string ]: any
}

type TComImgLabelTag = {
    src: string,
    height: number,
    canAction: boolean
    tags: TLabelTag[ ]
    type: 'single' | 'multipul'
    defaultSelected?: string[ ]

    onCreate?: ( name: string ) => void
    onDelete?: ( tag: TLabelTag ) => void
    onUpdate?: ( tag: TLabelTag ) => void
    onSave?: ( selectedTags: TLabelTag[ ]) => void
}