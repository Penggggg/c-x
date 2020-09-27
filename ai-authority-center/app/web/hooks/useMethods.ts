import { useMemo, useState } from 'react';

type TMethodsCon< T > = {
    [ P in keyof T ]: ( arg?:any ) => void
}

/**
 * 数据类型的，Hooks生成函数
 */
export const useMethods = < T, B >( initialVal: T , methods: B ): [ T, TMethodsCon< B >] => {

    let methodsCon: any = { };
    const [ val, setVal ] = useState( initialVal );
    const boundMethods = useMemo(
        ( ) =>  Object
                .entries( methods )
                .reduce(( lastCon, [ name, fn ]) => {
                        lastCon[ name ] = ( ...args: any[ ]) => {
                            setVal( v => fn( v, ...args ));
                        };
                        return lastCon;
                    },
                    methodsCon
                )
        ,
        [ methods ]
    );
    return [ val, boundMethods ];
};