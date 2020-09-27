import { BaseContext } from 'koa';

/**
 * 把一个对象里面
 * 返回其值为空的一些keys
 */
const checkKeys = < T >( keyArr: (keyof T)[ ], obj: T ) => {
    const failKeys = keyArr.filter( x => {
        return obj[ x ] === undefined || obj[ x ] === null
    });
    return failKeys.join(',');
}

type TisKeysEmpty = {
    body?: string,
    query?: string
}

/**
 * 若指定的key为空，则返回客户端错误
 */
export const isKeysEmpty = ( params: TisKeysEmpty = { }) => {
    return ( target: object, name: string, descriptor: PropertyDescriptor ) => {

        const olaValue = descriptor.value;

        // 在原代码基础上，拓展一些功能
        descriptor.value = function( ctx: BaseContext ) {
            
            if ( !!isKeysEmpty ) {
                const bodyCheck = checkKeys(( params.body || '' ).split(','), (ctx as any).request.body || { });
                const queryCheck = checkKeys(( params.query || '' ).split(','), ctx.query || { });
                if ( !!bodyCheck || !!queryCheck ) {
                    return ctx.body = {
                        status: 400,
                        message: `${ queryCheck ? 'Query: ' + queryCheck + ' is Required' : '' }${ bodyCheck ? ' Body: ' + bodyCheck + ' is Required' : '' }`
                    }
                }
            }
            return olaValue.apply( this, arguments );
        }
        return descriptor;
    }
}


