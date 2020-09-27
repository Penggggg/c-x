/** 跳转 */
export const openWindowWithPost = ( url: string, data = { }) => {
    const newWindow = window.open( url, 'window-name' );
    const htmlStr = `
        <html>
            <head></head>
            <body>
                <form id='formid' method='post' action=${url}>
                    ${ 
                        Object.entries( data )
                            .map(( e ) => "<input type='hidden' name='" + e[ 0 ] + "' value='" + ( typeof e[ 1 ] === 'string' ? e[ 1 ] : JSON.stringify( e[ 1 ])) + "'/>")
                            .join('')
                    }
                </form>
                <script type='text/javascript'>
                    document.getElementById('formid').submit( )
                </script>
            </body>
        </html>
    `;
    !!newWindow && newWindow.document.write( htmlStr );
}