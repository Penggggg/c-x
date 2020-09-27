import Icon from 'antd/es/icon';
import React, { useMemo } from 'react';
import './index.less';

/**
 * 
 * @description
 * 2个点之间的连线
 */
export const Ptr2Line = ({ sx, sy, ex, ey, desc = '', color = '#bfbfbf', onDelete }: Ptr2Line ) => {

    const _onKeyDown = ( e: any ) => {
        if ( e.keyCode === 8 ) {
            !!onDelete && onDelete({ sx, sy, ex, ey })
        }
    }

    const height$ = useMemo(( ) => {
        return Math.sqrt( Math.pow(( ex - sx ), 2 ) + Math.pow(( ey - sy ), 2));
    }, [ sx, sy, ex, ey ])

    const deg$ = useMemo(( ) => {
        if ( !( ex - sx )) return 0;
        const delX = ex - sx;
        const delY = ey - sy;
        const deg = -( 90 - 360 * Math.atan( delY /delX )/( 2 * Math.PI ));
        return ex - sx > 0 ? deg : deg - 180;
    }, [ sx, sy, ex, ey ])

    return (
        <div
            tabIndex={ -1 }
            className='com-ptr2-line'
            style={{
                top: sy,
                left: sx,
                height: height$,
                borderLeft: `2px dashed ${color}`,
                transform: `rotate(${ deg$ }deg)`
            }}
            onKeyDown={ _onKeyDown }
        >
            <div 
                className='desc'
                style={{
                    transform: `rotate(${ -deg$ }deg)`
                }}
            >
                { desc }
            </div>
            <div
                className='point-icon-con'
            >
                <Icon 
                    type='arrow-down' 
                    className='point-icon'
                />
            </div>
        </div>
    )
}

type Ptr2Line = {
    sx: number,
    sy: number,
    ex: number,
    ey: number,
    desc?: string
    color?: string
    onDelete?: ( p: { 
        sx: number,
        sy: number,
        ex: number,
        ey: number,
    }) => void
}