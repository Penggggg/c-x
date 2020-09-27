import * as koa from 'koa';
import * as aiUtil from '@cvte/ai-node-util'
import constants from './app/util/constans';

/**
 * 声明合并（@types/koa）
 */
declare module 'koa' {
    interface BaseContext {
        service: {
            common: import('./app/service/common/index').default
        },
        request: {
            body?: any
        }
    }
}

/**
 * 注入到ctx.service的变量
 */
declare type TSeriviceHelper = {
    [ key: string ]: any,
    mysql: aiUtil.Sql,
    constants: typeof constants,
    nacosConf: any
}

/**
 * 数据库相关
 */
declare namespace Db {
    export type tables = typeof constants.tableNames
    export type appTable = typeof constants.appTable
    export type roleTable = typeof constants.roleTable
    export type btnsTable = typeof constants.btnsTable
    export type pagesTable = typeof constants.pagesTable
    export type systemTable = typeof constants.systemTable
    export type authBtnsTable = typeof constants.authBtnsTable
    export type authUsersTable = typeof constants.authUsersTable
    export type authPagesTable = typeof constants.authPagesTable
    export type pageModuleTable = typeof constants.pageModuleTable
}

/**
 * 系统层级的相关字段
 */
declare namespace System {

    /**
     * 表结构
     */
    export type tableKeys = typeof constants.systemTable
}