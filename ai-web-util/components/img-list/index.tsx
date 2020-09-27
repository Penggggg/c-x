import { Icon, Tooltip } from 'antd';
import React, { useState } from 'react';
import { ImgPreview } from '../img-preview';
import './index.less'

export const Imglist = ({ list, imgWdith, imgHeight, showNext, showPre, defaultImg = '', toolTips = [], value, onSelect, onPageChange }: TCImglist ) => {

    /** 选中图片的下标 */
    const [ current, current$ ] = useState< any >( null );

    /** 点击选择图片 */
    const onClick = ( imgUrl: string, k: number ) => {
        !!onSelect && onSelect( 
            imgUrl, 
            k , 
            !!value ? 
                ( ) => { } : 
                ( ) => current$( k )
        );
    }

    /** 上一页、下一页 */
    const onPage = ( type: 'pre' | 'next' ) => {
        !!onPageChange && onPageChange( type, ( ) => {
            current$( null );
            // !!onSelect && onSelect( '', -1, ( ) => { });
        })
    }

    return (
        <div className="com-img-list">

            {/* 上一页按钮 */}
            {
                showPre && (
                    <div 
                        className="page-btn"
                        onClick={( ) => onPage('pre')}
                    >
                    <Tooltip
                        title='上一页'
                    >
                        <Icon 
                            type="double-left" 
                            style={{ fontSize: 16 }}
                        />
                    </Tooltip>
                </div>
                )
            }
    
            {/* 图片列表 */}
            <div
                className="con-img"
            >
                {
                    list.map(( l, k ) => (
                        <Tooltip 
                            key={ k }
                            title={ !!defaultImg ? toolTips[ k ] || l : '' }
                        >
                            <div
                                key={ k }
                                onClick={( ) => onClick( l, k )}
                                style={{ height: imgHeight + 6 }}
                                className={`img-con ${ !value && k === current ? 'selected' : ''} ${ !!value && l === value ? 'selected' : ''}`}
                            >
                                <ImgPreview 
                                    width={ imgWdith }
                                    height={ imgHeight }
                                    background="#f5f5f5"
                                    src={ defaultImg || l }
                                />
                                {
                                    !!( toolTips[ k ] || l ) && (
                                        <div className='cover-bg'>
                                            <div className="cover-text">
                                                {( toolTips[ k ] || l )[ 0 ]}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </Tooltip>
                    ))
                }
            </div>

            {/* 下一页按钮 */}
            {
                showNext && (
                    <div 
                        className="page-btn"
                        onClick={( ) => onPage('next')}
                    >
                        <Tooltip
                            title='下一页'
                        >
                            <Icon 
                                type="double-right" 
                                style={{ fontSize: 16 }}
                            />
                        </Tooltip>
                    </div>
                )
            }

        </div>
    )
}

type TCImglist = {
    list: string[ ]
    imgWdith: number
    imgHeight: number

    /** 提示 */
    toolTips?: string[]
    
    /** 当前选中图片的url */
    value?: string

    /** 展示按钮 */
    showPre?: boolean
    showNext?: boolean

    /** 展示默认的图片 */
    defaultImg?: string
    /** 封面文字 */
    coverTextFunc?: ( s: string) => string

    onSelect?: ( imgUrl: string, index: number, cb: ( ) => void ) => void
    onPageChange?: ( type: 'pre' | 'next', cb: ( ) => void ) => void
}