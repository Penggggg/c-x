import config from '../../config/index';
import agrCof from './config.js';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp< IApp >( );

Page({
    // 拿到富文本步骤
    // 1. 打开ueeditor在线demo地址，  https://ueditor.baidu.com/website/onlinedemo.html
    // 2. 将word文件复制到富文本框中
    // 3. 在开发者页面中输入console.log(UE.getEditor('editor').getContent()); 并执行，即可得到富文本
    // 4. 将得到的数据copy到此文件中
    data: {
        agreement: '',
        imageStyle: ''
    },

    runComputed( ) {
        computed( this, {

        }); 
    },

    onTabChange({ detail }) {
        this.setData!({
            current: detail
        });
    },

    onLoad( q: any ) {
        this.setData!({
            agreement: agrCof[q.p].text
        })
    },

    onShow( ) {

    }
})
