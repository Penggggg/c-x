import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MouseContainer, MyForm } from '../index';
import { Alert, Popover, Icon, Button, Tag, Tooltip, Modal } from 'antd';
import './index.less';

const UpdateTagForm = MyForm('TextLabelTag-tag-form');
export const TextLabelTag = ({ params, tags, canAction = true, defaultValue = [ ], onDelete, onUpdate, onCreate, onSure }: TextLabelTag ) => {

    /** 标签的颜色 */
    const colorsOpts = [
        {
        bg: '#40a9ff',
        text: '#fff'
        }, {
            bg: '#ffc53d',
            text: '#fff'
        }, {
            bg: '#595959',
            text: '#fff'
        }, {
            bg: '#36cfc9',
            text: '#fff'
        }, {
            bg: '#ff4d4f',
            text: '#fff'
        }, {
            bg: '#9254de',
            text: '#fff'
        }
    ];

    /** keycode to number */
    const keycode2Num: {
        [ key: number ]: number
    } = {
        48: 0,
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9
    };

    const formRef: any = useRef( null );

    /** 上一个props-tags */
    const tagsRef = useRef<TextTag[ ]>([ ]);

    /** 上一个props-defaultValues */
    const defaultRef = useRef<( TSelectingText & { tagId: string | number})[ ] >([ ]);

    /** 展示弹框 */
    const [ modal, modal$ ] = useState( false );

    /** 使用提示 */
    const [ showTips, showTips$ ] = useState( true );

    /** 正在编辑的标签 */
    const [ editingTag, editingTag$ ] = useState< TextTag | null >( null );

    /** 当前选中的文字 */
    const [ seletingTxt, seletingTxt$ ] = useState< null | TSelectingText >( null );

    /** 当前的标记 */
    const labeledRef = useRef<{ txt: TSelectingText, tag: TextTag & { keyboard: number }}[ ]>([ ]);
    const [ labeled, labeled$ ] = useState<{ txt: TSelectingText, tag: TextTag & { keyboard: number }}[ ]>([ ]);

    /** pop */
    const shouldPopover = ( item: any, t: TextTag ) => {
        return !!onDelete || !!onUpdate ?
            <Popover 
                key={ t.id }
                placement="right"
                content={(
                    <div>
                        {
                            !!onDelete && (
                                <Button 
                                    ghost
                                    size="small"
                                    type="danger"
                                    onClick={ e => _onDelete( t )}
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
                                    onClick={ e => openModal( t )}
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

    /** 获取当前选中 */
    const getSelect = ( result: any, paramKey: number ) => {
        if ( !result ) { return seletingTxt$( null );}
        const { baseOffset, txt } = result;
        seletingTxt$({
            paramKey,
            offset: baseOffset,
            length: txt.length,
        });
    }

    /** 点击键盘 */
    const onKeyDownCode = ( code: number ) => {

        const num = keycode2Num[ code ];
        const tag = tags$.find( x => x.keyboard === num );

        if ( num === undefined || !seletingTxt || !tag || !canAction ) { return; }

        /** 判断有没有重复 */
        const Index = labeled.findIndex( x => x.txt === seletingTxt );

        if ( Index === -1 ) {
            setLabel([
                ...labeled,
                {
                    tag,
                    txt: seletingTxt
                }
            ]);
        } else {
            const temp = [ ...labeled ];
            temp.splice( Index, 1, {
                tag,
                txt: seletingTxt
            });
            setLabel( temp );
        }
    }

    /** 回撤标注 */
    const onDeleteLabel = ( paramKey: number, offset: number ) => {
        const temp = [ ...labeled ];
        const Index = temp.findIndex( x => x.txt.paramKey === paramKey && x.txt.offset === offset );
        if ( Index !== -1 ) {
            temp.splice( Index, 1 );
            setLabel( temp )
        }
    }

    /** 删除标签 */
    const _onDelete = ( t: TextTag ) => {
        const { id, val } = t;
        if ( !!onDelete && canAction ) { onDelete({ id, val });}
    }

    /** 打开弹框 */
    const openModal = ( tag: TextTag ) => {

        editingTag$( tag );
        modal$( true );

        setTimeout(( ) => {
            const form = formRef.current;
            form.setFieldsValue({
                val: tag.val
            });
        }, 100 );
    }

    /** 取消弹框 */
    const cancelModal = ( ) => {
        const form = formRef.current;
        form.resetFields( );
        modal$( false )
        editingTag$( null )
    }

    /** 更新/创建 标签 */
    const onUpdateTag = ( ) => {
        const form = formRef.current;
        form.validateFields(( err: any, values: any ) => {
            const { val } = values;
            if ( !!err ) { return; }

            form.resetFields( );
            modal$( false );

            if ( !!editingTag && !!onUpdate ) {
                onUpdate({
                    id: editingTag.id,
                    val
                })
            } else if ( !!onCreate ) {
                onCreate( val );
            }
        })
    }

    /** 确认 */
    const _onSure = ( ) => {
        !!onSure && onSure( labeled.map( l => {
            const { tag, txt } = l;
            return {
                ...txt,
                tagId: tag.id
            }
        }))
    }

    /** 初始化 */
    const init = ( ) => {
        setLabel([ ]);
        editingTag$( null );
        seletingTxt$( null );
        tagsRef.current = [ ];
        defaultRef.current = [ ];
    }

    /** 设置label */
    const setLabel = ( l: any ) => {
        labeled$( l );
        labeledRef.current = l;
    }

    /** 可选标签 */
    const tags$ = useMemo(( ) => {
        return tags.map(( t, k ) => ({
            ...t,
            keyboard: k + 1,
            color: colorsOpts[  k % colorsOpts.length ]
        }));
    }, [ tags ]);

    /** 段落 */
    const params$ = useMemo(( ) => {
        const result = params.map(( p, k ) => {

            const innerResult: {
                type: TextType,
                txt: string,
                detail?: TextTag & { 
                    color: string 
                    offset: number
                    paramKey: number
                }
            }[ ] = [ ];

            /** 指针 */
            let point = 0;
            let endPtr = 0;
            const paramLength = p.length; 

            /** 文字类型 */
            let type: null | TextType = null;
            
            /** 这段里面，已有的标注 */
            const paramLabels = labeled
                .filter( l => l.txt.paramKey === k )
                .sort(( x, y ) => x.txt.offset - y.txt.offset );

            while ( point < paramLength ) {

                /** 下一个最接近的标注 */
                const closeLabel = paramLabels[ 0 ];

                type = type || ( !!paramLabels.find( x => x.txt.offset === point ) ? 'tag' : 'span' );

                /** 普通文字 */
                if ( type === 'span' ) {
                    endPtr = !!closeLabel ? closeLabel.txt.offset : paramLength;

                /** tag */
                } else {
                    endPtr = !!closeLabel ? closeLabel.txt.offset +  closeLabel.txt.length : paramLength;
                    !!closeLabel && paramLabels.splice( 0, 1 );
                }       
                
                const tagOpt = !! closeLabel ? tags$.find( x => x.id === closeLabel.tag.id ) : null;
                
                /** 插入到结果 */
                innerResult.push({
                    type,
                    txt: p.slice( point, endPtr ),
                    detail: type == 'span' ?
                        undefined :
                        {
                            ...closeLabel.tag,
                            color: !!tagOpt ? tagOpt.color.bg : '#bae637',
                            offset: !!closeLabel ? closeLabel.txt.offset : 0,
                            paramKey: !!closeLabel ? closeLabel.txt.paramKey : 0
                        }
                })

                /** 重新指向point、重置tag */
                point = endPtr;
                type = null;                
            }

            return innerResult
        });
        return result;
    }, [ params, labeled ]);

    /** 初始化 */
    useEffect(( ) => {
        init( );
    }, [ params ])

    /** 更改labeled */
    useEffect(( ) => {
        
        const temp = [ ...labeledRef.current ];
        const last = tagsRef.current;
        const type = tags.length === last.length ?
            'equal' :
            tags.length > last.length ?
                'add' : 'del';
        
        if ( type === 'add' ) {
            const appendArr: any = defaultValue
                .filter( dv => !labeledRef.current.find( x => x.tag.id === dv.tagId ))
                .map( d => {
                    const { paramKey, offset, length, tagId } = d;
                    const tag = tags$.find( x => x.id === tagId );
                    return {
                        tag,
                        txt: {
                            paramKey,
                            offset,
                            length
                        }
                    }
                }).filter( x => !!x.tag )

            setLabel([ 
                ...temp,
                ...appendArr
            ]);

        } else if ( type === 'del' ) {
            const delArr = temp
                .filter( l => tags.find( x => x.id === l.tag.id ));
            setLabel( delArr );
        }

        tagsRef.current = tags;

    }, [ tags, defaultValue ]);

    /** didMount */
    useEffect(( ) => {
        setTimeout(( ) => showTips$( false ), 10000 );
    }, [ ]);

    return (
        <Popover
            title="步骤"
            trigger="focus"
            placement="left"
            visible={ showTips }
            content={(
                <div style={{ fontSize: 12 }}>
                    <div>
                        <Icon 
                            style={{ fontSize: 14, marginRight: 5 }}
                            type="swap" 
                        /> 
                        选中单词
                    </div>
                    <div>
                        <Icon 
                            type="vertical-align-bottom" 
                            style={{ fontSize: 14, marginRight: 5 }}
                        /> 
                        按下键盘 <a>标记</a>
                    </div>
                </div>
            )}
        >
            <div className='com-text-label-tag'>
            
                {/* 左边 段落区域 */}
                <div 
                    className="params-block"
                >
                {
                    params$.map(( typeParams, k ) => (
                        <MouseContainer
                            key={ k }
                            className="param"
                            onKeyDownCode={ onKeyDownCode }
                            onTextSelect={ r => getSelect( r, k )}
                        >
                            {
                                typeParams.map(( tp, k ) => {
                                    return tp.type === 'span' ?
                                        <span key={ k }>{ tp.txt }</span> :
                                        <Tooltip 
                                            key={ k }
                                            title={ tp.detail ? tp.detail.val : '' }
                                        >
                                            <Tag 
                                                key={ k }
                                                closable
                                                color={( tp as any ).detail.color }
                                                onClose={( ) => onDeleteLabel(( tp as any ).detail.paramKey, ( tp as any ).detail.offset )}
                                            >
                                                { tp.txt }
                                            </Tag>
                                        </Tooltip>
                                        
                                })
                            }
                        </MouseContainer>
                    ))
                }
                </div>

                {/* 右边 标签 */}
                <div className="action-block">
                    
                    {/* 提示 */}
                    <Alert 
                        showIcon 
                        type="info" 
                        message='请选择标签'
                    />

                    {/* 创建按钮 */}
                    <Button 
                        block
                        icon="plus"
                        style={{ margin: '15px 0' }}
                        onClick={ e => modal$( true )}
                    >
                        标签
                    </Button>

                    {
                        tags$.map(( t, k ) => (
                            shouldPopover(
                                <div 
                                    className='tag-btn'
                                >
                                    <div 
                                        className='text'
                                        style={{ background: t.color.bg, color: t.color.text }}
                                    >
                                        { t.val }
                                    </div>
                                    <div className='tips'>
                                        按{ t.keyboard }
                                    </div>
                                </div>
                            , t )
                        ))
                    }

                    {/* 操作框 */}
                    <div style={{ marginBottom: 15 }}>
                        {
                            canAction && (
                                <Button 
                                    block
                                    ghost
                                    type="primary" 
                                    onClick={ _onSure }
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
                    visible={ modal }
                    onCancel={ cancelModal }
                    onOk={ onUpdateTag }
                >
                    <UpdateTagForm
                        ref={ formRef }
                        formItems={[
                            {
                                key: 'val',
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
        </Popover>
    )
}

/** 组件属性 */
type TextLabelTag = {
    /** 段落 */
    params: string[ ],
    /** 标签 */
    tags: TextTag[ ],
    /** 能否操作 */
    canAction?: boolean,
    /** 默认值 */
    defaultValue?: ( TSelectingText & {
        tagId: string | number
    })[ ] 

    onSure?: ( labels: ( TSelectingText & {
        tagId: string | number
    })[ ]) => void
    onCreate?: ( val: string ) => void
    onDelete?: ( tag: TextTag ) => void,
    onUpdate?: ( tag: TextTag ) => void,
}

type TextTag = {
    val: string
    id: string | number
}

/** 正在选中的文字 */
type TSelectingText = { 
    length: number, 
    /** 偏移量 */
    offset: number, 
    /** 第几段 */
    paramKey: number 
}

/** 段落里面，文字的类型 */
type TextType = 'span' | 'tag'