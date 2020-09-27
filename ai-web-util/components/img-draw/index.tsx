import { Popover, Icon, Tooltip, Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { MouseContainer } from '../mouse-container';
import { ResizeContainer } from '../resize-container';
import './index.less';

let count = 0;

/**
 * @description
 * 
 * 图片画图组件
 * 
 * 1、图片展示/居中
 * 
 * 2、缩放图片（指针滚动）
 * 3、位置拖拽（放大后，用鼠标拖拽）
 * 
 * 4、画正方形框框
 * 5、画圆形框框
 * 6、画线条
 * 
 * 7、操作撤回
 * 8、操作唯一性（只能存在一个框框）
 * 
 * 9、extra跟标签进行配合
 * 
 */
export const ImgDraw = ({ url, height, canZoom = true, canDrag = true, defaultKuangArr = [ ], onSelectKuang, onChangeKuang }: TComImgDraw ) => {

    /** 操作相关配置 */
    const actionConf = {
        /** 放大的最大比例 */
        zoomIn: 4,
        /** 缩小的最大比例 */
        zoomOut: 3,
        /** 缩放delta */
        delta: 0.02,
        /** 拖拽速度( 1 ~ 100 )，越大越慢 */
        dragSlow: 50
    };

    /** 画线框的可选颜色 */
    const penColorOpts: TPenColor[ ] = [
        '#f5222d', // 红
        '#ffec3d', // 黄
        '#52c41a', // 绿
        '#1890ff', // 蓝
        '#949494', // 灰
        '#000', 
        '#fff' 
    ]

    /** 当前的img元素 */
    const imgRef = useRef< any >( null );

    /**  */
    const canvasRef = useRef< any >( null );

    /** 上一个Props传进来的defaultValues */
    const lastDefaultValuesRef = useRef< TDefaultKuang[ ]>([ ]);

    /** 使用提示 */
    const [ showImgTips, showImgTips$ ] = useState( false );

    /** 当前的笔 */
    const [ pen, pen$ ] = useState< TDrawPen | null >( null );

    /** canvas的宽 */
    const canvasWRef = useRef( 0 );
    const [ canvasW, canvasW$ ] = useState( 0 );

    /** 当前图片放大的系数 */
    const zoomRef = useRef( 0 );

    /** 当前描绘图片的canvas参数 */
    const imgParamsRef = useRef([ 0, 0, 0, 0, 0, 0, 0, 0 ]);

    /** 一开始描绘图片的canvas参数 */
    const initImgParamsRef = useRef([ 0, 0, 0, 0, 0, 0, 0, 0 ]);

    /** 图片宽高比例 */
    const imgRateRef = useRef( 1 );

    /** 叠加的图片拖拽位移量 */
    const imgDragTranslateRef = useRef([ 0, 0 ]);

    /** 叠加的图片的缩放位移量 */
    const imgZoomTranslateRef = useRef([ 0, 0 ]);

    /** 鼠标点击的坐标 */
    const mouseDownRef = useRef< number[ ] | null >( null );

    /** 展示 画框颜色选择 */
    const [ kuangOpt, kuangOpt$ ] = useState( false );

    /** 所有的框 */
    const kuangArrRef = useRef< TKuang[ ]>([ ]); 

    /** 正在选中的框 */
    const [ selectingKuang, selectingKuang$ ] = useState< TKuang | null >( null );

    /** 正在生效的动作队列 */
    const [ activeActions, activeActions$ ] = useState< TAction[ ]>([ ]);

    /** 已经撤销过的动作队列 */
    const [ retractActions, retractActions$ ] = useState< TAction[ ]>([ ]);
 
    /** 清空所有操作 */
    const resetAction = ( ) => {

        pen$( null );
        kuangOpt$( false );
        activeActions$([ ]);
        retractActions$([ ]);
        selectingKuang$( null );

        zoomRef.current = 0;
        imgRateRef.current = 1;
        kuangArrRef.current = [ ];
        mouseDownRef.current = null;
        imgDragTranslateRef.current = [ 0, 0 ];
        imgZoomTranslateRef.current = [ 0, 0 ];
        imgParamsRef.current = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        initImgParamsRef.current = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

        setDefaultKuang( );
        reDraw( );
    }

    /** 把数字转换小数点 */
    const fixNum = ( n: number, fixed = 0 ) => Number( n.toFixed( fixed ));

    /** 根据x,y,w,h，把坐标系的顶点换成左上角的 */
    const fixCoordinate = ( x: number, y: number, w: number, h: number ) => {

        /** 鼠标拉伸到➡右下角 */
        if ( w > 0 && h > 0 ) {
            return [ x, y, w, h ];

        /** 鼠标拉伸到右上角 */
        } else if ( w > 0 && h < 0 ) {
            return [ x, y + h, w, -h ];

        /** 鼠标拉伸到左上角 */
        } else if ( w < 0 && h < 0 ) {
            return [ x + w, y + h, -w, -h ];

        /** 鼠标拉伸到左下角 w < 0 && h > 0 */
        } else {
            return [ x + w, y, -w, h ];
        }
    }

    /** 清空画布 */
    const clearCanvas = ( ) => {
        const canvasEle: HTMLCanvasElement = canvasRef.current; 
        const ctx = canvasEle.getContext( '2d' );

        canvasEle.height = height;
        canvasEle.width = canvasWRef.current;

        if ( !ctx ) { return; }

        /** 背景颜色 */
        ctx.fillStyle = '#fafafa';
        ctx.fillRect( 0, 0, canvasWRef.current, height );
    }

    /** 计算图片初始化的参数 */
    const calculateImg = ( ) => {

        let initVal = [ ...initImgParamsRef.current ];
        
        const canvasHeight = height;
        const canvasWidth = canvasWRef.current;
        const targetImg = imgRef.current;

        if ( !targetImg ) { return [ 0, 0, 0, 0, 0, 0, 0, 0 ]}

        /** 图片宽高 */
        const imgWidth = targetImg.width;
        const imgHeight = targetImg.height;

        /** 宽高比例 */
        const imgRate = fixNum( imgWidth / imgHeight, 5 );
        const canvasRate = fixNum( canvasWidth / canvasHeight, 2 );
        imgRateRef.current = imgRate;

        /** 变形后的宽高 */
        const tWidth = canvasHeight * imgRate;
        const tHeight = canvasWidth / imgRate;

        /** 居中 */
        const startY = ( canvasHeight - tHeight ) / 2;
        const startX = ( canvasWidth - tWidth ) / 2;
        
        // 图片比较宽
        if ( imgRate > canvasRate ) {
            initVal = [ 0, 0, imgWidth, imgHeight, 0, startY, canvasWidth, tHeight ].map( x => fixNum( x ));
        // 图片比较窄
        } else {
            initVal = [ 0, 0, imgWidth, imgHeight, startX, 0, tWidth, canvasHeight ].map( x => fixNum( x ));
        }

        return initVal;
    }

    /** 重新描绘 */
    const reDraw = ( ) => {

        const canvasEle: HTMLCanvasElement = canvasRef.current; 
        const ctx = canvasEle.getContext( '2d' );
        const canvasWidth = canvasWRef.current;

        if ( !ctx || !canvasWidth || !height ) { return; }

        /** 背景颜色 */
        ctx.fillStyle = '#fafafa';
        ctx.fillRect( 0, 0, canvasWRef.current, height );

        /** 画图片 */
        drawImage( );
    }

    /** 画图片（初始化） */
    const drawImage = ( ) => {
        
        const initVal = calculateImg( );
        
        imgParamsRef.current = initVal;
        initImgParamsRef.current = initVal;

        drawZoom( );
    }

    /** 根据缩放系数 重新画图 */
    const drawZoom = ( ) => {

        if ( !canZoom && !!pen ) { return; }

        let finalParams = [ ...initImgParamsRef.current ];

        const targetImg = imgRef.current;
        const imgRate = imgRateRef.current;

        if ( !targetImg ) { return; }

        const canvasEle: HTMLCanvasElement = canvasRef.current; 
        const ctx = canvasEle.getContext( '2d' );

        /** 图片宽高 */
        const imgWidth = targetImg.width;
        const imgHeight = targetImg.height;

        /** canvas元素的宽 */
        const canvasEleHeight = height;
        const canvasEleWidth = canvasWRef.current;
        
        /** 缩放比例，位移 */
        const zoom = fixNum( zoomRef.current / 10, 2 );

        /** 初始化的图片信息 */
        const [ ix, iy, iw, ih, cx, cy, cw, ch ] = initImgParamsRef.current;

        /** 叠加的图片拖拽位移量 */
        const [ dragX, dragY ] = imgDragTranslateRef.current;
                
        // 放大、缩小
        if ( zoom !== 0 ) {

            let ImgX = 0;
            let ImgY = 0;
            let ImgW = iw;
            let ImgH = ih;

            let canvasW = 0;
            let canvasH = 0;
            let canvasX = 0;
            let canvasY = 0;

            // 放大（上沿贴边：长图、方图（图比canvas高））
            if (( zoom > 0 ) && ( imgRate < 1 || 
                ( imgRate === 1 && imgHeight >= canvasEleHeight && canvasEleWidth > canvasEleHeight ))) {

                canvasH = ch + fixNum( ih * zoom );
                canvasW = canvasH * fixNum( ImgW / ImgH, 5 );

            // 缩小、放大（左右贴边：短图、方图（图比canvas宽））
            } else if (( zoom < 0 ) || imgRate > 1 ||
                ( imgRate === 1 && imgWidth >= canvasEleWidth && canvasEleWidth <= canvasEleHeight )) {

                canvasW = cw + fixNum( iw * zoom );
                canvasH = canvasW / fixNum( ImgW / ImgH, 5 );
            }

            const zoomX = (( canvasW - cw ) / 2 );
            const zoomY = (( canvasH - ch ) / 2 );

            canvasX = cx - zoomX + dragX;
            canvasY = cy - zoomY + dragY;

            imgZoomTranslateRef.current = [ zoomX, zoomY ];
            finalParams = [ ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH ];

        // zoom: 0
        } else if ( zoom === 0 ) {
            
            imgZoomTranslateRef.current = [ 0, 0 ];
            finalParams = [ ix, iy, iw, ih, cx + dragX, cy + dragY, cw, ch ];
        }
        
        imgParamsRef.current = [ ...finalParams ];
        const [ ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH ] = finalParams
        
        // 画图
        clearCanvas( );
        !!ctx && ctx.drawImage( imgRef.current, ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH );

        // 画框
        onDrawKuangArr( );
    }

    /** 滚轮 缩放 */
    const onWheel = ( dir: EWheelDirection ) => {
        const zoom = zoomRef.current;
        if ( !canZoom && !!pen ) { return; }

        /** 放大 */
        if ( dir === EWheelDirection.up ) {
            if ( zoom < actionConf.zoomIn ) {
                zoomRef.current = zoom + actionConf.delta;
                drawZoom( );
            }
        /** 缩小 */
        } else {
            if ( zoom > -actionConf.zoomOut ) {
                zoomRef.current = zoom - actionConf.delta;
                drawZoom( );
            }
        }
    }

    /** 拖拽 移动 */
    const onDrag = ({ detalX, detalY }: any ) => {

        // 笔画模式
        if ( !!pen ) { 
            if ( pen.type === 'kuang' ) {
                onDrawingKuang({ detalX, detalY });
            }
            return;
        }

        if ( !canDrag ) { return; }

        /** 叠加的图片的缩放位移量 */
        const [ zoomX, zoomY ] = imgZoomTranslateRef.current;

        /** 叠加的图片拖拽位移量 */
        const [ dragX, dragY ] = imgDragTranslateRef.current;

        /** 现在的图片参数 */
        const imgParams = [ ...imgParamsRef.current ];

        /** 一开始的图片参数 */
        const initParams = [ ...initImgParamsRef.current ];

        /** canvas */
        const canvasEle: HTMLCanvasElement = canvasRef.current; 
        const ctx = canvasEle.getContext( '2d' );

        /** canvas的位移 */
        const initCx = initParams[ 4 ];
        const initCY = initParams[ 5 ];

        /** 最新的位移量 */
        let lastCx = 0;
        let lastCy = 0;

        const totalDeltaX = dragX + detalX - zoomX;
        const totalDeltaY = dragY + detalY - zoomY;

        lastCx = initCx + totalDeltaX;
        lastCy = initCY + totalDeltaY;

        imgParams.splice( 4, 1, lastCx );
        imgParams.splice( 5, 1, lastCy );

        imgParamsRef.current = [ ...imgParams ];
        const [ ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH ] = imgParams

        /** 画图片 */
        clearCanvas( );
        !!ctx && ctx.drawImage( imgRef.current, ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH );

        /** 画框 */
        onDrawKuangArr( totalDeltaX, totalDeltaY );
    }

    /** 拖拽移动结束后，叠加拖拽量 */
    const onDragSync = ({ detalX, detalY }: any ) => {
        
        // 拖拽模式
        if ( !pen && canDrag ) {
            const [ dragX, dragY ] = imgDragTranslateRef.current;
            imgDragTranslateRef.current = [ dragX + detalX, dragY + detalY ];

        // 画笔模式
        } else if ( !!pen ) {
        
            /** 画框模式，添加了一个框 */
            if ( pen.type === 'kuang' ) {

                let kuangArr = [ ...kuangArrRef.current ];

                // 最后一个的下标
                const Index = kuangArrRef.current.length - 1;

                //  不再有 drawing: true 的框
                const targetKuang = {
                    ...kuangArrRef.current[ Index ],
                    drawing: false
                };
                
                kuangArr.splice( Index, 1, targetKuang );

                // 重新赋值
                kuangArrRef.current = kuangArr;

                // 放进动作队列
                activeActions$([
                    ...activeActions,
                    {
                        type: 'kuang',
                        meta: targetKuang
                    }
                ]);

                broadcastChange( );
            }

            pen$( null );
            mouseDownRef.current = null;
        }
    }

    /** 画框 - ing */
    const onDrawingKuang = ({ detalX, detalY }: any ) => {

        /** canvas */
        const canvasEle: HTMLCanvasElement = canvasRef.current; 
        const ctx = canvasEle.getContext( '2d' );

        /** 框 */
        let lastKuangArr: TKuang[ ] = [ ];
        let kuangArr = kuangArrRef.current;
        const mouseDown = mouseDownRef.current;

        /** 当前的图片信息 */
        const imgParams = imgParamsRef.current;

        if ( !mouseDown || !pen ) { return; }
        const [ startX, startY ] = mouseDown;

        const lastIndex = kuangArr.findIndex( x => x.drawing );

        /** 重新设置坐标值 */
        const [ x, y, w, h ] = fixCoordinate( startX, startY, detalX, detalY );

        /** 设置当前的框 */
        const drawingKuang = {
            x, 
            y, 
            w, 
            h,
            drawing: true,
            selecting: false,
            color: pen.color,
            img: {
                cx: imgParams[ 4 ],
                cy: imgParams[ 5 ],
                cw: imgParams[ 6 ],
                ch: imgParams[ 7 ]
            }
        }

        /** 第一次画这个框 */
        if ( lastIndex === -1 ) {
            lastKuangArr = [ ...kuangArr, {
                ...drawingKuang,
                key: count++
            }];

        /** 更改这个框 */
        } else {
            kuangArr.splice( lastIndex, 1, {
                ...kuangArr[ lastIndex ],
                ...drawingKuang
            });
            lastKuangArr = [ ...kuangArr ];
        }
        
        kuangArrRef.current = lastKuangArr;

        // 清除
        clearCanvas( );

        // 画图
        const [ ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH ] = imgParamsRef.current;
        !!ctx && ctx.drawImage( imgRef.current, ImgX, ImgY, ImgW, ImgH, canvasX, canvasY, canvasW, canvasH );

        // 画框
        onDrawKuangArr( );
    }

    /** 画出所有已经画过的框 */
    const onDrawKuangArr = ( detalX?: number, detalY?: number ) => {

        /** canvas */
        const canvasEle: HTMLCanvasElement = canvasRef.current; 
        const ctx = canvasEle.getContext( '2d' );

        const kuangArr = kuangArrRef.current;

        if ( !!ctx ) {
            kuangArr.map(( kuang, k ) => {

                const { x, y, w, h, color, drawing, selecting } = kuang;

                ctx.lineWidth = 2;
                ctx.strokeStyle = color;

                /** 已经画过的框 */
                if ( !drawing ) {
                    const { newX, newY, newW, newH } = calculateKuang( kuang );
                    ctx.strokeRect( 
                        newX, 
                        newY,
                        newW,
                        newH
                    );

                    /** 选中 */
                    if ( selecting ) {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.25;
                        ctx.fillRect(
                            newX, 
                            newY,
                            newW,
                            newH
                        );
                        ctx.globalAlpha = 1.0;
                    }

                /** 正在画的框 */
                } else {
                    ctx.strokeRect( x, y, w, h );
                }
            })
        }
    }

    /** 计算这个框，在不同zoom（当前或最初）下的位置、大小 */
    const calculateKuang = ( kuang: TKuang, isCurrent = true ) => {

        const defautlResult = { 
            newX: 0, 
            newY: 0, 
            newW: 0, 
            newH: 0,
            imgX: 0, 
            imgY: 0, 
            imgW: 0, 
            imgH: 0, 
            rateX: 0, 
            rateY: 0, 
            rateW: 0, 
            rateH: 0,
            imgWidth: 0, 
            imgHeight: 0,
            abs: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            },
            rate: {
                x: 0, 
                y: 0, 
                w: 0, 
                h: 0,
            },
            img: {
                w: 0,
                h: 0
            }
        };

        if ( !kuang ) { return defautlResult; }

        const { x, y, w, h, img } = kuang;

        if ( !img ) { return defautlResult; }

        const targetImg = imgRef.current;
        if ( !targetImg ) { return defautlResult; }

        let canvasX = 0;
        let canvasY = 0;
        let canvasW = 0;
        let canvasH = 0;

        const currentImg = imgParamsRef.current;
        const initImg = initImgParamsRef.current;

        /** 图片的真实宽高 */
        const imgWidth = targetImg.width;
        const imgHeight = targetImg.height;

        if ( isCurrent ) {
            canvasX = currentImg[ 4 ];
            canvasY = currentImg[ 5 ];
            canvasW = currentImg[ 6 ];
            canvasH = currentImg[ 7 ];
        } else {
            canvasX = initImg[ 4 ];
            canvasY = initImg[ 5 ];
            canvasW = initImg[ 6 ];
            canvasH = initImg[ 7 ];
        }

        /** 这个框，在图片里面的相对比例 */
        const rateX = ( x - img.cx ) / img.cw;
        const rateY = ( y - img.cy ) / img.ch;
        const rateW = w / img.cw;
        const rateH = h / img.ch;

        /** canvas中 坐标 */
        const newX = rateX * canvasW + canvasX;
        const newY = rateY * canvasH + canvasY;

        /** canvas中 宽高 */
        const newW = rateW * canvasW;
        const newH = rateH * canvasH;

        /** 图片中的坐标 */
        const imgX = rateX * imgWidth;
        const imgY = rateY * imgHeight;

        /** 图片中的宽高 */
        const imgW = rateW * imgWidth;
        const imgH = rateH * imgHeight;

        return { 
            newX, 
            newY, 
            newW, 
            newH, 
            imgX, 
            imgY, 
            imgW, 
            imgH, 
            rateX, 
            rateY, 
            rateW, 
            rateH,
            imgWidth, 
            imgHeight,
            abs: {
                x: imgX,
                y: imgY,
                w: imgW,
                h: imgH
            },
            rate: {
                x: rateX, 
                y: rateY, 
                w: rateW, 
                h: rateH,
            },
            img: {
                w: imgWidth,
                h: imgHeight
            }
        };
    }

    /** 选中某一个框 */
    const _onSelectKuang = ( x: number, y: number ) => {

        let kuangArr = [ ...kuangArrRef.current ];
        
        /** 选中逻辑 */
        const selectedKuangs = kuangArr.filter( k => {
            const { newX, newY, newW, newH } = calculateKuang( k );
            return  x >= newX && x <= newX + newW && y >= newY && y <= newY + newH;
        });


        // 没有选中任何一个
        if ( selectedKuangs.length === 0 ) {
            kuangArr = kuangArr.map( x => ({
                ...x,
                selecting: false
            }))
            selectingKuang$( null );
            !!onSelectKuang && onSelectKuang( null )
        }
        
        // 选中了一个
        if ( selectedKuangs.length === 1 ) {

            const targetKuang = selectedKuangs[ 0 ];
            const Index = kuangArr.findIndex( x => x.key === targetKuang.key );
            
            /** 设置selecting */
            kuangArr = kuangArr.map(( x, k ) => ({
                ...x,
                selecting: k === Index ? true : false
            }));

            /** 事件 */
            const { abs, rate, img } = calculateKuang( kuangArr[ Index ], false );
            !!onSelectKuang && onSelectKuang({
                abs, 
                img,
                rate, 
                id: targetKuang.id,
                key: targetKuang.key,
                color: targetKuang.color
            });

            /** 设置选中 */
            selectingKuang$( kuangArr[ Index ])
        }

        kuangArrRef.current = [ ...kuangArr ];
        clearCanvas( );
        reDraw( );
    }

    /** 鼠标点击画布 */
    const onMouseDown = ({ x, y }: any ) => {
        
        /** 鼠标点击 */
        mouseDownRef.current = [ x, y ];

        /** 可能是需要选中某个框 */
        _onSelectKuang( x, y )
    }

    /** 生成画线框的颜色选项 */
    const genreratrColorOpt = ( type: TPen ) => {
        return (
            <Popover 
                title='画框颜色'
                trigger="click"
                visible={ type === 'kuang' ? kuangOpt : false}
                onVisibleChange={ e => type === 'kuang' ? kuangOpt$( e ) : ( ) => { }}
                content={(
                    <div className="pen-color-picker">
                    {
                        penColorOpts.map(( c,k ) => (
                            <div 
                                key={ k }
                                style={{ background: c }}
                                onClick={ e => { e.stopPropagation( );setPen( type, c )}}
                                className={`color-item ${ c.startsWith('#fff') ? 'border' : '' } ${ ( !!pen && pen.type === type && pen.color === c ) ? 'selected' : ''}`}
                            ></div>
                        ))
                    }
                    </div>
                )}
            >
                <img 
                    className='img-icon'
                    src={ getIcon( type )}
                />
            </Popover>
        )
    }

    /** 设置当前笔的模式 */
    const setPen = ( type: TPen, color: TPenColor ) => {
        kuangOpt$( false );
        pen$(( !!pen && pen.type === type && pen.color === color ) ? null : { type, color })
    }

    /** 撤回 */
    const retract = ( ) => {

        const actions = [ ...activeActions ];
        const action = actions.pop( );
        if ( !action ) { return; }

        /** 画框模式 */
        if ( action.type === 'kuang' ) {

            const kuangArr = [ ...kuangArrRef.current ];
            const index = kuangArr.findIndex( x => x.key === action.meta.key );

            index !== -1 && kuangArr.splice( index, 1 );
            kuangArrRef.current = kuangArr;
        }

        clearCanvas( );
        reDraw( );

        /** 插入到撤销队列 */
        retractActions$([
            ...retractActions,
            action
        ]);

        /** 行动队列 */
        activeActions$([
            ...actions
        ]);

        broadcastChange( );
    }

    /** 不撤回 */
    const unRetract = ( ) => {

        const _retractActions = [ ...retractActions ];
        const retractAction = _retractActions.pop( );
        if ( !retractAction ) { return; }

        /** 画框模式 */
        if ( retractAction.type === 'kuang' ) {
            kuangArrRef.current = [ ...kuangArrRef.current, retractAction.meta ];
        }

        clearCanvas( );
        reDraw( );

        /** 插入到行动队列 */
        activeActions$([
            ...activeActions,
            retractAction
        ]);

        /** 撤销队列 */
        retractActions$([ 
            ..._retractActions
        ]);

        broadcastChange( );
    }

    /** 删除选中框 */
    const deleteSeletingKuang = ( ) => {
        const kuangArr = [ ...kuangArrRef.current ];
        const Index = kuangArr.findIndex( x => x === selectingKuang );
        
        if ( !selectingKuang ) { return; }

        /** 重置 */
        kuangArr.splice( Index, 1 );
        kuangArrRef.current = kuangArr;

        /** 从行动队列删除此项 */
        const Index2 = activeActions.findIndex( aciotn => {
            const { x, y, w, h, color } = aciotn.meta;
            return selectingKuang.x === x && 
                selectingKuang.y === y &&
                selectingKuang.w === w &&
                selectingKuang.h === h && 
                selectingKuang.color === color
        })
        const newActiveActions = [ ...activeActions ];
        newActiveActions.splice( Index2, 1 );

        selectingKuang$( null );
        activeActions$([ ...newActiveActions ])

        /** 重画 */
        clearCanvas( );
        reDraw( );

        broadcastChange( );
    }

    /** 处理默认框 */
    const setDefaultKuang = ( ) => {

        const initVal = calculateImg( );

        const targetImg = imgRef.current;

        if ( !targetImg ) { return; }

        /** 图片的真实宽高 */
        const imgWidth = targetImg.width;
        const imgHeight = targetImg.height;

        // 处理默认的框
        const cx = initVal[ 4 ];
        const cy = initVal[ 5 ];
        const cw = initVal[ 6 ];
        const ch = initVal[ 7 ];
        
        kuangArrRef.current = defaultKuangArr.map(({ id, x, y, w, h, color, key }) => {

            const rateX = x / imgWidth;
            const rateY = y / imgHeight;
            const rateW = w / imgWidth;
            const rateH = h / imgHeight

            const kx = cx + rateX * cw;
            const ky = cy + rateY * ch;
            const kw = rateW * cw;
            const kh = rateH * ch;

            return {
                id,
                key: key !== undefined ? key : count++,
                w: fixNum( kw, 3 ),
                h: fixNum( kh, 3 ),
                x: fixNum( kx, 3 ), 
                y: fixNum( ky, 3 ),
                drawing: false,
                selecting: false,
                color: color || penColorOpts[ 1 ],
                img: {
                    cx,
                    cy,
                    cw,
                    ch
                }
            }
        });

        // broadcastChange( );
    }

    /** 框变化 */
    const broadcastChange = ( ) => {
        const kuangArr = kuangArrRef.current;
        const data = kuangArr.map( k => {
            const { color } = k;
            const { abs, rate, img } = calculateKuang( k );
            return {
                id: k.id,
                key: k.key,
                abs, 
                img,
                rate, 
                color
            }
        });
        !!onChangeKuang && onChangeKuang( data );
    }

    /** 默认框变化 */
    useEffect(( ) => {
        // 别去掉，数据有些问题，不然会访问到defaultKuangArr的旧数据
        setTimeout(( ) => {
            resetAction( );
        }, 50 )
    }, [ defaultKuangArr ]);

    /** 图片路径变化 */
    useEffect(( ) => {
        clearCanvas( );
        const img = new Image( );

        img.src = url;
        img.onload = ( ) => {

            imgRef.current = img;

            resetAction( );

            showImgTips$( true )
            setTimeout(( ) => showImgTips$( false ), 8000 );
        }
    }, [ url ]);

    /** 宽度变化 */
    useEffect(( ) => {
        const canvasEle: HTMLCanvasElement = canvasRef.current;
        if ( !canvasW ) { return; }

        canvasEle.width = canvasW;
        canvasEle.height = height;

        resetAction( );
    }, [ canvasW ]);

    return (
        <ResizeContainer
            className='com-img-draw'
            onInit={ w => { canvasW$( w ); canvasWRef.current = w; }}
        >
            <div 
            >
                <Popover
                    title="操作"
                    trigger="focus"
                    placement="left"
                    visible={ showImgTips }
                    content={(
                        <div style={{ fontSize: 12 }}>
                            <div>
                                <Icon 
                                    style={{ fontSize: 14, marginRight: 5 }}
                                    type="column-height" 
                                /> 
                                滚动鼠标 <a>缩放</a>
                            </div>
                            <div>
                                <Icon 
                                    type="fullscreen" 
                                    style={{ fontSize: 14, marginRight: 5 }}
                                /> 
                                拖拽图片 <a>移动</a>
                            </div>
                        </div>
                    )}
                >
                    <MouseContainer
                        onGrag={ onDrag }
                        onGragSync={ onDragSync }
                        onMouseDown={ onMouseDown }
                        onWheelDirection={ d => onWheel( d )}
                        className='con-canvas-action'
                    >
                        <canvas 
                            ref={ canvasRef }
                            className={ !canvasW ? 'the-canvas' : ''}
                        />
                    </MouseContainer>
                </Popover>
            </div>

            <Popover
                title={ null }
                placement="topLeft"
                visible={ !!selectingKuang }
                content={(
                    <div>
                        {
                            !!selectingKuang && (
                                <Tooltip
                                    title='删除'
                                >
                                    <Button 
                                        size="small"
                                        shape="circle"
                                        type="danger" 
                                        onClick={ deleteSeletingKuang }
                                    >
                                        <Icon 
                                            type="delete" 
                                            theme="filled" 
                                        />
                                    </Button>
                                </Tooltip>
                            )
                        }
                    </div>
                )}
            >
                {/* 描绘操作框 */}
                <div className="action-block">
                    <div>
                        {/* 画框 */}
                        <Tooltip title="画框">
                            { genreratrColorOpt( 'kuang' )}
                        </Tooltip>
                        <Tooltip title="撤回">
                            <img 
                                className='img-icon'
                                src={ getIcon('arrow-left')}
                                onClick={ retract }
                            />
                        </Tooltip>
                        <Tooltip title="不撤回了">
                            <img 
                                className='img-icon'
                                src={ getIcon('arrow-right')}
                                onClick={ unRetract }
                            />
                        </Tooltip>
                        <Tooltip title="重置">
                            <img 
                                className='img-icon'
                                src={ getIcon('reset')}
                                onClick={ resetAction }
                            />
                        </Tooltip>
                    </div>
                </div>
            </Popover>
        </ResizeContainer>
    );
}

/** 获取png图标，base64 */
function getIcon( type: 'kuang' | 'arrow-left' | 'arrow-right' | 'reset' ) {
    const obj = {
        'kuang': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN RQfkBQ8EJBraAdwSAAABoklEQVRYw+2Xv0sCYRjHv++pNBaCSGJE/QEl6B/g0NIQTTq0NUV5J1pD o97S0GBxr0v4BwQ6FBFRQ/gP5CI0tLno3NAQSr4N752+75HgHa9T9yzvL/h8nufhDt4XWHAQtThr J7Q+Xgs3jvsLENQ2l67ZHp+zc+PSJbhZHl6QHGIYoDkyy5+ec1/SnpEVWnNQuAUAzcavDl/JCWIA EihF2lbSq4AcinhgfMZHWzA8ImnhNEVOvQq0jEuYplmhRfRNEiiJ0Ua5N6lAPR4o94QWsY5yfpcP YXv5CKkGVjSoNx6tkopEuLN742zUm8hNj3Uf/0edCYuWnucTbYLMM9N2m37wgE5Y0anfwbv+ZJ6D P/wsguYXNW8EgkAQCAJBIAgEgSAQKBZYSVrjM1r1C6OGPAKTi9fVSqSN1HRb+dUxUhHxcg5zZi/X nXPWdqb1PhJ+GzMjuvq2UIFyPLAltQgD5YIPPjgPkCZK4ikzjao3HjWIJRHkB4jrK2pN7/fzx99P mBAfXr73H36+SBRx1kHDKPjpyVNrl5Ao4njHvZ7xQ/in8QuwUmiYgHUNiwAAACV0RVh0ZGF0ZTpj cmVhdGUAMjAyMC0wNS0xNVQwNDozNjoyNiswMDowMLpZs4oAAAAldEVYdGRhdGU6bW9kaWZ5ADIw MjAtMDUtMTVUMDQ6MzY6MjYrMDA6MDDLBAs2AAAAAElFTkSuQmCC',
        'arrow-left': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAwCAQAAADjwgG/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN RQfkBQ8EKBZ/At81AAADGklEQVRYw73YSWgTURzH8e+btMUdvdS6gCJ4sYJYi6gHF9QqVdGL9aAi WrA1nQmlYhUEUVxQ3DOTWkWxBxVpvNkGqgeLAZUWEfcFFMGDG94sKm3meSg1aTpJZzJ5/k/zHvOf z/wm4eVNBJ7r3MTAVnFSPpbBUJf37tTSvDaYqwrj4iSIedoxfzQIb6dHgtJM3nDh5JrP/y25dVpG UjsSk/0lL3B74tnxhS2sHzyXGOsPd5ncXFoQT6f9lyvcrBbtYna+aVe4dVRcZlT+aRefeeSm3KQC Hha/UJxol+Wq6KyPPVyReINCOgtu7dE6mKCSzvjYrRa2qYUzJrfibunwVD/4kLU9PFV0iUkervBd PhHPxWue1XX7xK213M45SMyO/onu6ckRN/eLIznT/fWRqH099NQzbrWy0SfdX9/svaEWT7j5TszM C91fYbsx9McV3jTDfp9HGAAZDzQGHw2LN8/qe5lvGoCfcocRzYo3z+rrYrQSHJBV2Xitt0EdDaLV zPIl1sQCdfRwvMYUtTiI1qYNmZJ3qsbBPhIpccTtG+pxSm3HlVMzorJKvS6qI9UOswBmrbig3P9S sLz2VVpyAKNZW6gcL+k96pgc4MzIoo8Uq/W1xcH4kOQADb/0idxXi9tb0m4mdaAvIawSl5ubZqSO h2yjrB1ccX21zrRxOWOyN4gDdYez4GCVcY9xrpIsM9L48PyCMrlQriDDy7N4m5iT/J13/HOgNfC1 W8zNBe+vqyN6VrCOnY49m41/y5rj1rkqYZRxy01259r+W2/Ta7RyLjlkr0geZ3xj0TdyInceIPhY r2GJvJOW3A0O+j65lWH3YdlLv2+sYveg5JOslS5wMK4FynmFz9LP2GsHTVS6wmHXC72UNr98qJ1F yZFc4xIH0NeJ877TP5SrB47FzLPjXeNQVy9DfnmjQx4aOC6a7gEHw2QNH3zyBwd42xsOeqyvkruD 54o+eeXpABBecah/q1dwMWXiTY3n9xx5HIBpnnEAvZbGfwPLKw1GpziVTB7w2h57UNlNL8Vc0Q97 7QWI3a0s5UesDeAvWi7ZTZZ9FTkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDUtMTVUMDQ6NDA6 MjIrMDA6MDBqM/JdAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA1LTE1VDA0OjQwOjIyKzAwOjAw G25K4QAAAABJRU5ErkJggg==',
        'arrow-right': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAwCAQAAADjwgG/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN RQfkBQ8EKRH4fXvXAAAC9ElEQVRYw8XYT0gUURwH8O9vtlXJAg/90Yjawg72X8SoQ2hFliuBl7GD YEWRqW+G8hBCB/WWVlgzu5IehEg6ZNKhWJMWEg8VldqhJMksCDx0CUKw1PV12HWd3Z11Z3ac3d9p 3u/Nbz/83pt9OyzBYiiHqJOKeK3Ubb6WrOIeP04AAA1AbphMKd6VNz8dHkxyWRowUy1YwwNbNIN8 8qlSKvH1kWNSPErKcJ2QvD5lY7pw8HLhtXoqTTiAfHphZPftwWFs923DAUheX/pw8HLPV29BmnAA +XzcW50uHADv9dyxAVe2GryxUX/3kzjbvcXYzwv4PiqEwcMEADBJhQ0zFvBb2ZmiIMKd9FKVsOGk cOWAUA0RrqThYFxjd03jynmhDZsswsF4yGpM4Eqm0A55VeBgfGZ7DeKdhwPtdHQVaQCAY0fdj4S4 KlIP1q02DQB8p/R9RVwV6bEdMABgYrbIkSYa2OBcGxe3mQaArDi4Wkn9NtNAlu7Z3pFDzbbToCFd 3NmMg/bji490nna1kp7aT/MqqS+m89QsOa+T+oA10elULLlwpP4tEHPC3d+98BFOW+Vfc67G2eBl VOfz58heepiVaFZAO+PNpRqzn2YqFC0d3XkNchOUz+BDVKbUMH2R9UQmNHve5Zwfw544hdPkpzcL o/K7yLRaSq8MwX9wjI1GJzWdz4mkT3fjWbb/wl/DHcYEH9tcXBWIzWtwKtODhe76keRZAMATSdSf 0OC8LPJ7x0d4k+y3CANtrCneVBj3nEReZM+OpvrfFuF//JLUG396ufOIt3EuS6rlnscdZ+s+rXRD GOcVy4vO3eb+VdKN5+xMoltCh0xHDu0K06et03QvMR3uPMPFl8pa2KBVmsvM0KaFOl90hcpaG1ot ylOoMPq8hHAK4oNSizkp42dU4uWCm/mMVi/9sGwHAH7TbJu13/BFM+xiZVcnjFdrOqfb0pBZHIAn fHWdXTFXGnp1dh/HFLucBA3fe3cOtqEfN9gDs7X/Af4ewBOZiQwnAAAAJXRFWHRkYXRlOmNyZWF0 ZQAyMDIwLTA1LTE1VDA0OjQxOjE2KzAwOjAw/zG6kwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0w NS0xNVQwNDo0MToxNiswMDowMI5sAi8AAAAASUVORK5CYII=',
        'reset': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN RQfkBQ8EKhJKWXmuAAADk0lEQVRYw91YW0gUURj+zrjYRYMNstIKrcighF7CG0RGGQTa3SKyEKnM vWhCPtSL60MP2UPozgqbpJFFD11pI6ObUoJQGEZ0pRtEmm2ghZapO6cH9cyZ2dnZmcEe6n+a851z vu/83zlz9p8F/vUgk0VUnxmahyfuD2pcmBx6X7PUQS6R9+K+vyIgZtHC8ccj6j6bEYLatJg0miIk 0xQyJAVJkD6gHWU/5H46nzm9yKSAL1vKJ/lYDhBQABQEADmKYd89qUVocb6NtjgdATGPHKD52qeA xNINZAOFGBDqHHf1BCKcojFyI/YBOIMXqJlouFSMmhmIxThNDbIDKMKgKYt8VdSjMXIQQQQxHcs1 +uJMCIh36VqFh99oQHg0eqfs3Vi7bootTUpDBgoxw0h6KsfEs9ijABqFGsdrrYnehWQ3CrFUjevu gfewgr6XHnRf06AuF7KoAAD0OUJkmX4GnEBdOjnBpfZ4eH1Ff/gEsR6lEwfAyEXGCQguDv/kTI8w o9gAKxfsLqpbz9nzU9hijsaAAL9+WuHojDijUZfvuRoYt1FMxkdG3+leqcchbzIXcViMaeh0bVWP ntiDXA47pZ+0uxa1pi2iOxkSHDpvfLpBgSobWccMulg5aJ0ugkCSnUMuTib9uMAoJyD0Tq6ADQAk u/xOki/WycQmFCGINtcOVQbCVBmIGbBK7zuOIgAJKBD9aov6ZWBwtlUBKl8uqSoBwglMSbDs0Ar2 xNksAEAMJyAtsWjQAsxkuTxVCTgHwM4OKbAmIGVypF0qAQDy21twMsWKgLCRa4QLkBsyZCuyIkBX sceAU70HgLMVb5hJ+/2JZum9HiSzxnVFZmwFFxiWNFxikj6HVLHG99GApkCsH90shyrvAeP0vnhy jGs2HVJcNkygpIc2yDDxR+VlQQPIZo2ukWplL1cY+BNHHmIxN3GNuy0auT9xpJ0v2ekWdaHD/fSV 9KBSod3q9ehvt3fbyEsFfXV4HaWu7EpRrwC6aYNwTusrQMwg5XSXwqpqtyd8XFjt5PVwJ2JiUAua 8fJ3MO5rKJ7OleYgh6xGjmrQZdd2rSw1ijMxF7dhNppde7U7ND4CXXeQiVcmyPtREYkeiNECb37e dCU0QFINFehNxOG6Frlbp371Jw6XkEL+4IbFVSq67+vrRy2QxTxswmbMUqL0OrlF293Poido8K8E X3zITu02O/mFPvQ5+ozN+j/iDw6GBLocP+2WAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTE1 VDA0OjQyOjE4KzAwOjAwRDl6zQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xNVQwNDo0Mjox OCswMDowMDVkwnEAAAAASUVORK5CYII='
    };
    return obj[ type ];
}

type TDefaultKuang = {
    /** 绝对坐标 */
    id: number
    x: number
    y: number
    w: number
    h: number
    key?: any
    color?: TPenColor
}

type TComImgDraw = {

    /** 图片路径 */
    url: string

    /** canvas高度 */
    height: number,

    /** 能否缩放 */
    canZoom?: boolean

    /** 能否拖拖拽 */
    canDrag?: boolean,

    /** 默认框 */
    defaultKuangArr?: TDefaultKuang[ ]

    /** 框变动 */
    onChangeKuang?: ( kuangs: TCbKuang[ ]) => void

    /** 选中某个框 */
    onSelectKuang?: ( kuang: TCbKuang | null ) => void
};

type TCbKuang = {
    id: any,
    key: number,
    /** 绝对坐标 */
    abs: {
        x: number
        y: number
        w: number
        h: number
    }
    /** 相对比例 */
    rate: {
        x: number
        y: number
        w: number
        h: number
    }
    /** 图片的大小 */
    img: {
        w: number
        h: number
    }
    /** 框的颜色 */
    color?: TPenColor
}

/** 动作队列 */
type TAction = {
    type: TPen,
    meta: TKuang
}

/** 笔的模式 */
type TPen = 'kuang';

/** 笔的颜色 | 红/黄/绿/蓝/灰/黑/白 */
type TPenColor =  '#f5222d' | '#ffec3d' | '#52c41a' | '#1890ff' | '#949494' | '#000' | '#fff' 

/** 笔 */
type TDrawPen = {
    type: TPen,
    color: TPenColor
}

/** 画出来的框 */
type TKuang = {
    id?: any
    x: number,
    y: number,
    w: number,
    h: number,
    color: TPenColor,
    drawing: boolean,
    selecting: boolean,
    img: {
        cx: number,
        cy: number,
        cw: number,
        ch: number
    },
    key: number
}

/** 指针滚动方向 */
enum EWheelDirection {
    up,
    down
}
