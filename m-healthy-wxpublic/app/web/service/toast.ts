const MuseUIToast = require('muse-ui-toast').default;

class MyToast {

    public message( msg: string ) {
        this.origin( 'message', msg );
    }
    
    public success( msg: string ) {
        this.origin( 'success', msg );
    }

    public info( msg: string ) {
        this.origin( 'info', msg );
    }

    public warning( msg: string ) {
        this.origin( 'warning', msg );
    }

    public error( msg: string ) {
        this.origin( 'error', msg );
    }

    private origin( type, msg: string ) {
        MuseUIToast.config({
            position: 'top', 
        });
        MuseUIToast[ type ]( msg );
    }

}

export const $toast = new MyToast( );