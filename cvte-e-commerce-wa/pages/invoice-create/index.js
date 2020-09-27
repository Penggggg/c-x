"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../config/index");
var http_1 = require("../../utils/http");
var index_2 = require("../../lib/vuefy/index");
var constant_1 = require("../../utils/constant");
var app = getApp();
Page({
    data: {
        isIPhoneX: false,
        inited: false,
        type: constant_1.InvoiceChoiceType.company,
        invoiceType: constant_1.InvoiceType.normal,
        taxNo: '',
        invoiceTitle: '',
        companyCheckInfoArr: [],
        refresh: '',
        addressDetail: null,
        addressId: '',
        hasChoiceTitle: false
    },
    runComputed: function () {
        index_2.computed(this, {
            formMeta1$: function () {
                var _a = this.data, invoiceType = _a.invoiceType, type = _a.type;
                return [
                    {
                        key: 'type',
                        label: '发票类型',
                        type: 'inline-singleselect',
                        value: constant_1.InvoiceChoiceType.company,
                        options: [
                            {
                                value: constant_1.InvoiceChoiceType.company,
                                label: '企业'
                            }, {
                                value: constant_1.InvoiceChoiceType.personal,
                                label: '个人'
                            }, {
                                value: constant_1.InvoiceChoiceType.noneed,
                                label: '无需'
                            }
                        ],
                        rules: [{
                                validate: function (val) { return !!val; },
                                message: '发票类型不能为空'
                            }]
                    }, {
                        key: 'invoiceType',
                        label: '普票/专票',
                        type: 'inline-singleselect',
                        value: invoiceType,
                        hide: type !== constant_1.InvoiceChoiceType.company,
                        options: [
                            {
                                value: constant_1.InvoiceType.normal,
                                label: '普票'
                            }, {
                                value: constant_1.InvoiceType.specail,
                                label: '专票'
                            }
                        ],
                        rules: [{
                                validate: function (val) { return !!val; },
                                message: '普票/专票不能为空'
                            }]
                    }, {
                        key: 'invoiceTitle',
                        label: '发票抬头',
                        type: 'autocomplete',
                        placeholder: '抬头名称 (输入至少4个字 自动匹配)',
                        value: undefined,
                        query: 'name',
                        showKey: 'kpName',
                        fillKey: 'kpName',
                        onConfirm: this.onConfirmTitle,
                        url: index_1.default.host.default + "/apis/common/company-check",
                        hide: type === constant_1.InvoiceChoiceType.noneed,
                        rules: type === constant_1.InvoiceChoiceType.company ? [{
                                validate: function (val) { return !!val; },
                                message: '发票抬头不能为空'
                            }] : []
                    }, {
                        key: 'taxNo',
                        label: '税号',
                        type: 'input',
                        width: '100rpx',
                        hide: type !== constant_1.InvoiceChoiceType.company,
                        placeholder: '纳税人识别号或社会统一征信代码',
                        value: undefined,
                        rules: [{
                                validate: function (val) { return !!val; },
                                message: '税号不能为空'
                            }]
                    }
                ];
            },
            formMeta2$: function () {
                var invoiceType = this.data.invoiceType;
                return [
                    {
                        key: 'openingBank',
                        label: '开户银行',
                        type: 'input',
                        placeholder: invoiceType === constant_1.InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === constant_1.InvoiceType.specail ? [{
                                validate: function (val) { return !!val; },
                                message: '开户银行不能为空'
                            }] : []
                    }, {
                        key: 'bankAccount',
                        label: '银行账户',
                        type: 'input',
                        placeholder: invoiceType === constant_1.InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === constant_1.InvoiceType.specail ? [{
                                validate: function (val) { return !!val; },
                                message: '银行账户不能为空'
                            }] : []
                    }, {
                        key: 'enterpriseAddress',
                        label: '企业地址',
                        type: 'input',
                        placeholder: invoiceType === constant_1.InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === constant_1.InvoiceType.specail ? [{
                                validate: function (val) { return !!val; },
                                message: '企业地址不能为空'
                            }] : []
                    }, {
                        key: 'enterpriseTelephone',
                        label: '企业电话',
                        type: 'input',
                        placeholder: invoiceType === constant_1.InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === constant_1.InvoiceType.specail ? [{
                                validate: function (val) { return !!val; },
                                message: '企业电话不能为空'
                            }] : []
                    }
                ];
            }
        });
    },
    watchApp: function () {
        var _this = this;
        app.watch$('Common.isIPhoneX', function (v) {
            _this.setData({
                isIPhoneX: v
            });
        });
    },
    initEdit: function () {
        var _this = this;
        var this_ = this;
        var form1 = this_.selectComponent('#form1');
        var lastForm = app.store.Form.orderInvoice;
        var type = lastForm.type, invoiceType = lastForm.invoiceType, taxNo = lastForm.taxNo, invoiceTitle = lastForm.invoiceTitle, addressDetail = lastForm.addressDetail, openingBank = lastForm.openingBank, bankAccount = lastForm.bankAccount, enterpriseAddress = lastForm.enterpriseAddress, enterpriseTelephone = lastForm.enterpriseTelephone;
        if (!!addressDetail && !!addressDetail.id) {
            this.setData({
                addressId: addressDetail.id
            });
        }
        form1.set({
            type: type,
            taxNo: taxNo,
            invoiceType: invoiceType,
            invoiceTitle: invoiceTitle
        });
        setTimeout(function () {
            var form2 = this_.selectComponent('#form2');
            if (!!form2) {
                form2.set({
                    openingBank: openingBank,
                    bankAccount: bankAccount,
                    enterpriseAddress: enterpriseAddress,
                    enterpriseTelephone: enterpriseTelephone
                });
            }
            _this.setData({
                inited: true
            });
        }, 100);
    },
    checkHeaderAndNo: function (invoiceTitle, taxNo) {
        var _this = this;
        var type = this.data.type;
        if (type !== constant_1.InvoiceChoiceType.company) {
            return;
        }
        if (!invoiceTitle || !taxNo) {
            return;
        }
        http_1.http({
            errMsg: 'none',
            loadingMsg: 'none',
            path: "/apis/common/company-check?name=" + invoiceTitle
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            _this.setData({
                companyCheckInfoArr: data
            });
        });
    },
    onFormChange: function (_a) {
        var detail = _a.detail;
        var type = detail.type, invoiceTitle = detail.invoiceTitle, taxNo = detail.taxNo, invoiceType = detail.invoiceType;
        if (taxNo !== this.data.taxNo || invoiceTitle !== this.data.invoiceTitle) {
            this.setData({
                hasChoiceTitle: false
            });
        }
        if (invoiceType !== this.data.invoiceType) {
        }
        this.setData({
            invoiceType: invoiceType,
            type: type,
            taxNo: taxNo || '',
            invoiceTitle: invoiceTitle || '',
        });
    },
    onSubmit: function () {
        var addressDetail = this.data.addressDetail;
        var _a = this.onCheckAll(), result = _a.result, data = _a.data;
        if (!result) {
            return;
        }
        app.set$('Form.orderInvoice', __assign({}, data, { addressDetail: addressDetail }));
        wx.navigateBack({
            delta: 1
        });
    },
    onCheckKp: function () {
        var this_ = this;
        var _a = this_.data, companyCheckInfoArr = _a.companyCheckInfoArr, invoiceTitle = _a.invoiceTitle, taxNo = _a.taxNo, type = _a.type;
        if (type !== constant_1.InvoiceChoiceType.company) {
            return '';
        }
        if (companyCheckInfoArr.length === 0) {
            return '请核对企业名称';
        }
        else if (companyCheckInfoArr.length === 1) {
            var _b = companyCheckInfoArr[0], kpName = _b.kpName, kpCode = _b.kpCode;
            if (kpName !== invoiceTitle) {
                return '请核对企业名称';
            }
            else if (kpCode !== taxNo) {
                return '税号错误，请核对';
            }
        }
        else if (companyCheckInfoArr.length > 1) {
            var target = companyCheckInfoArr.find(function (x) { return x.kpName === invoiceTitle; });
            if (!target) {
                return '请核对企业名称';
            }
            else {
                return target.kpCode !== taxNo ? '税号错误，请核对' : '';
            }
        }
        return '';
    },
    onCheckAll: function () {
        var this_ = this;
        var _a = this.data, addressDetail = _a.addressDetail, type = _a.type, hasChoiceTitle = _a.hasChoiceTitle;
        var form1 = this_.selectComponent('#form1');
        var form2 = this_.selectComponent('#form2');
        var res1 = form1.getData();
        var res2 = form2 ? form2.getData() : { result: true };
        var err = function (title) {
            wx.showToast({
                title: title,
                icon: 'none',
            });
            return {
                result: false,
                data: __assign({}, res1.data, res2.data)
            };
        };
        if (!res1.result || !res2.result) {
            return err('请完善表单');
        }
        if (type === constant_1.InvoiceChoiceType.company) {
            if (!hasChoiceTitle) {
                return err('请选择正确抬头');
            }
        }
        if (type !== constant_1.InvoiceChoiceType.noneed && !addressDetail) {
            return err('收票地址不能为空');
        }
        return {
            result: true,
            data: __assign({}, res1.data, res2.data, { invoiceTitle: res1.data.invoiceTitle || '个人' })
        };
    },
    onCheckForm2: function () {
        var this_ = this;
        var form2 = this_.selectComponent('#form2');
        if (!!form2) {
            setTimeout(function () {
                form2.getData();
            }, 100);
        }
    },
    onAddressChange: function (_a) {
        var detail = _a.detail;
        this.setData({
            addressDetail: detail
        });
    },
    onConfirmTitle: function (e) {
        var kpCode = e.kpCode, accountBlank = e.accountBlank, bankAccount = e.bankAccount, kpAddr = e.kpAddr, kpTel = e.kpTel, kpName = e.kpName;
        var this_ = this;
        var form1 = this_.selectComponent('#form1');
        var form2 = this_.selectComponent('#form2');
        form1.set({
            taxNo: kpCode,
            invoiceTitle: kpName
        });
        !!form2 && form2.set({
            openingBank: accountBlank,
            bankAccount: bankAccount,
            enterpriseAddress: kpAddr,
            enterpriseTelephone: kpTel
        });
        this.setData({
            hasChoiceTitle: true
        });
    },
    onLoad: function (query) {
        var editing = query.editing, defaultAddress = query.defaultAddress;
        this.watchApp();
        this.runComputed();
        if (editing === '1') {
            this.initEdit();
        }
        else {
            this.setData({
                inited: true,
                addressId: defaultAddress || ''
            });
        }
    },
    onShow: function () {
        this.setData({
            refresh: (Math.random() * 9999).toFixed(0)
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXdDO0FBRXhDLHlDQUF3QztBQUN4QywrQ0FBaUQ7QUFFakQsaURBQXNFO0FBRXRFLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVyxDQUFDO0FBRTlCLElBQUksQ0FBQztJQUVELElBQUksRUFBRTtRQUVGLFNBQVMsRUFBRSxLQUFLO1FBR2hCLE1BQU0sRUFBRSxLQUFLO1FBR2IsSUFBSSxFQUFFLDRCQUFpQixDQUFDLE9BQU87UUFHL0IsV0FBVyxFQUFFLHNCQUFXLENBQUMsTUFBTTtRQUcvQixLQUFLLEVBQUUsRUFBRTtRQUdULFlBQVksRUFBRSxFQUFFO1FBR2hCLG1CQUFtQixFQUFFLEVBQUc7UUFHeEIsT0FBTyxFQUFFLEVBQUU7UUFHWCxhQUFhLEVBQUUsSUFBSTtRQUduQixTQUFTLEVBQUUsRUFBRTtRQUdiLGNBQWMsRUFBRSxLQUFLO0tBRXhCO0lBRUQsV0FBVztRQUNQLGdCQUFRLENBQUUsSUFBSSxFQUFFO1lBRVosVUFBVSxFQUFFO2dCQUVGLElBQUEsY0FBaUMsRUFBL0IsNEJBQVcsRUFBRSxjQUFrQixDQUFDO2dCQUV4QyxPQUFPO29CQUNIO3dCQUNJLEdBQUcsRUFBRSxNQUFNO3dCQUNYLEtBQUssRUFBRSxNQUFNO3dCQUNiLElBQUksRUFBRSxxQkFBcUI7d0JBQzNCLEtBQUssRUFBRSw0QkFBaUIsQ0FBQyxPQUFPO3dCQUNoQyxPQUFPLEVBQUU7NEJBQ0w7Z0NBQ0ksS0FBSyxFQUFFLDRCQUFpQixDQUFDLE9BQU87Z0NBQ2hDLEtBQUssRUFBRSxJQUFJOzZCQUNkLEVBQUU7Z0NBQ0MsS0FBSyxFQUFFLDRCQUFpQixDQUFDLFFBQVE7Z0NBQ2pDLEtBQUssRUFBRSxJQUFJOzZCQUNkLEVBQUU7Z0NBQ0MsS0FBSyxFQUFFLDRCQUFpQixDQUFDLE1BQU07Z0NBQy9CLEtBQUssRUFBRSxJ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QVEsQ0FBQztZQUNWLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFO1NBQ2hELENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleCc7XG5pbXBvcnQgeyBJQXBwIH0gZnJvbSBcIi4uLy4uL2dsb2JhbFwiO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXgnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZSc7XG5pbXBvcnQgeyBJbnZvaWNlQ2hvaWNlVHlwZSwgSW52b2ljZVR5cGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25zdGFudCc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuXG5QYWdlKHtcblxuICAgIGRhdGE6IHtcblxuICAgICAgICBpc0lQaG9uZVg6IGZhbHNlLFxuXG4gICAgICAgIC8qKiDmmK/lkKbliJ3lp4vljJbkuobooajljZUgKi9cbiAgICAgICAgaW5pdGVkOiBmYWxzZSxcblxuICAgICAgICAvLyDlj5HnpajnsbvlnotcbiAgICAgICAgdHlwZTogSW52b2ljZUNob2ljZVR5cGUuY29tcGFueSxcblxuICAgICAgICAvLyDmma7npagv5LiT56WoXG4gICAgICAgIGludm9pY2VUeXBlOiBJbnZvaWNlVHlwZS5ub3JtYWwsXG5cbiAgICAgICAgLy8g5Y+R56Wo56iO5Y+3XG4gICAgICAgIHRheE5vOiAnJyxcblxuICAgICAgICAvLyDlj5HnpajmiqzlpLRcbiAgICAgICAgaW52b2ljZVRpdGxlOiAnJyxcblxuICAgICAgICAvLyDmiqzlpLTkv6Hmga9cbiAgICAgICAgY29tcGFueUNoZWNrSW5mb0FycjogWyBdLFxuXG4gICAgICAgIC8qKiDliLfmlrAgKi9cbiAgICAgICAgcmVmcmVzaDogJycsXG5cbiAgICAgICAgLyoqIOWPkeelqOWcsOWdgOS/oeaBryAqL1xuICAgICAgICBhZGRyZXNzRGV0YWlsOiBudWxsLFxuXG4gICAgICAgIC8qKiDlt7LpgInnmoTlnLDlnYBpZCAqL1xuICAgICAgICBhZGRyZXNzSWQ6ICcnLFxuXG4gICAgICAgIC8qKiDmmK/lkKbpgInmi6nov4flj5HnpajmiqzlpLTvvIzlubbljLnphY3lupXkuIvnmoTkv6Hmga8gKi9cbiAgICAgICAgaGFzQ2hvaWNlVGl0bGU6IGZhbHNlXG5cbiAgICB9LFxuXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICBmb3JtTWV0YTEkOiBmdW5jdGlvbiggKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7IGludm9pY2VUeXBlLCB0eXBlIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICd0eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5Y+R56Wo57G75Z6LJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmxpbmUtc2luZ2xlc2VsZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBJbnZvaWNlQ2hvaWNlVHlwZS5jb21wYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IEludm9pY2VDaG9pY2VUeXBlLmNvbXBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5LyB5LiaJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IEludm9pY2VDaG9pY2VUeXBlLnBlcnNvbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+S4quS6uidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBJbnZvaWNlQ2hvaWNlVHlwZS5ub25lZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5peg6ZyAJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+ICEhdmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflj5HnpajnsbvlnovkuI3og73kuLrnqbonXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdpbnZvaWNlVHlwZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+aZruelqC/kuJPnpagnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2lubGluZS1zaW5nbGVzZWxlY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGludm9pY2VUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZTogdHlwZSAhPT0gSW52b2ljZUNob2ljZVR5cGUuY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBJbnZvaWNlVHlwZS5ub3JtYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5pmu56WoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IEludm9pY2VUeXBlLnNwZWNhaWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5LiT56WoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+ICEhdmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfmma7npagv5LiT56Wo5LiN6IO95Li656m6J1xuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiAnaW52b2ljZVRpdGxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5Y+R56Wo5oqs5aS0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhdXRvY29tcGxldGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICfmiqzlpLTlkI3np7AgKOi+k+WFpeiHs+WwkTTkuKrlrZcg6Ieq5Yqo5Yy56YWNKScsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dLZXk6J2twTmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsS2V5OiAna3BOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5vbkNvbmZpcm1UaXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYCR7Y29uZmlnLmhvc3QuZGVmYXVsdH0vYXBpcy9jb21tb24vY29tcGFueS1jaGVja2AsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlOiB0eXBlID09PSBJbnZvaWNlQ2hvaWNlVHlwZS5ub25lZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogdHlwZSA9PT0gSW52b2ljZUNob2ljZVR5cGUuY29tcGFueSA/IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gISF2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflj5HnpajmiqzlpLTkuI3og73kuLrnqbonXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSA6IFsgXVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICd0YXhObycsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+eojuWPtycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDBycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZTogdHlwZSAhPT0gSW52b2ljZUNob2ljZVR5cGUuY29tcGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn57qz56iO5Lq66K+G5Yir5Y+35oiW56S+5Lya57uf5LiA5b6B5L+h5Luj56CBJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiAhIXZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+eojuWPt+S4jeiDveS4uuepuidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZm9ybU1ldGEyJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaW52b2ljZVR5cGUgfSA9IHRoaXMuZGF0YTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiAnb3BlbmluZ0JhbmsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICflvIDmiLfpk7booYwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBpbnZvaWNlVHlwZSA9PT0gSW52b2ljZVR5cGUuc3BlY2FpbCA/ICflv4XloasnIDogJ+mAieWhqycsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IGludm9pY2VUeXBlID09PSBJbnZvaWNlVHlwZS5zcGVjYWlsID8gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiAhIXZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+W8gOaIt+mTtuihjOS4jeiDveS4uuepuidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dIDogWyBdXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogJ2JhbmtBY2NvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn6ZO26KGM6LSm5oi3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogaW52b2ljZVR5cGUgPT09IEludm9pY2VUeXBlLnNwZWNhaWwgPyAn5b+F5aGrJyA6ICfpgInloasnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBpbnZvaWNlVHlwZSA9PT0gSW52b2ljZVR5cGUuc3BlY2FpbCA/IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gISF2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfpk7booYzotKbmiLfkuI3og73kuLrnqbonXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSA6IFsgXVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdlbnRlcnByaXNlQWRkcmVzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+S8geS4muWcsOWdgCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGludm9pY2VUeXBlID09PSBJbnZvaWNlVHlwZS5zcGVjYWlsID8gJ+W/heWhqycgOiAn6YCJ5aGrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogaW52b2ljZVR5cGUgPT09IEludm9pY2VUeXBlLnNwZWNhaWwgPyBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+ICEhdmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5LyB5Lia5Zyw5Z2A5LiN6IO95Li656m6J1xuICAgICAgICAgICAgICAgICAgICAgICAgfV0gOiBbIF1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiAnZW50ZXJwcmlzZVRlbGVwaG9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+S8geS4mueUteivnScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGludm9pY2VUeXBlID09PSBJbnZvaWNlVHlwZS5zcGVjYWlsID8gJ+W/heWhqycgOiAn6YCJ5aGrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogaW52b2ljZVR5cGUgPT09IEludm9pY2VUeXBlLnNwZWNhaWwgPyBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+ICEhdmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5LyB5Lia55S16K+d5LiN6IO95Li656m6J1xuICAgICAgICAgICAgICAgICAgICAgICAgfV0gOiBbIF1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7IFxuICAgIH0sXG5cbiAgICAvKiog55uR5ZCsICovXG4gICAgd2F0Y2hBcHAoICkge1xuICAgICAgICBhcHAud2F0Y2gkKCdDb21tb24uaXNJUGhvbmVYJywgdiA9PiB7XG4gICAgICAgICAgICAgLy8g5YW85a65aXBvbmVYXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc0lQaG9uZVg6IHZcbiAgICAgICAgICAgIH0pIFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOe8lui+keeKtuaAge+8jOWIneWni+WMluihqOWNlSAqL1xuICAgIGluaXRFZGl0KCApIHtcblxuICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm9ybTEgPSB0aGlzXy5zZWxlY3RDb21wb25lbnQoJyNmb3JtMScpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgbGFzdEZvcm06IGFueSA9IGFwcC5zdG9yZS5Gb3JtLm9yZGVySW52b2ljZTtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBpbnZvaWNlVHlwZSwgdGF4Tm8sIGludm9pY2VUaXRsZSwgYWRkcmVzc0RldGFpbCxcbiAgICAgICAgICAgIG9wZW5pbmdCYW5rLCBiYW5rQWNjb3VudCwgZW50ZXJwcmlzZUFkZHJlc3MsIGVudGVycHJpc2VUZWxlcGhvbmUgfSA9IGxhc3RGb3JtO1xuXG4gICAgICAgIGlmICggISFhZGRyZXNzRGV0YWlsICYmICEhYWRkcmVzc0RldGFpbC5pZCApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGFkZHJlc3NJZDogYWRkcmVzc0RldGFpbC5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICAgICAgZm9ybTEuc2V0KHtcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICB0YXhObyxcbiAgICAgICAgICAgIGludm9pY2VUeXBlLFxuICAgICAgICAgICAgaW52b2ljZVRpdGxlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0yID0gdGhpc18uc2VsZWN0Q29tcG9uZW50KCcjZm9ybTInKTtcbiAgICAgICAgICAgIGlmICggISFmb3JtMiApIHtcbiAgICAgICAgICAgICAgICBmb3JtMi5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBvcGVuaW5nQmFuayxcbiAgICAgICAgICAgICAgICAgICAgYmFua0FjY291bnQsXG4gICAgICAgICAgICAgICAgICAgIGVudGVycHJpc2VBZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICBlbnRlcnByaXNlVGVsZXBob25lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpbml0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDAgKTtcblxuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5oqs5aS05ZKM56iO5Y+3ICovXG4gICAgY2hlY2tIZWFkZXJBbmRObyggaW52b2ljZVRpdGxlLCB0YXhObyApIHtcbiAgICAgICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLmRhdGE7XG5cbiAgICAgICAgaWYgKCB0eXBlICE9PSBJbnZvaWNlQ2hvaWNlVHlwZS5jb21wYW55ICkgeyByZXR1cm47IH1cbiAgICAgICAgaWYgKCAhaW52b2ljZVRpdGxlIHx8ICF0YXhObyApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBlcnJNc2c6ICdub25lJyxcbiAgICAgICAgICAgIGxvYWRpbmdNc2c6ICdub25lJyxcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9jb21tb24vY29tcGFueS1jaGVjaz9uYW1lPSR7aW52b2ljZVRpdGxlfWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGNvbXBhbnlDaGVja0luZm9BcnI6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOihqOWNleihqOabtCAqL1xuICAgIG9uRm9ybUNoYW5nZSh7IGRldGFpbCB9KSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgaW52b2ljZVRpdGxlLCB0YXhObywgaW52b2ljZVR5cGUgfSA9IGRldGFpbDtcblxuICAgICAgICBpZiAoIHRheE5vICE9PSB0aGlzLmRhdGEudGF4Tm8gfHwgaW52b2ljZVRpdGxlICE9PSB0aGlzLmRhdGEuaW52b2ljZVRpdGxlICkge1xuICAgICAgICAgICAgLy8g5LiN6ZyA6KaB6L+Z5qC355qE5Yy56YWN5qCh6aqM5LqGXG4gICAgICAgICAgICAvLyB0aGlzLmNoZWNrSGVhZGVyQW5kTm8oIGludm9pY2VUaXRsZSwgdGF4Tm8gKTtcblxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaGFzQ2hvaWNlVGl0bGU6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggaW52b2ljZVR5cGUgIT09IHRoaXMuZGF0YS5pbnZvaWNlVHlwZSApIHtcbiAgICAgICAgICAgIC8vIHRoaXMub25DaGVja0Zvcm0yKCApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBpbnZvaWNlVHlwZSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICB0YXhObzogdGF4Tm8gfHwgJycsXG4gICAgICAgICAgICBpbnZvaWNlVGl0bGU6IGludm9pY2VUaXRsZSB8fCAnJyxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmj5DkuqQgKi9cbiAgICBvblN1Ym1pdCggKSB7XG4gICAgICAgIGNvbnN0IHsgYWRkcmVzc0RldGFpbCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCB7IHJlc3VsdCwgZGF0YSB9ID0gdGhpcy5vbkNoZWNrQWxsKCApO1xuICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgIC8vIOS/oeaBr+WtmOi1t+adpVxuICAgICAgICBhcHAuc2V0JCgnRm9ybS5vcmRlckludm9pY2UnLCB7XG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgYWRkcmVzc0RldGFpbFxuICAgICAgICB9KTtcblxuICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOajgOafpeW8gOelqOS/oeaBryAqL1xuICAgIG9uQ2hlY2tLcCggKSB7XG4gICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICBjb25zdCB7IGNvbXBhbnlDaGVja0luZm9BcnIsIGludm9pY2VUaXRsZSwgdGF4Tm8sIHR5cGUgfSA9IHRoaXNfLmRhdGE7XG5cbiAgICAgICAgaWYgKCB0eXBlICE9PSBJbnZvaWNlQ2hvaWNlVHlwZS5jb21wYW55ICkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBjb21wYW55Q2hlY2tJbmZvQXJyLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiAn6K+35qC45a+55LyB5Lia5ZCN56ewJ1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIGNvbXBhbnlDaGVja0luZm9BcnIubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBjb25zdCB7IGtwTmFtZSwga3BDb2RlIH0gPSAoY29tcGFueUNoZWNrSW5mb0FyclsgMCBdIGFzIGFueSk7XG4gICAgICAgICAgICBpZiAoIGtwTmFtZSAhPT0gaW52b2ljZVRpdGxlICkge1xuICAgICAgICAgICAgICAgIHJldHVybiAn6K+35qC45a+55LyB5Lia5ZCN56ewJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGtwQ29kZSAhPT0gdGF4Tm8gKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICfnqI7lj7fplJnor6/vvIzor7fmoLjlr7knO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9IGVsc2UgaWYgKCBjb21wYW55Q2hlY2tJbmZvQXJyLmxlbmd0aCA+IDEgKSB7IFxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gY29tcGFueUNoZWNrSW5mb0Fyci5maW5kKCB4ID0+IHgua3BOYW1lID09PSBpbnZvaWNlVGl0bGUgKTtcbiAgICAgICAgICAgIGlmICggIXRhcmdldCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ+ivt+aguOWvueS8geS4muWQjeensCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQua3BDb2RlICE9PSB0YXhObyA/ICfnqI7lj7fplJnor6/vvIzor7fmoLjlr7knIDogJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0sXG5cbiAgICAvKiog5qOA5p+l5omA5pyJ6KGo5Y2VICovXG4gICAgb25DaGVja0FsbCggKSB7XG5cbiAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgYWRkcmVzc0RldGFpbCwgdHlwZSwgaGFzQ2hvaWNlVGl0bGUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3QgZm9ybTEgPSB0aGlzXy5zZWxlY3RDb21wb25lbnQoJyNmb3JtMScpO1xuICAgICAgICBjb25zdCBmb3JtMiA9IHRoaXNfLnNlbGVjdENvbXBvbmVudCgnI2Zvcm0yJyk7XG5cbiAgICAgICAgY29uc3QgcmVzMSA9IGZvcm0xLmdldERhdGEoICk7XG4gICAgICAgIGNvbnN0IHJlczIgPSBmb3JtMiA/IGZvcm0yLmdldERhdGEoICkgOiB7IHJlc3VsdDogdHJ1ZSB9O1xuXG4gICAgICAgIGNvbnN0IGVyciA9IHRpdGxlID0+IHtcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAuLi5yZXMxLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIC4uLnJlczIuZGF0YVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmo4Dmn6XooajljZVcbiAgICAgICAgICovXG4gICAgICAgIGlmICggIXJlczEucmVzdWx0IHx8ICFyZXMyLnJlc3VsdCApIHtcbiAgICAgICAgICAgIHJldHVybiBlcnIoJ+ivt+WujOWWhOihqOWNlScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOajgOafpeaKrOWktOOAgeeojuWPt1xuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCB0eXBlID09PSBJbnZvaWNlQ2hvaWNlVHlwZS5jb21wYW55ICkge1xuICAgICAgICAgICAgaWYgKCAhaGFzQ2hvaWNlVGl0bGUgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycign6K+36YCJ5oup5q2j56Gu5oqs5aS0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICog5qOA5p+l5Y+R56Wo5Zyw5Z2AXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIHR5cGUgIT09IEludm9pY2VDaG9pY2VUeXBlLm5vbmVlZCAmJiAhYWRkcmVzc0RldGFpbCApIHtcbiAgICAgICAgICAgIHJldHVybiBlcnIoJ+aUtuelqOWcsOWdgOS4jeiDveS4uuepuicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3VsdDogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAuLi5yZXMxLmRhdGEsXG4gICAgICAgICAgICAgICAgLi4ucmVzMi5kYXRhLFxuICAgICAgICAgICAgICAgIGludm9pY2VUaXRsZTogcmVzMS5kYXRhLmludm9pY2VUaXRsZSB8fCAn5Liq5Lq6J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqIOajgOafpeagh+WNlSAqL1xuICAgIG9uQ2hlY2tGb3JtMiggKSB7XG4gICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICBjb25zdCBmb3JtMiA9IHRoaXNfLnNlbGVjdENvbXBvbmVudCgnI2Zvcm0yJyk7XG4gICAgICAgIGlmICggISFmb3JtMiApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgICAgICBmb3JtMi5nZXREYXRhKCApO1xuICAgICAgICAgICAgfSwgMTAwICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqIOWcsOWdgOmAieaLqSAqL1xuICAgIG9uQWRkcmVzc0NoYW5nZSh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgYWRkcmVzc0RldGFpbDogZGV0YWlsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog6YCJ5oup5LqG5Y+R56Wo5oqs5aS05YWs5Y+4ICovXG4gICAgb25Db25maXJtVGl0bGUoIGUgKSB7XG4gICAgICAgIGNvbnN0IHsga3BDb2RlLCBhY2NvdW50QmxhbmssIGJhbmtBY2NvdW50LCBrcEFkZHIsIGtwVGVsLCBrcE5hbWUgfSA9IGU7XG4gICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICBjb25zdCBmb3JtMSA9IHRoaXNfLnNlbGVjdENvbXBvbmVudCgnI2Zvcm0xJyk7XG4gICAgICAgIGNvbnN0IGZvcm0yID0gdGhpc18uc2VsZWN0Q29tcG9uZW50KCcjZm9ybTInKTtcbiAgICBcbiAgICAgICAgZm9ybTEuc2V0KHtcbiAgICAgICAgICAgIHRheE5vOiBrcENvZGUsXG4gICAgICAgICAgICBpbnZvaWNlVGl0bGU6IGtwTmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICAhIWZvcm0yICYmIGZvcm0yLnNldCh7XG4gICAgICAgICAgICBvcGVuaW5nQmFuazogYWNjb3VudEJsYW5rLFxuICAgICAgICAgICAgYmFua0FjY291bnQ6IGJhbmtBY2NvdW50LFxuICAgICAgICAgICAgZW50ZXJwcmlzZUFkZHJlc3M6IGtwQWRkcixcbiAgICAgICAgICAgIGVudGVycHJpc2VUZWxlcGhvbmU6IGtwVGVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaGFzQ2hvaWNlVGl0bGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uTG9hZCggcXVlcnk6IGFueSApIHtcbiAgICAgICAgY29uc3QgeyBlZGl0aW5nLCBkZWZhdWx0QWRkcmVzcyB9ID0gcXVlcnk7XG5cbiAgICAgICAgdGhpcy53YXRjaEFwcCggKTtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcblxuICAgICAgICBpZiAoIGVkaXRpbmcgPT09ICcxJyApIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEVkaXQoICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpbml0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYWRkcmVzc0lkOiBkZWZhdWx0QWRkcmVzcyB8fCAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcblxuICAgIG9uU2hvdyggKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgcmVmcmVzaDogKE1hdGgucmFuZG9tKCApICogOTk5OSkudG9GaXhlZCggMCApXG4gICAgICAgIH0pXG4gICAgfVxufSlcbiJdfQ==