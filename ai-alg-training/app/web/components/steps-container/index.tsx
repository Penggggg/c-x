import React, { useMemo, useState } from 'react';
import { Button, Icon, Tooltip } from 'antd';

export const StepsContainer = ({ children, gap, cb }: StepsContainer ) => {

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
                style={{ marginTop: 15, paddingLeft: 20 }}
            >
                <Tooltip
                    title='上一页'
                >
                    <Button 
                        ghost
                        size='small'
                        type='primary' 
                        style={{ marginRight: 15 }}
                        onClick={( ) => jump( Step.pre )}
                    >
                        <Icon type='double-left' />
                    </Button>
                </Tooltip>

                {
                    showNext$ && (
                        <Tooltip
                            title='下一页'
                        >
                            <Button 
                                size='small'
                                type='primary' 
                                onClick={( ) => jump( Step.next )}
                            >
                                Next
                                <Icon type='double-right' />
                            </Button>
                        </Tooltip>
                    )
                }

                {
                    !showNext$ && (
                        <Button 
                            size='small'
                            type='primary' 
                            onClick={( ) => !!cb && cb( )}
                        >
                            完成
                            <Icon type='arrow-right' />
                        </Button>
                    )
                }
                
            </div>
        </div>
    )
}

type StepsContainer = {
    gap: number
    children: any[ ]
    cb?: ( ) => { }
}

enum Step {
    pre,
    next
}