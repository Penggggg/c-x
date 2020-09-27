import { http } from '../../utils/http';
import { watch } from '../../utils/watch';
import { cloudHttp } from '../../utils/cloudHttp';
import config from '../../config/index';
import { StorageKey } from '../../utils/constant';


/**
 * @deprecated
 * 表单
 * 
 */
class Form {

    /** 创建订单时候的发票填写 */
    public orderInvoice = { };

    /** 创建地址时的地址id，用来给其他地方填充 */
    public lastCreateAddressId = '';

}

export default watch<Form>( 'Form', new Form( ));
 