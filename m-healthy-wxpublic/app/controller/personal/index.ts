import { Controller, Context } from 'egg';

export default class PersonalCtrl extends Controller {

    public async test( ) {
        return this.ctx.body = 1;
    }

}