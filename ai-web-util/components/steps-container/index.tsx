import React, { useMemo, useState } from 'react';
import { Button, Icon, Tooltip } from 'antd';

export const StepsContainer = ({ children, gap = 1, onFinish, loading, skip = false }: StepsContainer ) => {

    const [ step, step$ ] = useState( 0 );

    const jump = ( type: Step ) => {
        if ( type === Step.pre && !step ) return;
        step$( type === Step.next ? step + 1 : step - 1 );
    }

    const children$ = useMemo(( ) => {
        const start = ( step - 1 ) * gap + gap;
        return children.slice( start, start + gap )
    }, [ children, gap, step ])

    const showNext$ = useMemo(( ) => {
        return step * gap + gap < children.length;
    }, [ children, gap, step ])

    return (
        <div className='com-steps-con'>

            { children$ }
            
            <div 
                style={{ marginTop: 25, paddingLeft: 20 }}
            >
                {
                    children$.length > 0 && (
                        <Tooltip
                            title='上一页'
                        >
                            <Button 
                                ghost
                                size='small'
                                type='primary' 
                                loading={ loading }
                                style={{ marginRight: 15 }}
                                onClick={( ) => jump( Step.pre )}
                            >
                                <Icon type='double-left' />
                            </Button>
                        </Tooltip>
                    )
                }
                
                {
                    ( showNext$ && children$.length > 0 ) && (
                        <Tooltip
                            title='下一页'
                        >
                            <Button 
                                size='small'
                                type='primary' 
                                loading={ loading }
                                style={{ marginRight: 15 }}
                                onClick={( ) => jump( Step.next )}
                            >
                                Next
                                <Icon type='double-right' />
                            </Button>
                        </Tooltip>
                    )
                }

                {
                    ( !showNext$ && children$.length > 0 ) && (
                        <Button 
                            size='small'
                            type='primary' 
                            loading={ loading }
                            style={{ marginRight: 15 }}
                            onClick={( ) => !!onFinish && onFinish( )}
                        >
                            完成
                            <Icon type='arrow-right' />
                        </Button>
                    )
                }

                {
                    ( skip!! || children$.length === 0 ) && (
                        <Tooltip
                            title='跳过'
                        >
                            <Button 
                                ghost
                                size='small'
                                type='primary' 
                                loading={ loading }
                                onClick={( ) => !!onFinish && onFinish( )}
                            >
                                { !children$.length ? '跳过' : '' }
                                <Icon type='arrow-right' />
                            </Button>
                        </Tooltip>
                    )
                }
                
            </div>
        </div>
    )
}

type StepsContainer = {
    gap?: number
    skip?: boolean
    children: any[ ]
    loading: boolean
    onFinish?: ( ) => void
}

enum Step {
    pre,
    next
}