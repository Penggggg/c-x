import { http } from '../util';
import { useCallback } from 'react';
import { useObject } from './useObject';
import { useLoadingJob } from './useLoadingJob';

type TArg< T > = {
    initVal?: T,
    url: string
}

export const useFetch = < T >( arg: TArg< T >) => {

    /** 列表 */
    const [ obj, objHandler ] = useObject< T >( arg.initVal || { });

    /** 加载列表 */
    const load$ = useCallback(
        async args => {
            let parmas = { };
            if ( typeof args === 'string' ) {
                parmas = {
                    url: `${arg.url}${args}`
                }
            } else if ( typeof arg === 'object' ) {
                parmas = {
                    ...args,
                    url: arg.url
                };
            }

            const x = await http.get( parmas );
            const { status, data } = x;

            if ( status !== 200 ) { return null; }

            objHandler.set( data );
            return data;
        },
        [ ]
    );

    /** 重置 */
    const reset = ( ) => {
        objHandler.set({ });
    }

    /** 列表加载 */
    const [ load, isLoading ] = useLoadingJob( load$ );

    return [
        /** 数据：列表 */
        obj,
        {
            /** 重置 */
            reset,
            /** 方法：加载列表 */
            load,
            /** 数据：列表是否加载中 */
            isLoading
        }
    ] as const;
}