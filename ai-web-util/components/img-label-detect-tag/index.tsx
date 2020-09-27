import { Alert, Button, Modal } from 'antd';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { MyForm, CheckboxTags, ImgDraw } from '../index';
import './index.less';

const CreateLabel = MyForm('img-label-detect-tag');

/**
 * @description
 * 图片标注里面的，图片检查标签标注
 */
export const ImgLabelDetectTag = ({ src, height, tags, type, defaultValues = [ ],canAction = true, onCreate, onSave, onDelete, onUpdate }: TComImgLabelDetectTag ) => {

    const conRef: any = useRef( null );
    const formRef: any = useRef( null );

    /** 当前所有的框 */
    const allKuangsRef = useRef< any >([ ]);

    /** 是否进行操作过 */
    const [ hasBeenAction, hasBeenAction$ ] = useState( false );

    /** 操作的队列 */
    const [ actions, actions$ ] = useState< any >([ ]);

    /** 不同框框 对labels的映射 */
    const [ kuang2Labels, kuang2Labels$ ] = useState<{[ key: string ]: string [ ]}>({ });

    /** 不同框框 对labels的映射 */
    const [ id2Labels, id2Labels$ ] = useState<{[ key: string ]: string [ ]}>({ });

    /** 当前选中的框 */
    const [ selectingKuang, selectingKuang$ ] = useState< any >( null );

    /** 创建框 */
    const [ createModal, createModal$ ] = useState( false );

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

        let lastId2Labels = { ...id2Labels };
        let lastKuang2Labels = { ...kuang2Labels };

        if ( !selectingKuang ) { return; }

        lastKuang2Labels = {
            ...lastKuang2Labels,
            [ selectingKuang.key ]: tagIds
        }

        if ( selectingKuang.id !== undefined ) {
            lastId2Labels = {
                ...lastId2Labels,
                [ selectingKuang.id ]: tagIds
            }
        }

        id2Labels$( lastId2Labels );
        kuang2Labels$( lastKuang2Labels );
    }

    /** 保存当前的标签选择 */
    const onSaveAction = ( ) => {
        const allKuangs = allKuangsRef.current;
        let result = allKuangs.map(( kuang: any ) => {
            const { key } = kuang;
            let meta = {
                ...kuang,
                labels: kuang2Labels[ key ]
            };
            delete meta.key;
            return meta
        })

        // 检测一下默认值
        if ( !hasBeenAction ) {
            result = defaultValues.map( d => {
                const { x, y, w, h, id, labels } = d;
                return {
                    id,
                    labels: id2Labels[ id ] || labels,
                    abs: {
                        x, y, w, h
                    }
                }
            });
        }

        !!onSave && onSave( result );
    }

    /** 框数量变化、框选中、标签选中（手动调用） */
    const onChangeKuang = ( kuangArr: any ) => {

        let lastkuang2Labels = { ...kuang2Labels }; 

        // 初始化 标签的选中值
        kuangArr.map(( kuang: any ) => {

            // 每个元素都有独立的key，如果有id，则是通过传进去的，否则是新建的
            const { id, key } = kuang;

            // 从默认值提取
            if ( !!id && kuang2Labels[ key ] === undefined ) {
                const targetKuang = (defaultValues || [ ]).find( x => x.id === id );
                lastkuang2Labels = {
                    ...lastkuang2Labels,
                    [ key ]: !!targetKuang ? targetKuang.labels : [ ]
                }
            // 新建的框
            } else if ( !id ) {
                lastkuang2Labels = {
                    ...lastkuang2Labels,
                    [ key ]: lastkuang2Labels[ key ] || [ ]
                }
            }
        });

        // 在这个src下的操作值
        const srcActions = kuangArr.map(( kuang: any ) => {
            const { id, abs, color, key } = kuang;
            const { x, y, w, h } = abs;
            return { id, x, y, w, h, color, key };
        })

        hasBeenAction$( true )
        actions$( srcActions );
        kuang2Labels$( lastkuang2Labels );
        
        allKuangsRef.current = kuangArr;
    }

    /** 选中框对应的label */
    const defaultSelected$ = useMemo(( ) => {

        if ( !selectingKuang ) { return [ ];}

        const { id } = selectingKuang;
        const target = defaultValues.find( x => x.id === id );
        
        /** 如果操作过 */
        if ( hasBeenAction ) {
            return kuang2Labels[ selectingKuang.key ] || [ ];
        } else {
            return !!target ? 
                target.labels :
                [ ]
        }
    }, [ selectingKuang ])

    /** 
     * 切换src
     */
    useEffect(( ) => {
        actions$([ ]);
        id2Labels$({ });
        kuang2Labels$({ })
        selectingKuang$( null );
        hasBeenAction$( false );
    }, [ src ]);

    return (
        <div 
            className="com-img-label-detect-tag"
        >
            {/* 预览的图片 */}
            <div
                ref={ conRef }
                className="preview-block"
            >
                <ImgDraw 
                    url={ src }
                    height={ height }
                    onChangeKuang={ onChangeKuang }
                    onSelectKuang={ e => selectingKuang$( e )}
                    defaultKuangArr={ hasBeenAction ? actions : defaultValues }
                />
            </div>

            {/* 操作区 */}
            <div className="tags-action-block">
                
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
                        defaultSelected={ defaultSelected$ }
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

type TDefaultValues = {
    id: any,
    x: number,
    y: number,
    w: number,
    h: number,
    labels: string[ ]
}

type TComImgLabelDetectTag = {
    src: string,
    height: number,
    tags: TLabelTag[ ]
    canAction?: boolean
    type: 'single' | 'multipul'
    defaultValues?: TDefaultValues[ ]

    onCreate?: ( name: string ) => void
    onDelete?: ( tag: TLabelTag ) => void
    onUpdate?: ( tag: TLabelTag ) => void
    onSave?: ( selectedTags: TLabelTag[ ]) => void
}