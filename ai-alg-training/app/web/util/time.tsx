

/** 转换为 可读中文 */
export const transferTime2CN = ( data: any ) => {
    try {   

        if ( !data ) { return; }

        const t = new Date( data );
        const y = t.getFullYear( );
        const m = t.getMonth( ) + 1;
        const d = t.getDate( );
        const h = t.getHours( );
        const mm = t.getMinutes( );

        const fixZeor = n => String( n ).length === 1 ? `0${n}` : `${n}`;

        return `${fixZeor( y )}-${fixZeor( m )}-${fixZeor( d )} ${fixZeor( h )}:${fixZeor( mm )}`

    } catch ( e ) {
        console.log(`transferTime Error`);
        return ''
    }
}