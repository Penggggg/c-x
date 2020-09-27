import KoaRouter from 'koa-router';
import Ctrl from './index';
import { myCheck } from '../../middleware/check';

export default ( 
    router: KoaRouter, 
    prefix = '/apis/app' 
) => {

    /** ============ 应用 ============= */
    router.post(`${prefix}`, myCheck, Ctrl.create ),

    /** ============ 页面模块 ============= */
    router.post(`${prefix}/page-module`, myCheck, Ctrl.createPageModule ),

    router.put(`${prefix}/page-module`, Ctrl.upadtePageModule ),

    router.get(`${prefix}/page-module`, myCheck, Ctrl.findPageModule ),

    router.delete(`${prefix}/page-module`, Ctrl.deletePageModule ),

    /** ============ 页面 ============= */
    router.post(`${prefix}/page`, myCheck, Ctrl.createPage ),

    router.put(`${prefix}/page`, Ctrl.upadtePage ),

    router.delete(`${prefix}/page`, myCheck, Ctrl.deletePage ),

    router.get(`${prefix}/page`, myCheck, Ctrl.findPages ),

    /** ============ 按钮 ============= */
    router.post(`${prefix}/btn`, Ctrl.createBtn ),

    router.delete(`${prefix}/btn`, Ctrl.deleteBtn ),

    router.put(`${prefix}/btn`, Ctrl.upadteBtn )

};