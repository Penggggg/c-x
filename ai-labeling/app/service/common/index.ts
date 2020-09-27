import uuid from 'uuid';
import { BaseContext } from 'koa';
import { TSeriviceHelper, Db } from '../../../global';

const axios = require('axios');
const ciac = require('@cvte/ciac');

interface ICommonService {
    readonly ctx: BaseContext,
    readonly helpers?: TSeriviceHelper
    back: ( arg?: any ) => void
    sql: ( arg: string ) => void
    sql_add: < T >( tableName: keyof Db.tables, keyArr: (keyof T)[ ], dataMeta: {[ key: string ]: any }) => { _id: string, sql: string }
    sql_update: < T >( tableName: keyof Db.tables, keyArr: (keyof T)[ ], dataMeta: {[ key: string ]: any },  where: any) => { sql: string }
    getIac: ( ) => Promise< string >
    getJwt: ( ) => Promise<{
        [ key: string ]: string
    }>
}

/**
 * 通用服务
 */
export default class CommonService implements ICommonService {

    readonly ctx!: BaseContext;

    readonly helpers: TSeriviceHelper;

    constructor( ctx: BaseContext, helpers: TSeriviceHelper ) {
        this.ctx = ctx;
        this.helpers = helpers;
    }

    /**
     * @description 
     * 获取iac 
     */
    public async getIac( ) {
        const { nacosConf } = this.helpers;

        if ( !nacosConf.iac ) {
            throw 'iac配置缺失，请补充！'
        }

        const { id, secrect } = nacosConf.iac;
        return await ciac.getToken( id, secrect );
    }

    /**
     * @description
     * 获取jwt
     */
    public async getJwt( account = 'hezhuopeng' ) {
        const { nacosConf } = this.helpers;

        if ( !nacosConf.hosts ) {
            throw 'host配置缺失，请补充！'
        }

        const { jwt } = nacosConf.hosts;
        const iac = await this.getIac( );

        const req = await axios({
            method: 'post',
            url: `${jwt}/v1/token`,
            headers: {
                'x-iac-token': iac
            },
            data: {
                sub: account,
                timeout: "99999999",
                account: {
                    account
                }
            }
        });
        return {
            'x-iac-token': iac,
            'access-token': iac,
            'x-auth-token': req.data.data
        };
        
    }

    /** 
     * @description
     * 双授权转发 
     */
    async transfer( data: any ) {
        try {
            const headers = await this.getJwt( );
            const req = await axios({
                ...data,
                headers: {
                    ...( data.headers || { }),
                    ...headers
                }
            });
            return req.data.data;
        } catch ( e ) {
            throw e;
        }
    }
    
    /**
     * @description
     * 执行sql
     */
    public sql( arg: string ) {
        return this.helpers.mysql.sql( arg )
    }

    /**
     * @description
     * 解析sql的创建语句，会自动插入uuid
     * 
     * tableName: 表名称，
     * keyArr: 要插入的字段，
     * dataMeta: 提供数据的对象
     * custom_id：自定义的 _id
     */
    public sql_add< T >( tableName: keyof Db.tables, keyArr: (keyof T)[ ], dataMeta: any, custom_id?: string ) {
        const _id = uuid.v4( );
        const sql = `insert into ${tableName} (
            ${
                [
                    '_id',
                    ...keyArr
                        .filter( key => {
                            return dataMeta[ key ] !== undefined
                        })
                ].join(',')
            }
        ) VALUES (
            ${
                [
                    `'${ custom_id || _id }'`,
                    ...keyArr
                        .filter( key => {
                            return dataMeta[ key ] !== undefined
                        })
                        .map( key => "'" + dataMeta[ key ] + "'" || null )
                    
                ].join(',')
            }
        )`;
        return {
            sql,
            _id: custom_id ||_id
        }
    }

    /**
     * @description
     * 解析sql的更新语句
     * 
     * tableName: 表名称，
     * keyArr: 要插入的字段，
     * dataMeta: 提供数据的对象
     */
    public sql_update< T >( tableName: keyof Db.tables, keyArr: (keyof T)[ ], dataMeta: any, where: any ) {
        const idKey = Object.keys( where )[ 0 ];
        const sql = `update ${tableName} set 
            ${
                [
                    ...keyArr
                        .filter( key => {
                            return dataMeta[ key ] !== undefined
                        })
                        .map( key => {
                            return `${key} = ${ typeof dataMeta[ key ] === 'number' ? dataMeta[ key ] : "'" + dataMeta[ key ] + "'" }`
                        })
                ].join(',')
            }
        where ${idKey} = '${where[ idKey ]}'`;
        return {
            sql
        }
    }

    /**
     * @description
     * 客户端返回内容 + status: 200
     */
    public back( data?: any ) {
        return this.ctx.body = {
            data,
            status: 200
        }
    }

}