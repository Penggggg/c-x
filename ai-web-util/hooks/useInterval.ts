import { useState, useEffect } from 'react';


export const useInterval = ( trigger: boolean, time = 1000 ) => {

    /** 回调 */
    const [ cb, cb$ ] = useState(( ) => ( ) => { });

    /** 时间 */
    const [ intervalTime, intervalTime$ ] = useState( time );

    /** timer */
    const [ timer, timer$ ] = useState< any >( null );

    /** 初始化 */
    const initInterval = ( cb: any ) => {
        cb$(( ) => ( ) => cb( ));
    };

    /** 清除定时器 */
    const clearTimer = ( ) => {
        if ( !timer ) { return; }
        try { 
            clearInterval( timer );
            timer$( null );
        } catch { };
    }
    
    /** 判断开关 */
    useEffect(( ) => {
        /** 关闭 */
        if ( !trigger ) { clearTimer( );}

        /** 开启 */
        if ( !!trigger ) {
            timer$( 
                setInterval( cb, intervalTime )
            )
        }
    }, [ trigger ])

    return [ 
        initInterval
    ];
}