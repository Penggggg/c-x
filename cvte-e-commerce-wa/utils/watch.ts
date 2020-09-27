/** 旧数据集合 */
let oldDataset: {
    [ key: string ]: any
} = { };

/** 监听函数的集合 */
export let watchCallBack: {
    [ key: string ]: Array<( val1: any, val2?: any ) => void>
} = { };

/** 添加监听函数 */
export const pushCb = ( key: string, cb: ( val1: any, val2: any ) => void ) => {
    if ( !!watchCallBack[ key ]) {
        watchCallBack[ key ].push( cb );
    } else {
        watchCallBack[ key ] = [ cb ];
    }
}

/** 监听函数 */
export function watch<T>( name: string, target: any ): T {

    oldDataset = Object.assign({ }, oldDataset, {
        [ name ]: JSON.parse( JSON.stringify( target ))
    });

    Object.keys( target ).map( propsName => {
        Object.defineProperty( target, propsName, {
            configurable: true,
            enumerable: true,
            set: function( val ) {
                oldDataset = Object.assign({ }, oldDataset, {
                    [ name ]: Object.assign({ }, oldDataset[ name ], {
                        [ propsName ]: val
                    })
                });
                setTimeout(( ) => {
                    console.log('【---- Property Set ----】', propsName, ':', val );
                    if ( Array.isArray( watchCallBack[`${name}.${propsName}`])) {
                        watchCallBack[ `${name}.${propsName}` ].map( func => func( val ));
                    }
                }, 50 );
            },
            get: function( ) {
                return oldDataset[ name ][ propsName ];
            }
        });
    });
    return target;

}

/** 获取值 */
export function getVal( key: string ) {
    return key.split('.').reduce(( x, y ) => ( x as any )[ y ], oldDataset );
}

/** 更新值 */
export function updateVal( key: string, val: any ) {

    const targetKey = key.split('.')[ key.split('.').length - 1 ];
    const beforeTargetKeys = key.split('.').slice( 0, key.split('.').length - 1 ).join('.');

    const target = beforeTargetKeys.split('.').reduce(( x, y ) => ( x as any)[ y ], oldDataset );
    target[ targetKey ] = val;

    // 触发回调
    if ( Array.isArray( watchCallBack[ key ])) {
        watchCallBack[ key ].map(func => func( val ));
    }
}