import KoaRouter from 'koa-router';
import Ctrl from './index';

export default ( 
    router: KoaRouter, 
    prefix = '/apis/common' 
) => {

    router.get(`${prefix}/hehe`, Ctrl.test ),

    router.get(`${prefix}/org/dimension`, Ctrl.orgDimension ),

    router.get(`${prefix}/org/tree`, Ctrl.orgTree ),

    router.get(`${prefix}/org/users`, Ctrl.orgUser )
};