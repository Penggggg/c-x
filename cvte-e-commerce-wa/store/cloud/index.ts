import { http } from '../../utils/http';
import { watch } from '../../utils/watch';
import { cloudHttp } from '../../utils/cloudHttp';

/**
 * @deprecated
 * 云服务
 * 
 */
class Cloud {

    private cloudEnv = undefined;

    public initCloud( ) {
        return new Promise(( resolve, reject ) => {
            wx.cloud.init({
                traceUser: true,
                env: this.cloudEnv
            });
            resolve( );
        });
    }

}

export default watch<Cloud>( 'Cloud', new Cloud( ));
 