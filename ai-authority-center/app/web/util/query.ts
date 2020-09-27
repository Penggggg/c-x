export const parseQuery = ( s: string ): any => {
    if ( !s ) { return { };}
    try {
        let obj = { };
        const metaStr = s.startsWith('?') ? s.slice( 1 ) : s;
        const metaArr = metaStr.split('&');
        metaArr.map(( x: any ) => {
            const [ key, val ] = x.split('=');
            obj = {
                ...obj,
                [ key ]: val
            }
        });
        return obj;
    } catch ( e ) {
        return { };
    }
}