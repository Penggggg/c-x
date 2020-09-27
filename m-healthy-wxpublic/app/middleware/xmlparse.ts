import * as bodyParser from 'body-parser';

export default async ( ctx, next ) => {
    ctx.app.use( bodyParser.urlencoded({
        extended: true
      }));  
    await next( );
}