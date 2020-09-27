import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import DataModal from '../../utils/dataModal';
import { getUuid, serialize, debounce } from '../../utils/util';
import { StorageKey, InviteType } from '../../utils/constant';

const app = getApp<IApp>();

Page({
    data: {
        coupons: [
            // {
            //     id: '123',
            //     type: '',
            //     typeLabel: '会员券',
            //     discountType: '',
            //     value: 5123,
            //     used: false,
            //     tips: '满399元,减500元',
            //     title: 'CVTOUCH 会议平板指定优惠券',
            //     start: 1566996141811,
            //     end: 1566996141811,
            //     useTips: '使用说明：小程序专享，下单即可使用。'
            // }
            // ]
        ],
        // 分销员id
        distributorId: '',
        // 商品id
        skuId: '',
        // emptyTips:'空空如也   ' 
        emptyTips: '空空如也 ',
        // shareKey,安全保证key
        sk: ''
    },

    enterTime: 0,

    // onBack() {},

    runComputed() {
        computed(this, {


        });
    },

    // 领取优惠券
    onReceive(e) {
            app.dataBury$([{
                "$code": "receive",
                "$ts": new Date().getTime()
            }]);
            console.log('可领取的优惠券列表', this.data.coupons);
            console.log('领取优惠券实体', this.data.coupons.map((v: any) => {
                return {
                    channel: '小程序',
                    couponTemplateId: v.id,
                    receiveNum: 1,
                    sourceId: this.data.distributorId,
                    sourceType: 0,
                    sk: this.data.sk
                }
            }));
            if (app.store.Auth.sysUserInfo.id) {
                http({
                    method: 'POST',
                    path: '/apis/coupons/batch_receive',
                    data: this.data.coupons.map((v: any) => {
                        return {
                            channel: '小程序',
                            couponTemplateId: v.id,
                            receiveNum: 1,
                            sourceId: this.data.distributorId,
                            sourceType: 0,
                            sk: this.data.sk
                        }
                    })
                }).then((val) => {
                    console.log('领取优惠券', val);
                    if (val.status !== 200) {
                        // 请求失败
                        wx.showToast({
                            title: val.msg,
                            icon: 'none',
                            mask: true
                        });
                        return;
                    }
                    wx.showToast({
                        title: '领取成功',
                        icon: 'success',
                        mask: true
                    });
                    wx.redirectTo({
                        url: `/pages/good-detail/index?skuid=${this.data.skuId}`,
                    })
                }).catch(e => {
                    console.error('77s:', e);
                })
                // console.log('一键领取');
            } else {
                // 跳转到注册页面
                navTo(`/pages/login/index`);
            }
    },

    goHome( ) {
        navTo(`/pages/main-page/index`);
    },

    async onLoad(q: any) {
        // 按钮增加防抖动
        this.onBack = debounce(this.onBack, 500);
        this.onReceive = debounce(this.onReceive, 500);
        // 首先是去校验优惠券是否可用
        const { sk } = q;
        console.log('分享二维码参数', q);
        const dedupKey = await getUuid();
        http({
            method: 'GET',
            path: `/apis/partner/checkShare?sk=${sk}&shareDedupKey=${dedupKey.data}`
        }).then((val) => {
            // console.log('我的结果',val);
            if (val.status !== 200) {
                // 请求失败
                this.setData!({
                    emptyTips: '该链接已过期'
                })
                return;
            }
            const { distributorId, skuId, memberId } = (serialize(val.data.data.params) as any);
            console.log('根据sk获取优惠券', val.data);
            wx.setStorageSync( StorageKey.REGISTER_INVITER, memberId);
            wx.setStorageSync( StorageKey.REGISTER_INVITER_TYPE, InviteType.SHARE_COUPON);
            this.setData!({
                distributorId,
                skuId,
                sk
            })
            http({
                method: 'GET',
                path: `/apis/distributor/getShareCoupon?distributorId=${distributorId}&skuId=${skuId}&sk=${sk}`,
            }).then((val) => {
                // console.log('我的结果',val);
                if (val.status !== 200) {
                    return;
                }
                this.setData!({
                    coupons: val.data.map(item => {
                        return {
                            limitReceiveNum: item.limitReceiveNum,
                            id: item.id,
                            type: item.type,
                            typeLabel: '会员券',
                            discountType: '',
                            value: item.calculateRule.fullReduceNum,
                            used: false,
                            tips: `满${item.calculateRule.fullReduceMinPrice}元,减${item.calculateRule.fullReduceNum}元`,
                            title: item.name,
                            start: item.expirationInterval ? new Date(item.effectiveTime).getTime() : null,
                            end: item.expirationInterval ? new Date(item.expiredTime).getTime() : null,
                            useTips: item.remark
                        }
                    })
                })

            }).catch(e => {
                console.error('出错了88:', e);
            })
        }).catch(e => {
            console.error('出错了99:', e);
        })
    },

    onBack() {
        wx.redirectTo({
            url: `/pages/main-page/index`,
        })
    },

    onShow() {
        this.enterTime = new Date().getTime();
    },

    onHide() {
        // 领取优惠券PV埋点
        app.dataBury$([{
            "$code": "visitReceiveCoupon",
            "$ts": this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
    }
})