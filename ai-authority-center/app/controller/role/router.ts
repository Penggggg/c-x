import KoaRouter from 'koa-router';
import Ctrl from './index';
import { myCheck } from '../../middleware/check';

export default ( 
    router: KoaRouter, 
    prefix = '/apis/role' 
) => {

    /** =========== 角色 =========== */

    router.post(`${prefix}`, myCheck, Ctrl.createRole ),
    
    router.get(`${prefix}`, myCheck, Ctrl.findRole ),

    router.delete(`${prefix}`, Ctrl.deleteRole ),

    router.get(`${prefix}/base`, Ctrl.findRoleBase ),

    router.put(`${prefix}/base`, Ctrl.updateBase ),

    router.get(`${prefix}/users`, Ctrl.findUsers ),

    router.put(`${prefix}/users`, Ctrl.updateUsers ),

    router.post(`${prefix}/users`, Ctrl.addUsers ),

    router.delete(`${prefix}/users`, Ctrl.deleteUser ),

    router.put(`${prefix}/pages-btns`, Ctrl.updatePagesBtns ),

    router.get(`${prefix}/pages-btns`, Ctrl.finPagesBtns )
};