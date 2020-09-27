import { http } from '../util';
import { useCallback } from 'react';
import { useArray } from './useArray';
import { useLoadingJob } from './useLoadingJob';

type TArg< T > = {
    initVal?: T[ ],
    listUrl: string
}

export const useList = < T >( arg: TArg< T >) => {

    /** 列表 */
    const [ list, listHandler ] = useArray< T >( arg.initVal || [ ]);

    /** 加载列表 */
    const load$ = useCallback(
        async args => {
            let parmas = { };
            if ( typeof args === 'string' ) {
                parmas = {
                    url: `${arg.listUrl}${args}`
                }
            } else if ( typeof arg === 'object' ) {
                parmas = {
                    ...args,
                    url: arg.listUrl
                };
            }

            const x = await http.get( parmas );
            const { status, data } = x;

            if ( status !== 200 ) { return null; }

            listHandler.set( data );
            return data;
        },
        [ ]
    );

    /** 重置列表 */
    const reset = ( ) => {
        listHandler.set([ ]);
    }

    /** 列表加载 */
    const [ load, isLoading ] = useLoadingJob( load$ );

    return [
        /** 数据：列表 */
        list,
        {
            /** 重置列表 */
            reset,
            /** 方法：加载列表 */
            load,
            /** 数据：列表是否加载中 */
            isLoading
        }
    ] as const;
}