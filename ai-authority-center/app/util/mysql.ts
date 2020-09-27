import * as aiUtil from '@cvte/ai-node-util'

let sqlInstance: aiUtil.Sql;

export const sqlHelper = {
    init: ( conf: any ) => {
        sqlInstance = new aiUtil.Sql( conf )
    },
    get: ( ) => {
        return sqlInstance;
    }
}