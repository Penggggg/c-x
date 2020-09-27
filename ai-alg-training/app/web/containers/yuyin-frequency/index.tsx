import React, { useState, } from 'react';
import { http } from '@cvte/ai-web-util/util';
import { Input, Button, Icon, Alert, List, notification } from 'antd';
import './index.less';

// 语音标注，句频调整
export const YuyinFrequency = ({ bucket, cb, filename = 'train_generate.txt' }: YuyinFrequency ) => {

    const [ val, val$ ] = useState('');

    const [ loading, loading$ ] = useState( false );

    const err = description => {
        notification.error({
            message: '提示',
            description
        });
        return false;
    }

    const onSure = ( ) => {

        const sentence: any[ ] = [ ];
        const frequency: any[ ] = [ ];

        const result = val
            .split('\n')
            .filter( x => !!x )
            .map( s => {
                const fre = Number( s[ 0 ]);
                const sen = s.slice( 1 ).trim( );
                
                if ( !sen ) return err('句子内容不能为空')
                if ( !( fre >= 0 )) return err('每行第1位为数字');

                sentence.push( sen );
                frequency.push( fre );

                return true;
        });
        if ( result.some( x => !x )) return;

        loading$( true );
        http.post< any >({
            data: {
                sentence,
                frequency,
                bucket_name: bucket,
                file_name: filename
            },
            successMsg: '调整成功',
            url: `/t-apis/voice/trim`
        }).then(({ status }) => {
            if ( status !== 200 ) return;
            !!cb && cb( );
        })
    }

    return (
        <div className='con-yuyin-frequency'>

            <div>
                <div>
                    <Input.TextArea
                        rows={ 10 } 
                        style={{ 
                            width: 400,
                            marginBottom: 15 
                        }}
                        value={ val }
                        placeholder='请按提示，输入正确格式。回车换行'
                        onChange={ e => val$( e.target.value )}
                    />
                </div>

                <div style={{ marginTop: 20 }}>
                    <Button 
                        type="primary"
                        onClick={ onSure }
                        loading={ loading }
                    >
                        确认
                    </Button>
                    <Button 
                        ghost
                        type="primary"
                        style={{ marginLeft: 25 }}
                        onClick={( ) => !!cb && cb( )}
                    >
                        跳过
                        <Icon type="double-right" />
                    </Button>
                </div>
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
                            title='调整句频'
                            description={
                                <div>
                                    可调整上一步训练文本中的句频
                                </div>
                            }
                        />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta
                            title='句频格式'
                            description={
                                <div>
                                    频率（数字）+ 空格 + 句子内容，如：
                                    <pre>{`
3 把 主页 打开
2 把 主页 关闭
                                    `}</pre>
                                </div>
                            }
                        >
                        </List.Item.Meta>
                    </List.Item>
                </List>
            </div>
        </div>
    );
}

type YuyinFrequency = {
    cb?: ( ) => void
    bucket: string
    filename?: string
}