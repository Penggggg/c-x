import { useCallback } from 'react';
import { http } from '../util/http';
import { useArray } from './useArray';
import { useLoadingJob } from './useLoadingJob';

type TArg< T > = {
    initVal?: T[ ],
    listUrl?: string
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

            http.get( parmas )
                .then( x => {
                    const { status, data } = x;
                    if ( status !== 200 ) { return; }
                    listHandler.set( data );
                })
        },
        [ ]
    );

    /** 列表加载 */
    const [ load, isLoading ] = useLoadingJob(
        arg.listUrl ? 
            load$ :
            ( async ( ) => { })
    );

    return [
        /** 数据：列表 */
        list,
        {
            /** 方法：加载列表 */
            load,
            /** 数据：列表是否加载中 */
            isLoading
        }
    ] as const;
}