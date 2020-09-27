import * as Minio from 'minio';
import { Context } from 'koa';

/** Node直传 */
export const post = ( conf: minioConf ) => {
    return async ( ctx: Context ) => {
        try {
            const { bucket, endPoint, port } = conf;
            const client = new Minio.Client( conf ); 
            const exists = await client.bucketExists( bucket );
            const files: any = (ctx as any).request.files || ((ctx as any).request.body || { }).files;

            if ( !exists ) {
                await client.makeBucket( bucket, 'us-east-1' );
            }

            const reult = await Promise.all(
                Object.keys( files )
                    .map( async fileKey => {
                        const { name, path } = files[ fileKey ];
                        await client.fPutObject( bucket, name, path, { });
                        return `${endPoint}:${port}/${bucket}/${name}`;
                    })
            );

            return ctx.body = {
                status: 200,
                data: reult.length === 1 ? reult[ 0 ] : reult
            }
        } catch ( e ) {
            return ctx.body = {
                status: 500,
                message: e
            }
        }
    }
}

/** 获取签名，客户端直传 */
export const preSign = async ( conf: minioConf, files: {[ fileKey: string ]: any }) => {
    try {
        const { bucket } = conf;
        const client = new Minio.Client( conf ); 
        const exists = await client.bucketExists( bucket );

        if ( !exists ) {
            await client.makeBucket( bucket, 'us-east-1' );
        }

        const reult = await Promise.all(
            Object.keys( files )
                .map( async fileKey => {
                    const { name } = files[ fileKey ];
                    return await client.presignedPutObject( bucket, name, 24 * 60 * 60 )
                })
        );

        return reult.length === 1 ? reult[ 0 ] : reult
    } catch ( e ) {
        return e
    }
}

type minioConf = {
    port: number,
    endPoint: string,
    accessKey: string,
    secretKey: string,
    useSSL: boolean,
    bucket: string,
}

export const aiMinio = {
    post,
    preSign
}