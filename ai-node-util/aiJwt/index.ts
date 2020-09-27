import * as Jwt from 'jsonwebtoken';

const secret = 'cvte-ai-jwt.@123=jalkj(=s';

const sign = async ( content: any ) => {
    return Jwt.sign( content, secret, { });
}

const verify = async ( token: string ): Promise<any> => {
    return new Promise( r => {
        Jwt.verify( token, secret, ( err, content ) => {
            r( err ? null : content );
        })
    })
}

export const AiJwt = {
    sign,
    verify
}