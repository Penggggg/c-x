// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Access from '../../../app/middleware/access';
import BindAuth from '../../../app/middleware/bind_auth';
import JavaAuth from '../../../app/middleware/java_auth';
import QyAuth from '../../../app/middleware/qy_auth';
import Transfer from '../../../app/middleware/transfer';
import Ua from '../../../app/middleware/ua';
import Xmlparse from '../../../app/middleware/xmlparse';
import BodysignEntry from '../../../app/middleware/bodysign_entry';

declare module 'egg' {
  interface IMiddleware {
    access: typeof Access;
    bodysignEntry: typeof BodysignEntry;
    bindAuth: typeof BindAuth;
    javaAuth: typeof JavaAuth;
    qyAuth: typeof QyAuth;
    transfer: typeof Transfer;
    ua: typeof Ua;
    xmlparse: typeof Xmlparse;
  }
}
