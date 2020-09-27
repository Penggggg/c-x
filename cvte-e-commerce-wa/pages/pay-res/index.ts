import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp<IApp>();

Page({
    data: {
        page_state: 'WAIT_REMIT',
        bank_info: {
            name: '中国工商银行股份有限公司广州科学城支行',
            number: '3602 0907 0920 0131 619',
            company: '广州视臻信息科技有限公司'
        },
        // 页面状态 , 待转账 , 待上传 , 待审核
        dic: {
            WAIT_REMIT: 'WAIT_REMIT',
            WAIT_UPLOAD: 'WAIT_UPLOAD',
            WAIT_CHECK: 'WAIT_CHECK',
        },
        // oms订单号
        omsCode: ''
    },

    // 订单号
    orderNo: '',

    // 离开页面时间
    pipePhotos: [],    
    // 离开页面时间
    enterTime: 0,

    runComputed() {
        computed(this, {


        });
    },

    // 复制银行卡片信息
    onCopyCard(e) {
        const { bank_info } = this.data;
        wx.setClipboardData({
            data: `开户行: ${bank_info.name}\n公司名称: ${bank_info.company}\n账户: ${bank_info.number.replace(/\s/g, '')}`,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },

    // 跳转到汇款单填写
    onGoHome(e) {
        // navTo('/pages/main-page/index');
        wx.redirectTo({
            url: `/pages/main-page/index`,
        })
    },
    // 跳转到汇款单填写
    onRemit(e) {
        // navTo(`/pages/pay-res/index?state=WAIT_UPLOAD&no=${this.orderNo}`);
        wx.redirectTo({
            url: `/pages/pay-res/index?state=WAIT_UPLOAD&no=${this.orderNo}`,
        })
    },
    // 跳转到订单列表页面
    onNavToOrderList(e) {
        // navTo(`/pages/order-detail/index?no=${this.orderNo}`)
        wx.redirectTo({
            url: `/pages/order-detail/index?no=${this.orderNo}`,
        })
    },
    // 提交支付水号跳转到核查
    async onSubmit(e) {
        if(!!this.pipePhotos.length) {
            app.dataBury$([{
                "$code":"submitOrder",
                "$ts":new Date().getTime(),
                "orderNo": this.orderNo
            }]);
            await http({
                method: 'put',
                path: `/apis/order/upload_water_list/${this.orderNo}`
            })
            wx.redirectTo({
                url: `/pages/pay-res/index?state=WAIT_CHECK&no=${this.orderNo}`,
            })
        }else{
            wx.showToast({
                icon: 'none',
                mask: true,
                title: '请上传图片',
            })
        }
    },
    // 上传图片后的回调
    onImgChange(e) {
        console.log(e.detail);
        this.pipePhotos = e.detail;
    },

    onTabChange({ detail }) {
    },

    onLoad(q: any) {
        console.log('我的query', q.no);
        this.setData!({
            page_state: q.state
        });
        this.orderNo = q.no;

        q.state === 'WAIT_UPLOAD' && this.getOmsNo();
    },

    // 获取oms订单号
    getOmsNo() {
        http({
            method: 'post',
            path: `/apis/order/getOmsNo`,
            data: [this.orderNo]
        }).then(val => {
            if(val.status !== 200) 
            {
                console.error('获取单号出错,数据为', val.data);
                return ;
            }
            this.setData!({
                omsCode: val.data[0].soCode
            });
        })
    },
    onHide(){
        // PV埋点
        this.data.page_state === 'WAIT_REMIT' && app.dataBury$([{
            "$code": "bankNo" ,
            "$ts":this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
        this.data.page_state === 'WAIT_UPLOAD' && app.dataBury$([{
            "$code": "pipeNo" ,
            "$ts":this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
        this.enterTime = 0;
    },

    onShow() {
        this.enterTime = new Date().getTime();
    }
})