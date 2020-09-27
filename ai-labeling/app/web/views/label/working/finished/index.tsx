import { toJS } from 'mobx';
import { message } from 'antd';
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

import './index.less';

export const Finished = ({ taskId }: PImgtagFinished ) => {

    /** 图片列表长度 */
    const pageSize = 10;
    const history = useHistory( );
    const { LabelImg, User } = useStore( );

    /** 浏览器窗口 */
    const [ clientHeight, clientHeight$ ] = useState( 0 );

    /** 更新过的文件列表 */
    const updatedFilesRef = useRef< any[ ]>([ ]);

    /** 当前的模板类型 */
    const [ template, template$ ] = useState('');

    /** 选中、正在编辑的图片 */
    const selecingRef = useRef< any >( null );
    const [ selecing, selecing$ ] = useState< any >( null )

    /** 拉取的列表 */
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

    const setSelecting = target => {
        selecing$( target );
        selecingRef.current = target;
    }

    /** 获取列表，后台不会上锁 */
    const fetchList = ( page_num = 1 ) => {
        list$.load({
            params: {
                page_num,
                page_size: pageSize,
                label_task_id: taskId,
                data_type: 'labeled'
            }
        }).then( data => {
            const defaultFile = data.results[ 0 ];

            /** 如果没有入口文件则，自动选中第一张 */
            if (( !!defaultFile && !selecingRef.current ) || page_num > 1 ) {
                lock([ defaultFile.id ])
                    .then(( ) => {
                        setSelecting( defaultFile );
                    });
            }
            updatedFilesRef.current = [ ]
        })
    }

    /** 翻页 */
    const onPageChange = ( type: 'pre' | 'next', cb ) => {
        /** 先解锁 */
        unLock([ selecingRef.current.id ])
            .then( r => {
                if ( !r ) { return;}

                const pageNum = list.pagination.page_num;
                const nextPage = type === 'pre' ? pageNum - 1 : pageNum + 1;

                // 拉取
                fetchList( nextPage );
                cb( )
            })
    }

    /** 加锁某一张 */
    const lock = async ids => {

        if ( !ids || ( Array.isArray( ids ) && ids.length === 0 )) { 
            return true; 
        }

        message.info('初始化中...');
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

    /** 释放某一张 */
    const unLock = async ids => {

        if ( !ids || ( Array.isArray( ids ) && ids.length === 0 )) { return true }
        return http.post({
            data: {
                data_id_list: ids,
                label_task_id: taskId
            },
            url: `/t-apis/admin/labeltask/release_lock`
        }).then( res => {
            return res.status === 200
        })
    }

    /** 从图片列表，选中某张图片 */
    const onSelectImg = ( selectd, k, cb ) => {

        const updatedFiles = [ ...updatedFilesRef.current ];
        const target = 
            updatedFiles.find( x => x.file_url === selectd || x.id === selectd ) ||
            jobList$.find( x => x.file_url === selectd || x.id === selectd );
        
        /** 释放上一个 */
        if ( !!selecing ) {
            unLock([ selecing.id ])
        }

        /** 加锁 */
        lock([ target.id ])
            .then( r => {
                if ( !!r ) { 
                    cb( );
                    setSelecting( target );
                }
            })
    }

    /** 更新了某一个文件 */
    const onUpdateSome = ( changeData ) => {
        const { values, data_id } = changeData;
        let updatedFiles = [ ...updatedFilesRef.current ];

        const updatedTarget = {
            ...selecing,
            values
        };
        const Index = updatedFiles.findIndex( x => x.id === data_id );

        if ( Index !== -1 ) {
            updatedFiles.splice( Index, 1, updatedTarget )
        } else {
            updatedFiles = [
                ...updatedFiles,
                updatedTarget
            ];
        }
        updatedFilesRef.current = updatedFiles;
    }

    /** 
     * 展示的列表 
     * 这里都是已经上了锁的
     */
    const jobList$ = useComputed(( ) => {

        // 只有第一页的时候，才把入口文件 插入进来
        const pageNum = list.pagination.page_num;
        // 入口默认文件
        const selectedFile = LabelImg.selectedEntryFile;

        let defaultList = ( list.results || [ ]).filter( x => x.id !== (selectedFile || { }).id );

        // 插入
        if ( pageNum === 1 && !!selectedFile ) {
            defaultList = [
                selectedFile,
                ...defaultList
            ]
        }
        
        return defaultList;
    }, [ list, LabelImg.selectedEntryFile ]);

    /** didMount */
    useEffect(( ) => {

        const defautlFile = LabelImg.selectedEntryFile;
        const { template } = parseQuery( history.location.search );
        
        template$( template );
    
        /** 如果有入口文件，则自动选中 */
        if ( !!defautlFile ) {
            lock([ defautlFile.id ])
                .then(( ) => {
                    setSelecting( defautlFile );
                    fetchList( );
                })
        } else {
            fetchList( );
        }
        
        /** 离开页面 */
        return ( ) => {
            !!selecingRef.current && unLock([ selecingRef.current.id ])
        }
    }, [ ]);

    /** didMount， 浏览器窗口 */
    useEffect(( ) => {
        clientHeight$( document.body.clientHeight );
    }, [ ]);

    // useEffect(( ) => {
    //     console.log( toJS( selecing ))
    // }, [ selecing ]);

    return useObserver(( ) => (
        <div 
            className='p-working-finished'
        >
            
            {/* 选择列表 */}
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

            {/* 标签标注 */}
            <div className='label-block' >
                {
                    ( !!selecing && template === 'img-tag' && clientHeight ) && (
                        <MyImgLabelTag
                            type='single'
                            taskId={ taskId }
                            file={ selecing }
                            src={ selecing.file_url }
                            onChange={ onUpdateSome }
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
                            onChange={ onUpdateSome }
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
                            canAction={ User.taskRole > ETaskRole.read }
                            onChange={ onUpdateSome }
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
                    ( !!selecing && template === 'txt' && selecing.values.length > 0 ) && (
                        <MyTxtLabelTag
                            taskId={ taskId }
                            file={ selecing }
                            onChange={ onUpdateSome }
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

type PImgtagFinished = {
    taskId: string

} 