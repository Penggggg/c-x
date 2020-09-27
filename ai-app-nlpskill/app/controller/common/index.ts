import * as Minio from 'minio';
import { Context } from 'koa';
import * as aiUtil from '@cvte/ai-node-util'

const { isKeysEmpty } = aiUtil.decorator;

class CommonCtrl {

    public async test( ctx: Context ) {
        const { minio } = ctx.service.common.helpers.nacosConf;
        return ctx.service.common.back( 1 )
    }

}

export default new CommonCtrl( );