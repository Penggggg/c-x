import axios from 'axios';
import { notification } from 'antd';

type IHttpResult<T> = {
    data: T
    status: 200 | 400 | 500
    [ key: string ]: any 
}

interface IHttp {
    statusRules: StatusRule[ ]
    addStatusRule: ( rules: StatusRule[ ]) => void
    get< T >( opts: any ): Promise<IHttpResult< T >>
    post< T >( opts: any ): Promise<IHttpResult< T >>
    put< T >( opts: any ): Promise<IHttpResult< T >>
    delete< T >( opts: any ): Promise<IHttpResult< T >>
    originFetch< T >( opts: any ): Promise<IHttpResult< T >>
}

class Http implements IHttp {

    public statusRules: StatusRule[ ] = [ ];

    public addStatusRule( rules: StatusRule[ ]) {
        this.statusRules = [ ...rules, ...this.statusRules ];
    }

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

                // 自定义状态
                this.statusRules.map( r => {
                    !!r.status( status ) && r.cb( );
                })

                if ( !!status && status === 200 ) {
                    if ( !!opts.successMsg ) {
                        notification.success({
                            message: '提示',
                            description: opts.successMsg 
                        });
                    }
                } else if ( !!status && status !== 200 && status !== 0 && status !== '200' && status !== '0' ) {
                    if ( opts.errorTips !== false ) {
                        notification.error({
                            message: '提示',
                            description: res.data.message || res.data.msg || '请求失败'
                        });
                    }
                }
                return res.data
            });
    }
}

export const http =  new Http( );

type StatusRule = {
    cb: ( ) => any
    status: ( status: any ) => boolean,
}