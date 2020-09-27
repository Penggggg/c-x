import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp<IApp>();

Page({
    data: {

        // 用户姓名
        username: '',

        // 优惠券数量
        couponCount: 0,

        // 是否市场拓展员
        isMarkerExpand: false,

        // 是否分销员
        isDistributor: false,

        // 优惠券跳转
        couponRedirect: {
            url: '/pages/coupon-list/index'
        },

        // 积分商城跳转
        integralRedirect: {
            url: '/pages/integral-shop/index'
        },

        // 分销员会员等级
        dlevel: {
            level: {
                name: '--'
            },
            score: {
                distributorTotalScore: 0
            }
        },

        /** 订单入口 */
        orderNav: [
            {
                label: '待付款',
                state: 'WAIT_PAY',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_payment@3x.png'
            }, {
                label: '待发货',
                state: 'WAIT_DELIVER',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_receipt@3x.png'
            }, {
                label: '待收货',
                state: 'WAIT_RECEIVR',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_comment@3x.png'
            }, {
                label: '全部订单',
                state: 'ALL',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_return@3x.png'
            }
        ],

        /** 常用服务入口 */
        serverNav: [
            {
                label: '优惠券',
                needAccount: true,
                url: '/pages/coupon-list/index',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_service_poupon@3x.png'
            }, {
                label: '会员权益',
                needAccount: true,
                url: '/pages/partner/index?fs=0',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_service_parnter@3x.png'
            }, {
                label: '地址管理',
                needAccount: true,
                url: '/pages/address-list/index',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_service_address@3x.png'
            }, {
                label: '联系我们',
                phone: app.store.Common.customerService,
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_service_contact@3x.png',
                openType: 'contact'
            },
            // {
            //     label: '关于我们',
            //     url: '',
            //     icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_service_about@3x.png'
            // }, 
            {
                label: '设置',
                url: '/pages/user-setting/index',
                icon: 'cloud://dev-cz0o8.6465-dev-cz0o8/icon/icon_personal_service_setting@3x.png'
            }
        ]

    },

    runComputed() {
        computed(this, {


        });
    },

    onNavToOrderList({ currentTarget }) {
        const { state } = currentTarget.dataset;
        // 如果未注册，则跳去注册
        if (!app.store.Auth.sysUserInfo.id) {
            navTo('/pages/login/index');

        } else {
            navTo(`/pages/order-list/index?state=${state}`);
        }

    },

    goto({ currentTarget }) {
        const { url, phone, needAccount } = currentTarget.dataset.item;

        // 如果未注册，则跳去注册
        if (needAccount && !app.store.Auth.sysUserInfo.id) {
            return navTo('/pages/login/index');
        }

        !!url && navTo(url);
        !!phone && wx.makePhoneCall({
            phoneNumber: phone
        });
    },

    onLoad(q: any) {
        
        this.setAuthInfo();
        this.watchApp();

    },

    // 根据个人信息设置页面状态
    setAuthInfo(){
        this.setData!({
            username: (app.store.Auth.sysUserInfo&&!!app.store.Auth.sysUserInfo.id) ? app.store.Auth.sysUserInfo.name : '点击登陆',
            isMarkerExpand: app.store.Auth.isMarkerExpand,
            isDistributor: app.store.Auth.isDistributor,
        });
        console.log('我最新的isDistributor', app.store.Auth.isDistributor , this.data.isDistributor);
        // 判断是否已经注册，是否是拓展员
        if (app.store.Auth.sysUserInfo&&!!app.store.Auth.sysUserInfo.id && app.store.Auth.isDistributor) {
            this.getUsefulCoupon();
            this.getVipLevel();
        }
    },

    // 去注册
    gotoReg() {
        !app.store.Auth.sysUserInfo.id && navTo('/pages/login/index');
    },

    // 获取可用的优惠券数量
    getUsefulCoupon() {
        http({
            path: `/apis/coupons/my-list?status=1`
        }).then(res => {
            const { status, data } = res;
            if (status !== 200) { return; }

            this.setData!({
                couponCount: data.length
            });
        });
    },

    // 获取会员等级
    getVipLevel() {
        http({
            path: `/apis/distributor/getMyDistributeScore`
        }).then(res => {
            const { status, data } = res;
            if (status !== 200) { return; }
            this.setData!({
                dlevel: data
            });
        });
    },

    onShow() {
        this.setAuthInfo();
    },

    /** 监听 */
    watchApp() {
        const this_: any = this;
        app.watch$('Auth.isMarkerExpand', v => {
            !!v && this_.setData!({
                isMarkerExpand: v
            }) 
            && (() =>{
                this.getUsefulCoupon();
                this.getVipLevel();
            })()
        });
        app.watch$('Auth.isDistributor', v => {
            !!v && this_.setData!({
                isMarkerExpand: v
            }) && (() =>{
                this.getUsefulCoupon();
                this.getVipLevel();
            })()
        });
        app.watch$('Auth.sysUserInfo', v => {
            !!v && this_.setData!({
                username: !!v.id ? v.name: '点击登陆',
            });
        });
    },
})