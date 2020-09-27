import KoaRouter from 'koa-router';
import Ctrl from './index';

export default ( 
    router: KoaRouter, 
    prefix = '/apis/sys' 
) => {
    router.post(`${prefix}`, Ctrl.create )
};