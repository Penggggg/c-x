import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { serialize, debounce } from '../../utils/util';
import { store$ } from '../../store/index';
import { StorageKey, InviteType } from '../../utils/constant';

const app = getApp<IApp>();

Page({
    data: {
        items: [
            { name: 'yes', checked: false }
        ],
        hasRead: false,
        useful: -1, // 是否展示按钮
        distributorId: '', // 分销员id
        sk: '' // 分享的参数
    },
    enterTime: 0,

    runComputed() {
        computed(this, {


        });
    },

    onCheckboxChange(e) {
        if (e.detail.value.length === 0) {
            this.setData!({
                hasRead: false
            })
        } else {
            this.setData!({
                hasRead: true
            })
        }
    },

    // 发起邀请
    onInvite(e) {
        app.dataBury$([{
            "$code": "invite",
            "$ts": new Date().getTime()
        }]);
        navTo(`/pages/qrcode-create/index?p=${encodeURIComponent('pages/partner/index')}&s=${encodeURIComponent('fs=1')}`)
    },

    // 返回首页
    onBack(e) {
        app.dataBury$([{
            "$code": "refuseInvite",
            "$ts": new Date().getTime()
        }]);
        wx.redirectTo({
            url: '/pages/main-page/index'
        });
    },

    // 跳转到协议
    toAgree(e){
        navTo(`/pages/agreement/index?p=${e.currentTarget.dataset.page}`);
    },

    // 接受成为合伙人邀请
    onConfirm(e) {
        if (!app.store.Auth.sysUserInfo.id) {
            navTo('/pages/login/index');
        } else {
        app.dataBury$([{
            "$code": "acceptInvite",
            "$ts": new Date().getTime()
        }]);
        if (!this.data.hasRead) {
            wx.showToast({
                mask: true,
                title: '请确认用户协议',
                icon: 'none',
                duration: 2000
            })
            return;
        } else {
            http({
                method: 'GET',
                path: `/apis/partner/agree?distributorId=${this.data.distributorId}&sk=${this.data.sk}`,
            }).then(async (val) => {
                if (val.status !== 200) {
                    wx.showToast({
                        mask: true,
                        title: '请求出错，请重试',
                        icon: 'none'
                    })
                    // 请求过程失败
                    return;
                }
                // 重新刷新用户角色
                await store$.Auth.judgeMarkerExpand();
                await store$.Auth.judgeDistributor();
                // 同意的跳转
                wx.redirectTo({
                    url: `/pages/main-page/index`,
                })
            }).catch(e => {
                console.error('出错了55:', e);
            })
        } }
    },

    onLoad(q: any) {
        this.watchApp(q);
        this.onConfirm = debounce(this.onConfirm, 500);
    },

    onShow() {
        this.enterTime = new Date().getTime();
    },

    onHide() {
        // 领取优惠券PV埋点
        app.dataBury$([{
            "$code": this.data.useful === 1 ? "selectBecomePartner" : 'invitePartner',
            "$ts": this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
        this.enterTime = 0;
    },

    /** 监听 */
    watchApp(q) {

        const this_: any = this;
        const { sk, fs } = q.scene ? (serialize(decodeURIComponent(q.scene)) as any) : q;// 获取query参数
        this.setData!({
            sk
        });

        app.watch$('Auth.sysUserInfo', vuser => {
            app.watch$('Auth.isMarkerExpand', vexpand => {
                app.watch$('Auth.isDistributor', vdis => {
                    if (!!vuser) {
                        // fs（fromShare）判断是否扫码进入该页面
                        console.log('解析页面query参数', q, sk, fs);
                        console.log('监听参数', fs === '0', vuser, vexpand, vdis);
                        if (fs === '0' && vuser.id && vexpand) {
                            this.setData!({
                                useful: 0
                            })
                        }
                        if (fs === '1') {
                            // 首先发请求校验二维码是否过期
                            // 如果用户已经是分销员则不允许再次确认，否则可以确认
                            vdis ?
                                this.setData!({
                                    useful: 2
                                }) :
                                http({
                                    method: 'GET',
                                    path: `/apis/partner/checkShare?sk=${sk}`,
                                    errMsg: '分享链接已过期'
                                }).then((val) => {
                                    console.log('我的结果', val);
                                    if (val.status !== 200 || val.data.result === false) {
                                        // 请求失败
                                        this.setData!({
                                            useful: -1
                                        });
                                        wx.showToast({
                                            mask: true,
                                            title: '二维码已过期',
                                            icon: 'none'
                                        })
                                        return;
                                    }
                                    const { distributorId, memberId } = (serialize(val.data.data.params) as any);
                                    wx.setStorageSync( StorageKey.REGISTER_INVITER, memberId);
                                    wx.setStorageSync( StorageKey.REGISTER_INVITER_TYPE, InviteType.SHARE_QRCODE);
                                    console.log('根据sk获取优惠券', val.data);
                                    this.setData!({
                                        useful: 1,
                                        distributorId,
                                    });
                                }).catch(e => {
                                    console.error('出错了66:', e);
                                })
                        }
                    }
                });
            });
        });
    },
})