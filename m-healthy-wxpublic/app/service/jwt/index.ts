
import { Context, Service } from 'egg';
import * as Jwt from 'jsonwebtoken';

/**
 * @method sign 获取签证
 * @method verify 解析签证
 * @method setItem 获取健值
 * @method getItem 设置健值
 */
export default class JwtService extends Service {

    private readonly cookieKey = 'auth';
    private readonly secret = 'm-health-wx';
    private readonly maxAge = 24 * 60 * 60 * 1000;

    /**
     * @prop { account - openid }
     */
    private meta = {
        account: {
            sysid: '',
            openid: '',
            nickname: '',
            sex: 1,
            language: '',
            city: '',
            province: '',
            country: '',
            headimgurl: '',
            privilege: []
        }
    };

    constructor( ctx: Context ) {
        super( ctx );
    }

    async setItem( key, value ) {
        const clientMeta = await this.verify( this.ctx.cookies.get( this.cookieKey ));
        const content: any = clientMeta || this.meta;
        const keysArr = key.split('.');
        if ( keysArr.length === 1 ) {
            content[ keysArr[ 0 ]] = value;
        } else {
            const copyArr = keysArr.splice( 0, keysArr.length - 1 );
            const inner = copyArr.reduce(( c, p) => c[ p ], content );
            inner[ keysArr[ keysArr.length - 1 ]] = value;
        }
        return this.sign( content );
    }

    async getItem( key ) {
        const clientMeta = await this.verify( this.ctx.cookies.get( this.cookieKey ));
        const content:any = clientMeta || this.meta;
        const keysArr = key.split('.');
        if ( keysArr.length === 1 ) {
            return content[ keysArr[ 0 ]];
        } else {
            const copyArr = keysArr.splice( 0, keysArr.length - 1 );
            const inner = copyArr.reduce(( c, p) => c[ p ], content );
            return inner[ keysArr[ keysArr.length - 1 ]];
        }
    }

    private async sign( content: any, options = { }) {
        return new Promise( resolve => {
            const token = Jwt.sign( content, this.secret, options );
            this.ctx.cookies.set( this.cookieKey, token, { maxAge: this.maxAge });
            resolve( );
        });
    }

    private async verify( token ) {
        return new Promise( resolve => {
            Jwt.verify( token, this.secret, ( err, decode ) => {
                resolve( err ? null : decode );
            })
        })
    }

}