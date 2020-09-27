import { Context, Service } from 'egg';
import * as ciac from '@cvte/ciac';

export default class IacService extends Service {

  private iacConfig = this.app.config.iac;

  constructor( ctx: Context ) {
    super( ctx );
  }

  async getToken( appid = this.iacConfig.appid, appSecret = this.iacConfig.secret ) {
    try {
      return await ciac.getToken( appid, appSecret );
    } catch ( e ) {
      return '';
    }
  }

}