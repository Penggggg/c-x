// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Test from '../../../app/service/Test';
import AccountIndex from '../../../app/service/account/index';
import CommonIndex from '../../../app/service/common/index';
import IacIndex from '../../../app/service/iac/index';
import JwtIndex from '../../../app/service/jwt/index';
import WechatIndex from '../../../app/service/wechat/index';

declare module 'egg' {
  interface IService {
    test: Test;
    account: {
      index: AccountIndex;
    };
    common: {
      index: CommonIndex;
    };
    iac: {
      index: IacIndex;
    };
    jwt: {
      index: JwtIndex;
    };
    wechat: {
      index: WechatIndex;
    };
  }
}
