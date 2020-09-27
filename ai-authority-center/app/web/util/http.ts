import axios from 'axios';
import { message } from 'antd';

type IHttpResult<T> = {
    data: T
    status: 200 | 400 | 500
}

interface IHttp {
    get< T >( opts: any ): Promise<IHttpResult< T >>
    post< T >( opts: any ): Promise<IHttpResult< T >>
    put< T >( opts: any ): Promise<IHttpResult< T >>
    delete< T >( opts: any ): Promise<IHttpResult< T >>
    originFetch< T >( opts: any ): Promise<IHttpResult< T >>
}

class Http implements IHttp {

    public get< T >( opts: any ) {
        return this.originFetch< T >({
            ...opts,
            method: 'get'
        })
    }

    public post< T >( opts: any ) {
        return this.originFetch< T >({
            ...opts,
            method: 'post'
        })
    }

    public put< T >( opts: any ) {
        return this.originFetch< T >({
            ...opts,
            method: 'put'
        })
    }

    public delete< T >( opts: any ) {
        return this.originFetch< T >({
            ...opts,
            method: 'delete'
        })
    }

    /** 公共的方法 */
    public originFetch< T >( opts: any ): Promise<IHttpResult< T >> {
        return axios( opts )
            .then( res => {
                const { status } = res.data;
                if ( !!status && status === 200 ) {
                    message.success('请求成功～', 1 )
                } else if ( !!status && status !== 200 ) {
                    message.warning( res.data.message || res.data.msg || '请求失败', 3 );
                }
                return res.data
            });
    }
}

export const http =  new Http( );