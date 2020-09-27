import { notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { http } from '@cvte/ai-web-util/util';
import { useFetch } from '@cvte/ai-web-util/hooks';
import { Imglist } from '@cvte/ai-web-util/components'
import { useObserver, useComputed } from 'mobx-react-lite';
import React, { useEffect, useState, useRef } from 'react';

import { useStore } from '../../../../store';
import { ETaskRole } from '../../../../util/enum';
import { parseQuery } from '../../../../util/query';
import { MyTxtLabelTag, MyImgLabelTag, MyImgDetectTag, MyVoiceLabelText } from '../../../../containers';


export const Undone = ({ taskId, onChange }: PImgtagUndone ) => {

    /** 图片列表长度 */
    const pageSize = 9;
    const history = useHistory( );
    const { LabelImg, User } = useStore( );

    /** 浏览器窗口 */
    const [ clientHeight, clientHeight$ ] = useState( 0 );

    /** 在“待标注”中，完成标注的文件 */
    const finishListRef = useRef< any[ ]>([ ]);

    /** 当前的模板类型 */
    const [ template, template$ ] = useState('');

    /** 选中、正在编辑的图片 */
    const selecingRef = useRef< any >( null )
    const [ selecing, selecing$ ] = useState< any >( null )

    /** 拉取的列表 */
    const listRef = useRef< any[ ]>([ ]);
    const [ list, list$ ] = useFetch< any >({
        url: `/t-apis/admin/labeltask/get_data`,
        initVal: {
            pagination: {
                total: 1,
                page_num: 1,
                page_size: pageSize
            },
            results: [ ]
        }
    });

    /** 加锁某一张 */
    const lock = async ids => {

        if ( !ids || ( Array.isArray( ids ) && ids.length === 0 )) { 
            return true; 
        }

        return http.post({
            data: {
                data_id_list: ids,
                label_task_id: taskId
            },
            url: `/t-apis/admin/labeltask/lock_data`
        }).then( res => {
            return res.status === 200;
        })
    }

    const setSelecting = target => {
        selecing$( target );
        selecingRef.current = target;
    }

    /** 从图片列表，选中某张图片 */
    const onSelectImg = ( selectd, k, cb ) => {
        const target = 
            finishListRef.current.find( x => x.file_url === selectd || x.id === selectd ) ||
            jobList$.find( x => x.file_url === selectd || x.id === selectd );
        !!target && setSelecting( target );
        cb( );
    }

    /** 翻页 */
    const onPageChange = ( type: 'pre' | 'next', cb?: any ) => {
        /** 先解锁 */
        unLock( )
            .then( r => {
                if ( !r ) { return;}

                const pageNum = list.pagination.page_num;
                const nextPage = type === 'pre' ? pageNum - 1 : pageNum + 1;
                
                const selectedFile = LabelImg.selectedEntryFile;

                // 拉取
                fetchList( nextPage );
                !!cb && cb( )

                // 如果是返回到第一页，把入口文件也要加锁
                if ( nextPage === 1 && !!selectedFile ) {
                    lock([ selectedFile.id ]);
                }                
            })
    }

    /** 获取列表，并上锁（后台处理） */
    const fetchList = ( page_num = 1 ) => {
        list$.load({
            params: {
                page_num,
                page_size: pageSize,
                label_task_id: taskId,
                data_type: 'un_label'
            }
        }).then( data => {
            const firstFile = data.results[ 0 ];

            if (( !!firstFile && !selecingRef.current ) || page_num > 1 ) {
                setSelecting( firstFile );
            }

            finishListRef.current = [ ];
        })
    }

    /** 离开界面、解锁 */
    const unLock = async ( ) => {

        const data_id_list = [
            ...finishListRef.current,
            ...listRef.current,
            ( LabelImg.selectedEntryFile || { })
        ]
            .map( x => x.id )
            .filter( x => !!x );

        if ( data_id_list.length === 0 ) { return true; }

        return http.post({
            data: {
                data_id_list,
                label_task_id: taskId
            },
            url: `/t-apis/admin/labeltask/release_lock`
        }).then( res => {
            return res.status === 200
        })
    }

    /** 标注了任意一个任务 */
    const onFinishSome = ( changeData ) => {

        const { values, data_id } = changeData;
        let finishList = [ ...finishListRef.current ];

        /** 不是所有类型的标注，都要自动切到下一个 */
        const shouldNext = template === 'img-tag';

        const finishedTarget = {
            ...selecing,
            values
        };
        const Index = finishListRef.current.findIndex( x => x.id === data_id );

        if ( Index !== -1 ) {
            finishList.splice( Index, 1, finishedTarget )
        } else {
            finishList = [
                ...finishList,
                finishedTarget
            ];
        }

        // 自动选择下一个（翻页）
        if ( shouldNext ) {

            // 重新选择一个select
            const Index = jobList$.findIndex( x => x.id === selecing.id );
            const target = jobList$[ Index + 1 ];

            // 自动选择下一个
            selecing$( target || null );

            // 自动翻页
            if ( jobList$.length === 1 && 
                !( list.pagination.page_num * list.pagination.page_size >= list.pagination.total )) {
                    onPageChange( 'next' );
            } else if ( jobList$.length === 1 &&
                ( list.pagination.page_num * list.pagination.page_size >= list.pagination.total )) {
                    notification.success({
                        message: '提示',
                        description: '标注完成啦～'
                    })
            }
        } else {
            setSelecting( finishedTarget );
        }

        finishListRef.current = finishList;
 
        // 上层回调
        !!onChange && onChange( );
    }

    /** 
     * 展示的列表 
     * 这里都是已经上了锁的，
     * 【自动翻页情况下。则不展示】
     */
    const jobList$ = useComputed(( ) => {

        /** 是否一提交 就 自动隐藏刚刚提交的 */
        const shouldAutoHide = template === 'img-tag';

        // 只有第一页的时候，才把入口文件 插入进来
        const pageNum = list.pagination.page_num;
        // 入口默认文件
        const selectedFile = LabelImg.selectedEntryFile;

        let defaultList = ( list.results || [ ])
            .filter( x =>  x.id !== ( selectedFile || { }).id );

        if ( shouldAutoHide ) {
            defaultList = defaultList
                .filter( x => !finishListRef.current.find( y => y.id === x.id ))
        }

        // 插入
        if ( pageNum === 1 && !!selectedFile ) {
            defaultList = [
                selectedFile,
                ...defaultList
            ]
        }
        
        return defaultList;
    }, [ list, LabelImg.selectedEntryFile, finishListRef.current, template ]);

    /** 记录Ref */
    useEffect(( ) => {
        listRef.current = (list.results || [ ]);
    }, [ list ]);

    /** didMount */
    useEffect(( ) => {

        const defautlFile = LabelImg.selectedEntryFile;
        const { template } = parseQuery( history.location.search );
        
        template$( template );
        !!defautlFile && setSelecting( defautlFile )

        fetchList( );
        
        /** 离开页面 */
        return ( ) => {
            unLock( );
        }
    }, [ ]);

    /** didMount， 浏览器窗口 */
    useEffect(( ) => {
        clientHeight$( document.body.clientHeight );
    }, [ ]);

    return useObserver(( ) => (
        <div 
            style={{ paddingTop: 20 }}
        >
            
            {/* 
                图片列表 
                含voice、img-tag
            */}
            <Imglist 
                imgWdith={ 150 }
                imgHeight={ 120 }
                onSelect={ onSelectImg }
                onPageChange={ onPageChange }
                value={( selecing || { }).file_url || ( selecing || { }).id }
                list={ jobList$.map( x => x.file_url || x.id )}
                toolTips={ jobList$.map( x => x.content || x.file_url )}
                showPre={ list.pagination.page_num > 1 }
                showNext={ !( list.pagination.page_num * list.pagination.page_size >= list.pagination.total )}
                defaultImg={
                    ( template !== 'img-tag' && template !== 'detection-tag' ) ? 
                        require('../../../../assets/img/bg-2.jpg').default :
                        '' 
                }
            />   

            {/* 标注 */}
            <div style={{ marginTop: 10 }}>

                {/* 标签标注 */}
                {
                    ( !!selecing && template === 'img-tag' ) && (
                        <MyImgLabelTag
                            type='single'
                            taskId={ taskId }
                            file={ selecing }
                            onChange={ onFinishSome }
                            src={ selecing.file_url }
                            height={ clientHeight - 440 }
                            canAction={ User.taskRole > ETaskRole.read }
                            defaultSelected={ 
                                (!!selecing.values && !!selecing.values[ 0 ]) ?
                                    [ selecing.values[ 0 ].label ] :
                                    [ ]
                            }
                        />
                    )
                }

                {/* 图片检测，标签标注 */}
                {
                    ( !!selecing && template === 'detection-tag' ) && (
                        <MyImgDetectTag
                            type='single'
                            taskId={ taskId }
                            file={ selecing }
                            src={ selecing.file_url }
                            onChange={ onFinishSome }
                            height={ clientHeight - 500 }
                            canAction={ User.taskRole > ETaskRole.read }
                            defaultValues={ 
                                !!selecing.values ?
                                    selecing.values.map(( d, k ) => ({
                                        id: k,
                                        x: d.points[ 0 ],
                                        y: d.points[ 1 ],
                                        w: d.points[ 2 ],
                                        h: d.points[ 3 ],
                                        labels: d.label.split(',')
                                    })) :
                                    [ ]
                            }
                        />
                    )
                }

                {/* 音频标注 */}
                {
                    ( !!selecing && template === 'voice' ) && (
                        <MyVoiceLabelText
                            taskId={ taskId }
                            file={ selecing }
                            src={ selecing.file_url }
                            onChange={ onFinishSome }
                            canAction={ User.taskRole > ETaskRole.read }
                            defaultValues={
                                !!selecing.values ?
                                    selecing.values.map( d => ({
                                        label: d.label,
                                        end: Number( d['end-time']),
                                        start: Number( d['start-time'])
                                    })) :
                                    [ ]
                            }
                        />
                    )
                }

                {/* 文本标注 */}
                {
                    ( !!selecing && template === 'txt' ) && (
                        <MyTxtLabelTag
                            taskId={ taskId }
                            file={ selecing }
                            onChange={ onFinishSome }
                            canAction={ User.taskRole > ETaskRole.read }
                            defaultValues={
                                selecing.values || [ ]
                            }
                            params={( selecing.content || '').split('\n')}
                        />
                    )
                }

            </div>

        </div>
    ));
}

type PImgtagUndone = {
    taskId: string
    onChange?: ( ) => void
} 