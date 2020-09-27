import { http } from '../../utils/http';
import { watch } from '../../utils/watch';
import { cloudHttp } from '../../utils/cloudHttp';
import config from '../../config/index';
import { StorageKey } from '../../utils/constant';


/**
 * @deprecated
 * 通用
 * 
 */
class Common {

    /** 是否为iphonex */
    public isIPhoneX = false;

    /** 客服电话 */
    public customerService = '4009316825';

    /** 获取用户设备信息 */ 
    public judgeIPhoneX( ){
        wx.getSystemInfo({
            success: (res) => {
                this.isIPhoneX = res.model.indexOf('iPhone X') > -1;
            }
          })
    }

}

export default watch<Common>( 'Common', new Common( ));
 