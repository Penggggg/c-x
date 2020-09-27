import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp<IApp>();

Page({
    data: {
        mainGoods: [],
        deputyGoods: [{
            image: './WechatIMG265.png',
            name: '移动支架ST33',
            desc: '自由随意滑动'
        }, {
            image: './WechatIMG265.png',
            name: '移动支架ST33',
            desc: '自由随意滑动'
        }, {
            image: './WechatIMG265.png',
            name: '移动支架ST33',
            desc: '自由随意滑动'
        }, {
            image: './WechatIMG265.png',
            name: '移动支架ST33',
            desc: '自由随意滑动'
        }]
    },
    // 进入页面时间
    enterTime: 0,
    goTo(e) {
        navTo(`/pages/good-detail/index?id=${e.currentTarget.dataset.key}`);
    },

    onNavToPerson() {
        navTo(`/pages/person/index`);
    },

    runComputed() {
        computed(this, {


        });
    },

    onLoad(q: any) {
        const { distributorId, skuId } = q;
        http({
            method: 'GET',
            path: `/apis/goods/goods-list`
        }).then((val) => {
            console.log('我的结果', val);
            if (val.status !== 200) {
                return;
            }
            this.setData!({
                mainGoods: val.data.list
            });
        }).catch(e => {
            console.error('出错了1111:', e);
        })
    },

    onShow() {
        this.enterTime = new Date().getTime();
    },

    onHide(){
        // 首页PV埋点
        app.dataBury$([{
            "$code":"visitMainPage",
            "$ts":this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
    }
})