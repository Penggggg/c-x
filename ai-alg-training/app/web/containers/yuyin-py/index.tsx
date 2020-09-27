import { http } from '@cvte/ai-web-util/util';
import { Radio, Card, Tag, Alert, List } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { StepsContainer } from '@cvte/ai-web-util/components';
import './index.less';

export const YuyinPY = ({ data, cb, bucket }: YuyinPY) => {
    
    const pysRef = useRef< any >( null );
    const workerRef = useRef< Worker | null >( null );

    const [ loading, loading$ ] = useState( true );
    const [ forms, forms$ ] = useState< any[ ]>([ ]);

    /** worker初始化表单数据 */
    const initCb = data => {
        loading$( false );
        forms$( data.forms );
        pysRef.current = data.all;
    }

    /** worker处理file */
    const fileCb = files  => {
        Promise.all(
            files.map( f => {
                const formData = new FormData( );
                formData.append('file', f );
                formData.append('bucket_name', bucket );
                return http.post< any >({
                    data: formData,
                    url: `/t-apis/voice/uploadLabel`,
                    successMsg: `调整成功`
                }).then( res => res )
            })
        ).then( allRes => {
            const isok = allRes.every(( x: any ) => x.status === 200 );
            loading$( false );
            (!!cb && isok ) && cb( );
        })
        
    }

    /** 表单点击 */
    const onPyChange = ( key, val ) => {
  
        const temp = { ...pysRef.current };
        const [ group, cn, Index ] = key.split('@');
        temp[ group ][ cn ][ Index ] = val;

        pysRef.current = temp;
    }

    /** 提取表单数据 */
    const getForm = ( ) => {
        loading$( true );
        if ( !workerRef.current ) return;
        workerRef.current.postMessage({ type: workerEvt.file, meta: pysRef.current })
    }

    /** 构造web worker */
    useEffect(( ) => {
        const url = window.URL.createObjectURL( new Blob([`
            const onInit = data => {
                const all = { };
                const forms = [ ]; 
                data.map( c => {
                    all[ c.name ] = { };
                    c.pys.map(( py, k ) => {
        
                        const innerForm = [ ];
                        all[ c.name ][ py.cn ] = [ ] 
        
                        py.py.map(( x, kk ) => {
                            if ( !py.cn[ kk ].trim( )) return;
                            innerForm.push({
                                opt: x,
                                group: c.name,
                                default: x[ 0 ],
                                label: py.cn[ kk ],
                                name: c.name + '@' + py.cn + '@' + kk
                            });
        
                            all[ c.name ][ py.cn ].push( x[ 0 ])
                        });
        
                        if ( innerForm.every( x => x.opt.length === 1 )) return;
        
                        forms.push({
                            name: py.cn,
                            group: c.name,
                            innerForm: innerForm.filter( x => x.opt.length > 1 )
                        });
                    });
                });
        
                return { 
                    all,
                    forms 
                }
            };

            const onFile = data => {
                const files = Object.entries( data )
                    .map(([ group, detail ]) => {
                        return new File(
                            [
                                Object
                                    .entries( detail )
                                    .map(([ key, pys ]) => key + ' ' + pys.join(' '))
                                    .join('\\n')
                            ],
                            group + '.txt',
                            { type: 'text/plain', lastModified: Date.now( )}
                        );
                    });
                return files
            }

            this.addEventListener( 'message', ({ data }) => {
                const { type, meta } = data;
                this.postMessage({ 
                    type, 
                    meta: type === 1 ?
                        onInit( meta ) :
                        type === 2 ?
                            onFile( meta ) : null
                })
            }, false );
        `]));

        const worker = new Worker( url );
        workerRef.current = worker;

        // 事件分发
        worker.addEventListener('message', ({ data }) => {
            const { type, meta } = data;
            type === workerEvt.init ? 
                initCb( meta ) : 
                workerEvt.file ?
                    fileCb( meta ) :
                    ( ) => { }
        });

    }, [ ]);

    useEffect(( ) => {
        setTimeout(( ) => {
            if ( !workerRef.current ) return;
            workerRef.current.postMessage({ 
                type: workerEvt.init, 
                meta: data.filter( x => !!x.pys.length )
            })
        }, 100 )
    }, [ data ])

    return (
        <div className='con-yuyin-py'>

            {/* 表单 */}
            <div
            >
                <StepsContainer
                    gap={ 10 }
                    skip={ true }
                    loading={ loading }
                    onFinish={ getForm }
                >
                {
                    forms.map(( f,k ) => (
                        <Card 
                            key={ k }
                            hoverable
                            bordered={ true }
                            headStyle={{ minHeight: 'auto' }}
                            bodyStyle={{ padding: '0px 10px' }}
                            title={`${f.group} - ${f.name}`}
                            style={{ width: 400, margin: k === 0 ? '' : '20px 0' }}
                        >
                            {
                                f.innerForm.map(( i, kk ) => (
                                    <div
                                        key={ kk }
                                    >
                                        <Tag color='blue'>
                                            { i.label }    
                                        </Tag> 
                                        <Radio.Group 
                                            name={`${i.name}`}
                                            options={ i.opt }
                                            defaultValue={ i.default }
                                            style={{ margin: '10px 0 10px 10px' }}
                                            onChange={ e => onPyChange( i.name, e.target.value )}
                                        />
                                    </div>
                                ))
                            }
                        </Card>
                    ))
                }
                </StepsContainer>
            </div>

            {/* 提示 */}
            <div style={{ width: 300 }}>
                <Alert 
                    showIcon 
                    type="info" 
                    message={
                        <div>
                            详细说明 
                        </div>
                    } 
                />
                <List
                    style={{ padding: '15px 10px 0' }}
                >
                    <List.Item>
                        <List.Item.Meta
                            title='音标调整'
                            description={
                                <div>
                                    请手动调整「标红」的数据，这些数据存在异常
                                </div>
                            }
                        />
                    </List.Item>
                </List>
            </div>
        </div>
    )
}

type Py = { 
    cn: string, 
    py: string[ ][ ]
}

type YuyinPY = {
    bucket: string
    data: { 
        pys: Py[ ],
        name: string
    }[ ]
    cb?: ( ) => void
}

enum workerEvt {
    init = 1,
    file
}