const Loading = require('muse-ui-loading').default;

class Loading$ {
    
    public msg( msg: string ): { close: ( ) => { }} {
        return Loading({
            size: 30,
            text: msg,
            color: '#fff',
            className: 'decorate-loading',
            overlayColor: 'rgba( 0, 0, 0, 0.6)',
        });
    }
}

export const loading = new Loading$( );