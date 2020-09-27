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
var http_1 = require("../../utils/http");
var index_1 = require("../../lib/vuefy/index");
var util_1 = require("../../utils/util");
var app = getApp();
Page({
    data: {
        isIPhoneX: false,
        id: '',
        detail: null
    },
    runComputed: function () {
        index_1.computed(this, {
            formMeta$: function () {
                var id = this.data.id;
                return [
                    {
                        key: 'receiverName',
                        label: '收件人    ',
                        type: 'input',
                        max: 50,
                        width: '90rpx',
                        placeholder: '请输入收件人姓名',
                        value: undefined,
                        rules: [{
                                validate: function (val) { return !!val; },
                                message: '收件人不能为空'
                            }]
                    }, {
                        key: 'receiverTelephone',
                        label: '手机号码',
                        type: 'number',
                        placeholder: '请输入收件人手机号码',
                        value: undefined,
                        rules: [{
                                validate: function (val) { return !!val; },
                                message: '手机号码不能为空'
                            }, {
                                validate: function (val) { return !!val && String(val).length === 11; },
                                message: '请填写正确手机号码'
                            }]
                    }, {
                        key: 'area',
                        label: '所在地区',
                        type: 'area',
                        placeholder: '请选择省市区',
                        value: undefined,
                        initData: !!id ? false : true,
                        rules: [{
                                validate: function (val) { return !!val && val.length > 0; },
                                message: '省市区不能为空'
                            }]
                    }, {
                        key: 'receiverAddress',
                        label: '详细地址',
                        type: 'input',
                        placeholder: '请输入详细地址',
                        value: undefined,
                        rules: [{
                                validate: function (val) { return !!val; },
                                message: '详细地址不能为空'
                            }]
                    }, {
                        key: 'isDefault',
                        label: '设为默认地址',
                        type: 'trueOrFalse',
                        value: undefined,
                    }
                ];
            }
        });
    },
    fetchDetail: function (id) {
        var _this = this;
        if (!id) {
            return;
        }
        http_1.http({
            path: "/apis/address/detail/" + id
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            var this_ = _this;
            var meta = util_1.addressToFront(data);
            var form1 = this_.selectComponent('#form');
            var receiverName = data.receiverName, receiverTelephone = data.receiverTelephone, receiverAddress = data.receiverAddress, isDefault = data.isDefault, receiverCountyName = data.receiverCountyName, receiverCountyCode = data.receiverCountyCode, receiverProvinceName = data.receiverProvinceName, receiverProvinceCode = data.receiverProvinceCode, receiverCityCode = data.receiverCityCode, receiverCityName = data.receiverCityName;
            _this.setData({
                detail: meta
            });
            var addressDefault = [
                {
                    areaCode: receiverProvinceCode,
                    areaName: receiverProvinceName
                }, {
                    areaCode: receiverCityCode,
                    areaName: receiverCityName
                }, {
                    areaCode: receiverCountyCode,
                    areaName: receiverCountyName
                }
            ];
            form1.set({
                receiverName: receiverName,
                receiverTelephone: receiverTelephone,
                receiverAddress: receiverAddress,
                isDefault: isDefault === '1' ? true : false,
                area: addressDefault
            });
        });
    },
    setDefault: function (id) {
        var _this = this;
        if (!id) {
            return;
        }
        http_1.http({
            method: 'PUT',
            path: "/apis/address/set-default/" + id
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            wx.showToast({
                title: _this.data.id ? '更新成功!' : '创建成功！'
            });
        });
    },
    onFormChange: function (e) {
    },
    onDelete: function () {
        var id = this.data.id;
        if (!id) {
            return;
        }
        wx.showModal({
            title: '提示',
            content: '确定删除吗?',
            success: function (res) {
                if (!res.confirm) {
                    return;
                }
                http_1.http({
                    method: 'DELETE',
                    path: "/apis/address/remove?ids=" + id
                }).then(function (res) {
                    var status = res.status, data = res.data;
                    if (status !== 200) {
                        return;
                    }
                    wx.showToast({
                        title: '删除成功'
                    });
                    wx.navigateBack({
                        delta: 1
                    });
                });
            }
        });
    },
    onCreate: function (reqData) {
        var _this = this;
        http_1.http({
            data: reqData,
            method: 'POST',
            path: "/apis/address/save"
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            wx.showToast({
                title: '创建成功'
            });
            _this.setData({
                detail: data
            });
            if (data.isDefault === '1') {
                _this.setDefault(data.id);
            }
            app.set$('Form.lastCreateAddressId', data.id);
            wx.navigateBack({
                delta: 1
            });
        });
    },
    onEdit: function (reqData) {
        var _this = this;
        http_1.http({
            data: reqData,
            method: 'PUT',
            path: "/apis/address/update"
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            wx.showToast({
                title: '更新成功'
            });
            if (data.isDefault === '1') {
                _this.setDefault(data.id);
            }
            app.set$('Form.lastCreateAddressId', data.id);
            wx.navigateBack({
                delta: 1
            });
        });
    },
    onSubmit: function () {
        var this_ = this;
        var detail = this_.data.detail;
        var _a = this.onCheck(), result = _a.result, data = _a.data;
        if (!result) {
            return;
        }
        var reqData = __assign({}, util_1.addressToBack(data), { memberId: app.store.Auth.sysUserInfo.id });
        if (!!detail) {
            reqData = __assign({}, reqData, { id: detail.id, dedupKey: String(new Date().getTime()) });
        }
        if (!detail) {
            this.onCreate(reqData);
        }
        else {
            this.onEdit(reqData);
        }
    },
    onCheck: function () {
        var this_ = this;
        var form1 = this_.selectComponent('#form');
        var res = form1.getData();
        if (!res.result) {
            wx.showToast({
                icon: 'none',
                title: '请完善表单',
            });
        }
        return __assign({}, res);
    },
    transferToBack: function (meta) {
        var result = __assign({}, meta);
        var area = meta.area.slice();
        var provice = area[0];
        var city = area[1];
        var county = area[2];
        if (!!provice) {
            result = __assign({}, result, { receiverProvinceCode: provice.value, receiverProvinceName: provice.label });
        }
        if (!!city) {
            result = __assign({}, result, { receiverCityCode: city.value, receiverCityName: city.label });
        }
        if (!!county) {
            result = __assign({}, result, { receiverCountyCode: county.value, receiverCountyName: county.label });
        }
        result = __assign({}, result, { isDefault: result.isDefault ? '1' : '0' });
        return result;
    },
    watchApp: function () {
        var _this = this;
        app.watch$('Common.isIPhoneX', function (v) {
            _this.setData({
                isIPhoneX: v
            });
        });
    },
    onLoad: function (options) {
        var _this = this;
        var id = options.id;
        this.watchApp();
        this.runComputed();
        this.fetchDetail(id);
        this.setData({
            id: id
        });
        setTimeout(function () {
            _this.setData({
                inited: true
            });
        }, 100);
    },
    onShow: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEseUNBQXdDO0FBQ3hDLCtDQUFpRDtBQUVqRCx5Q0FBaUU7QUFFakUsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFXLENBQUM7QUFFOUIsSUFBSSxDQUFDO0lBRUQsSUFBSSxFQUFFO1FBRUYsU0FBUyxFQUFFLEtBQUs7UUFHaEIsRUFBRSxFQUFFLEVBQUU7UUFHTixNQUFNLEVBQUUsSUFBSTtLQUNmO0lBRUQsV0FBVztRQUNQLGdCQUFRLENBQUUsSUFBSSxFQUFFO1lBR1osU0FBUyxFQUFFO2dCQUNDLElBQUEsaUJBQUUsQ0FBZTtnQkFDekIsT0FBTztvQkFDSDt3QkFDSSxHQUFHLEVBQUUsY0FBYzt3QkFDbkIsS0FBSyxFQUFFLFNBQVM7d0JBQ2hCLElBQUksRUFBRSxPQUFPO3dCQUNiLEdBQUcsRUFBRSxFQUFFO3dCQUNQLEtBQUssRUFBRSxPQUFPO3dCQUNkLFdBQVcsRUFBRSxVQUFVO3dCQUN2QixLQUFLLEVBQUUsU0FBUzt3QkFDaEIsS0FBSyxFQUFFLENBQUM7Z0NBQ04sUUFBUSxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLO2dDQUN0QixPQUFPLEVBQUUsU0FBUzs2QkFDbkIsQ0FBQztxQkFDTCxFQUFFO3dCQUNDLEdBQUcsRUFBRSxtQkFBbUI7d0JBQ3hCLEtBQUssRUFBRSxNQUFNO3dCQUNiLElBQUksRUFBRSxRQUFRO3dCQUNkLFdBQVcsRUFBRSxZQUFZO3dCQUN6QixLQUFLLEVBQUUsU0FBUzt3QkFDaEIsS0FBSyxFQUFFLENBQUM7Z0NBQ04sUUFBUSxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLO2dDQUN0QixPQUFPLEVBQUUsVUFBVTs2QkFDcEIsRUFBRTtnQ0FDQyxRQUFRLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBRSxHQUFHLENBQUUsQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFwQyxDQUFvQztnQ0FDckQsT0FBTyxFQUFFLFdBQVc7NkJBQ3JCLENBQUM7cUJBQ1AsRUFBRTt3QkFDQyxHQUFHLEVBQUUsTUFBTTt3QkFDWCxLQUFLLEVBQUUsTUFBTTt3QkFDYixJQUFJLEVBQUUsTUFBTTt3QkFDWixXQUFXLEVBQUUsUUFBUTt3QkFDckIsS0FBSyxFQUFFLFNBQVM7d0JBQ2hCLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUk7d0JBQzdCLEtBQUssRUFBRSxDQUFDO2dDQUNOLFFBQVEsRUFBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQXZCLENBQXVCO2dDQUN4QyxPQUFPLEVBQUUsU0FBUzs2QkFDbkIsQ0FBQztxQkFDTCxFQUFFO3dCQUNDLEdBQUcsRUFBRSxpQkFBaUI7d0JBQ3RCLEtBQUssRUFBRSxNQUFNO3dCQUNiLElBQUksRUFBRSxPQUFPO3dCQUNiLFdBQVcsRUFBRSxTQUFTO3dCQUN0QixLQUFLLEVBQUUsU0FBUzt3QkFDaEIsS0FBSyxFQUFFLENBQUM7Z0NBQ04sUUFBUSxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEdBQUcsRUFBTCxDQUFLO2dDQUN0QixPQUFPLEVBQUUsVUFBVTs2QkFDcEIsQ0FBQztxQkFDTCxFQUFFO3dCQUNDLEdBQUcsRUFBRSxXQUFXO3dCQUNoQixLQUFLLEVBQUUsUUFBUTt3QkFDZixJQUFJLEVBQUUsYUFBYTt3QkFDbkIsS0FBSyxFQUFFLFNBQVM7cUJBQ25CO2lCQUNKLENBQUM7WUFDTixDQUFDO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFdBQVcsWUFBRSxFQUFFO1FBQWYsaUJBeUNDO1FBeENHLElBQUssQ0FBQyxFQUFFLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDdEIsV0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFLDBCQUF3QixFQUFJO1NBQ3JDLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHO1lBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztZQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQUUsT0FBTzthQUFFO1lBRWpDLElBQU0sS0FBSyxHQUFRLEtBQUksQ0FBQztZQUN4QixJQUFNLElBQUksR0FBRyxxQkFBYyxDQUFFLElBQUksQ0FBRSxDQUFBO1lBQ25DLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckMsSUFBQSxnQ0FBWSxFQUFFLDBDQUFpQixFQUFFLHNDQUFlLEVBQUUsMEJBQVMsRUFBRSw0Q0FBa0IsRUFBRSw0Q0FBa0IsRUFDdkcsZ0RBQW9CLEVBQUUsZ0RBQW9CLEVBQUUsd0NBQWdCLEVBQUUsd0NBQWdCLENBQVk7WUFFOUYsS0FBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixNQUFNLEVBQUUsSUFBSTthQUNmLENBQUMsQ0FBQztZQUVILElBQU0sY0FBYyxHQUFHO2dCQUNuQjtvQkFDSSxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsb0JBQW9CO2lCQUNqQyxFQUFFO29CQUNDLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzdCLEVBQUU7b0JBQ0MsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFLGtCQUFrQjtpQkFDL0I7YUFDSixDQUFBO1lBR0QsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDTixZQUFZLGNBQUE7Z0JBQ1osaUJBQWlCLG1CQUFBO2dCQUNqQixlQUFlLGlCQUFBO2dCQUNmLFNBQVMsRUFBRSxTQUFTLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7Z0JBQzNDLElBQUksRUFBRSxjQUFjO2FBQ3ZCLENBQUMsQ0FBQztRQUVQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFVBQVUsWUFBRSxFQUFFO1FBQWQsaUJBWUM7UUFYRyxJQUFLLENBQUMsRUFBRSxFQUFHO1lBQUUsT0FBTztTQUFFO1FBQ3RCLFdBQUksQ0FBQztZQUNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLCtCQUE2QixFQUFJO1NBQzFDLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHO1lBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztZQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQUUsT0FBTzthQUFFO1lBQ2pDLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1QsS0FBSyxFQUFFLEtBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU87YUFDMUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsWUFBWSxZQUFFLENBQUM7SUFFZixDQUFDO0lBR0QsUUFBUTtRQUNJLElBQUEsaUJBQUUsQ0FBZTtRQUN6QixJQUFLLENBQUMsRUFBRSxFQUFHO1lBQUUsT0FBTztTQUFFO1FBRXRCLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDVCxLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE9BQU8sWUFBRSxHQUFHO2dCQUNSLElBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO29CQUFFLE9BQU87aUJBQUM7Z0JBQzdCLFdBQUksQ0FBQztvQkFDRCxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsSUFBSSxFQUFFLDhCQUE0QixFQUFJO2lCQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRztvQkFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO29CQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7d0JBQUUsT0FBTztxQkFBRTtvQkFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFDVCxLQUFLLEVBQUUsTUFBTTtxQkFDaEIsQ0FBQyxDQUFDO29CQUNILEVBQUUsQ0FBQyxZQUFZLENBQUM7d0JBQ1osS0FBSyxFQUFFLENBQUM7cUJBQ1gsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUVQLENBQUM7SUFHRCxRQUFRLFlBQUUsT0FBTztRQUFqQixpQkFzQkM7UUFyQkcsV0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFLE9BQU87WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxvQkFBb0I7U0FDN0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUc7WUFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO1lBQzdCLElBQUssTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDVCxLQUFLLEVBQUUsTUFBTTthQUNoQixDQUFDLENBQUM7WUFDSCxLQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsSUFBSyxJQUFJLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBRztnQkFDMUIsS0FBSSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUMsRUFBRSxDQUFFLENBQUM7YUFDOUI7WUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUUsQ0FBQztZQUMvQyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUNaLEtBQUssRUFBRSxDQUFDO2FBQ1gsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsTUFBTSxZQUFFLE9BQU87UUFBZixpQkFtQkM7UUFsQkcsV0FBSSxDQUFDO1lBQ0QsSUFBSSxFQUFFLE9BQU87WUFDYixNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxzQkFBc0I7U0FDL0IsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFBLEdBQUc7WUFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO1lBQzdCLElBQUssTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDVCxLQUFLLEVBQUUsTUFBTTthQUNoQixDQUFDLENBQUM7WUFDSCxJQUFLLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFHO2dCQUMxQixLQUFJLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxFQUFFLENBQUUsQ0FBQzthQUM5QjtZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ1osS0FBSyxFQUFFLENBQUM7YUFDWCxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHRCxRQUFRO1FBQ0osSUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO1FBQ2hCLElBQUEsMEJBQU0sQ0FBZ0I7UUFDeEIsSUFBQSxtQkFBa0MsRUFBaEMsa0JBQU0sRUFBRSxjQUF3QixDQUFDO1FBRXpDLElBQUssQ0FBQyxNQUFNLEVBQUc7WUFBRSxPQUFPO1NBQUU7UUFDMUIsSUFBSSxPQUFPLGdCQUVKLG9CQUFhLENBQUUsSUFBSSxDQUFFLElBQ3hCLFFBQVEsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxHQUMxQyxDQUFDO1FBRUYsSUFBSyxDQUFDLENBQUMsTUFBTSxFQUFHO1lBQ1osT0FBTyxnQkFDQSxPQUFPLElBQ1YsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQ3pDLENBQUM7U0FDTDtRQUVELElBQUssQ0FBQyxNQUFNLEVBQUc7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBRSxDQUFBO1NBQzNCO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxDQUFFLE9BQU8sQ0FBRSxDQUFDO1NBQzFCO0lBRUwsQ0FBQztJQUdELE9BQU87UUFDSCxJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7UUFDeEIsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFHLENBQUM7UUFFN0IsSUFBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUc7WUFDZixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNULElBQUksRUFBRSxNQUFNO2dCQUNaLEtBQUssRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQztTQUNOO1FBRUQsb0JBQ08sR0FBRyxFQUNUO0lBQ0wsQ0FBQztJQUdELGNBQWMsWUFBRSxJQUFJO1FBQ2hCLElBQUksTUFBTSxnQkFBUSxJQUFJLENBQUUsQ0FBQztRQUN6QixJQUFNLElBQUksR0FBUSxJQUFJLENBQUMsSUFBSSxRQUFFLENBQUM7UUFDOUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFFLENBQUMsQ0FBRSxDQUFDO1FBQzFCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQztRQUN2QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUUsQ0FBQyxDQUFFLENBQUM7UUFFekIsSUFBSyxDQUFDLENBQUMsT0FBTyxFQUFHO1lBQ2IsTUFBTSxnQkFDQyxNQUFNLElBQ1Qsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDbkMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLEtBQUssR0FDdEMsQ0FBQztTQUNMO1FBRUQsSUFBSyxDQUFDLENBQUMsSUFBSSxFQUFHO1lBQ1YsTUFBTSxnQkFDQyxNQUFNLElBQ1QsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFDNUIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FDL0IsQ0FBQztTQUNMO1FBRUQsSUFBSyxDQUFDLENBQUMsTUFBTSxFQUFHO1lBQ1osTUFBTSxnQkFDQyxNQUFNLElBQ1Qsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFDaEMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FDbkMsQ0FBQztTQUNMO1FBRUQsTUFBTSxnQkFDQyxNQUFNLElBQ1QsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUMxQyxDQUFBO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUdELFFBQVE7UUFBUixpQkFPQztRQU5HLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsVUFBQSxDQUFDO1lBRTVCLEtBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsU0FBUyxFQUFFLENBQUM7YUFDZixDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLFlBQUUsT0FBTztRQUFmLGlCQWlCQztRQWhCVyxJQUFBLGVBQUUsQ0FBc0I7UUFFaEMsSUFBSSxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEVBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFFLEVBQUUsQ0FBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixFQUFFLElBQUE7U0FDTCxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUM7WUFFUCxLQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFFLEdBQUcsQ0FBRSxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU07SUFFTixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IHsgSUFwcCB9IGZyb20gXCIuLi8uLi9nbG9iYWxcIjtcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4JztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUnO1xuaW1wb3J0IHsgYWRkcmVzc1RvRnJvbnQsIGFkZHJlc3NUb0JhY2sgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPCBJQXBwID4oICk7XG5cblBhZ2Uoe1xuXG4gICAgZGF0YToge1xuXG4gICAgICAgIGlzSVBob25lWDogZmFsc2UsXG5cbiAgICAgICAgLy8gaWRcbiAgICAgICAgaWQ6ICcnLFxuXG4gICAgICAgIC8vIOivpuaDhVxuICAgICAgICBkZXRhaWw6IG51bGxcbiAgICB9LFxuXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvLyDooajljZVcbiAgICAgICAgICAgIGZvcm1NZXRhJDogZnVuY3Rpb24oICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdyZWNlaXZlck5hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICfmlLbku7bkurogICAgJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXg6IDUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc5MHJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ+ivt+i+k+WFpeaUtuS7tuS6uuWnk+WQjScsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gISF2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfmlLbku7bkurrkuI3og73kuLrnqbonXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdyZWNlaXZlclRlbGVwaG9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+aJi+acuuWPt+eggScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn6K+36L6T5YWl5pS25Lu25Lq65omL5py65Y+356CBJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IHZhbCA9PiAhIXZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+aJi+acuuWPt+eggeS4jeiDveS4uuepuidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+ICEhdmFsICYmIFN0cmluZyggdmFsICkubGVuZ3RoID09PSAxMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6K+35aGr5YaZ5q2j56Gu5omL5py65Y+356CBJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdhcmVhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn5omA5Zyo5Zyw5Yy6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcmVhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn6K+36YCJ5oup55yB5biC5Yy6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0RGF0YTogISFpZCA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZTogdmFsID0+ICEhdmFsICYmIHZhbC5sZW5ndGggPiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn55yB5biC5Yy65LiN6IO95Li656m6J1xuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiAncmVjZWl2ZXJBZGRyZXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn6K+m57uG5Zyw5Z2AJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ+ivt+i+k+WFpeivpue7huWcsOWdgCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlOiB2YWwgPT4gISF2YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfor6bnu4blnLDlnYDkuI3og73kuLrnqbonXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdpc0RlZmF1bHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICforr7kuLrpu5jorqTlnLDlnYAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RydWVPckZhbHNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pOyBcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluivpuaDhSAqL1xuICAgIGZldGNoRGV0YWlsKCBpZCApIHtcbiAgICAgICAgaWYgKCAhaWQgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9hZGRyZXNzL2RldGFpbC8ke2lkfWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCBtZXRhID0gYWRkcmVzc1RvRnJvbnQoIGRhdGEgKVxuICAgICAgICAgICAgY29uc3QgZm9ybTEgPSB0aGlzXy5zZWxlY3RDb21wb25lbnQoJyNmb3JtJyk7XG4gICAgICAgICAgICBjb25zdCB7IHJlY2VpdmVyTmFtZSwgcmVjZWl2ZXJUZWxlcGhvbmUsIHJlY2VpdmVyQWRkcmVzcywgaXNEZWZhdWx0LCByZWNlaXZlckNvdW50eU5hbWUsIHJlY2VpdmVyQ291bnR5Q29kZSxcbiAgICAgICAgICAgICAgICByZWNlaXZlclByb3ZpbmNlTmFtZSwgcmVjZWl2ZXJQcm92aW5jZUNvZGUsIHJlY2VpdmVyQ2l0eUNvZGUsIHJlY2VpdmVyQ2l0eU5hbWUsICB9ID0gZGF0YTtcblxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiBtZXRhXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgYWRkcmVzc0RlZmF1bHQgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhcmVhQ29kZTogcmVjZWl2ZXJQcm92aW5jZUNvZGUsXG4gICAgICAgICAgICAgICAgICAgIGFyZWFOYW1lOiByZWNlaXZlclByb3ZpbmNlTmFtZVxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYUNvZGU6IHJlY2VpdmVyQ2l0eUNvZGUsXG4gICAgICAgICAgICAgICAgICAgIGFyZWFOYW1lOiByZWNlaXZlckNpdHlOYW1lXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBhcmVhQ29kZTogcmVjZWl2ZXJDb3VudHlDb2RlLFxuICAgICAgICAgICAgICAgICAgICBhcmVhTmFtZTogcmVjZWl2ZXJDb3VudHlOYW1lIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgLy8g6K6+572u6KGo5Y2VXG4gICAgICAgICAgICBmb3JtMS5zZXQoe1xuICAgICAgICAgICAgICAgIHJlY2VpdmVyTmFtZSxcbiAgICAgICAgICAgICAgICByZWNlaXZlclRlbGVwaG9uZSxcbiAgICAgICAgICAgICAgICByZWNlaXZlckFkZHJlc3MsXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBpc0RlZmF1bHQgPT09ICcxJyA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhcmVhOiBhZGRyZXNzRGVmYXVsdFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDorr7nva7kuLrpu5jorqQgKi9cbiAgICBzZXREZWZhdWx0KCBpZCApIHtcbiAgICAgICAgaWYgKCAhaWQgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICBwYXRoOiBgL2FwaXMvYWRkcmVzcy9zZXQtZGVmYXVsdC8ke2lkfWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZGF0YS5pZCA/ICfmm7TmlrDmiJDlip8hJyA6ICfliJvlu7rmiJDlip/vvIEnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDooajljZXmm7TmlLkgKi9cbiAgICBvbkZvcm1DaGFuZ2UoIGUgKSB7XG5cbiAgICB9LFxuXG4gICAgLyoqIOWIoOmZpCAqL1xuICAgIG9uRGVsZXRlKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAoICFpZCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfnoa7lrprliKDpmaTlkJc/JyxcbiAgICAgICAgICAgIHN1Y2Nlc3MgKHJlcykge1xuICAgICAgICAgICAgICAgIGlmICggIXJlcy5jb25maXJtKSB7IHJldHVybjt9XG4gICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9hZGRyZXNzL3JlbW92ZT9pZHM9JHtpZH1gXG4gICAgICAgICAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+WIoOmZpOaIkOWKnydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWx0YTogMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgLyoqIOWIm+W7uiAqL1xuICAgIG9uQ3JlYXRlKCByZXFEYXRhICkge1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9hZGRyZXNzL3NhdmVgXG4gICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn5Yib5bu65oiQ5YqfJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCBkYXRhLmlzRGVmYXVsdCA9PT0gJzEnICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdCggZGF0YS5pZCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXBwLnNldCQoJ0Zvcm0ubGFzdENyZWF0ZUFkZHJlc3NJZCcsIGRhdGEuaWQgKTtcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOe8lui+kSAqL1xuICAgIG9uRWRpdCggcmVxRGF0YSApIHtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9hZGRyZXNzL3VwZGF0ZWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfmm7TmlrDmiJDlip8nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICggZGF0YS5pc0RlZmF1bHQgPT09ICcxJyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERlZmF1bHQoIGRhdGEuaWQgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFwcC5zZXQkKCdGb3JtLmxhc3RDcmVhdGVBZGRyZXNzSWQnLCBkYXRhLmlkICk7XG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICAgIGRlbHRhOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDmj5DkuqQgKi9cbiAgICBvblN1Ym1pdCggKSB7XG4gICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICBjb25zdCB7IGRldGFpbCB9ID0gdGhpc18uZGF0YTtcbiAgICAgICAgY29uc3QgeyByZXN1bHQsIGRhdGEgfSA9IHRoaXMub25DaGVjayggKTtcblxuICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybjsgfVxuICAgICAgICBsZXQgcmVxRGF0YSA9IHtcbiAgICAgICAgICAgIC8vIC4uLnRoaXMudHJhbnNmZXJUb0JhY2soIGRhdGEgKSxcbiAgICAgICAgICAgIC4uLmFkZHJlc3NUb0JhY2soIGRhdGEgKSxcbiAgICAgICAgICAgIG1lbWJlcklkOiBhcHAuc3RvcmUuQXV0aC5zeXNVc2VySW5mby5pZFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICggISFkZXRhaWwgKSB7XG4gICAgICAgICAgICByZXFEYXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLnJlcURhdGEsXG4gICAgICAgICAgICAgICAgaWQ6IGRldGFpbC5pZCxcbiAgICAgICAgICAgICAgICBkZWR1cEtleTogU3RyaW5nKG5ldyBEYXRlKCkuZ2V0VGltZSgpKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggIWRldGFpbCApIHtcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGUoIHJlcURhdGEgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkVkaXQoIHJlcURhdGEgKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LFxuXG4gICAgLyoqIOajgOafpSAqL1xuICAgIG9uQ2hlY2soICkge1xuICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm9ybTEgPSB0aGlzXy5zZWxlY3RDb21wb25lbnQoJyNmb3JtJyk7XG4gICAgICAgIGNvbnN0IHJlcyA9IGZvcm0xLmdldERhdGEoICk7XG5cbiAgICAgICAgaWYgKCAhcmVzLnJlc3VsdCApIHtcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+35a6M5ZaE6KGo5Y2VJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnJlc1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKiDovazmjaLmlbDmja4sIOaKiue7hOS7tuaVsOaNru+8jOi9rOaNouS4uuWQjuWPsOWtl+autSAqL1xuICAgIHRyYW5zZmVyVG9CYWNrKCBtZXRhICkge1xuICAgICAgICBsZXQgcmVzdWx0ID0geyAuLi5tZXRhIH07XG4gICAgICAgIGNvbnN0IGFyZWEgPSBbIC4uLm1ldGEuYXJlYSBdO1xuICAgICAgICBjb25zdCBwcm92aWNlID0gYXJlYVsgMCBdO1xuICAgICAgICBjb25zdCBjaXR5ID0gYXJlYVsgMSBdO1xuICAgICAgICBjb25zdCBjb3VudHkgPSBhcmVhWyAyIF07XG5cbiAgICAgICAgaWYgKCAhIXByb3ZpY2UgKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVyUHJvdmluY2VDb2RlOiBwcm92aWNlLnZhbHVlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVyUHJvdmluY2VOYW1lOiBwcm92aWNlLmxhYmVsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAhIWNpdHkgKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVyQ2l0eUNvZGU6IGNpdHkudmFsdWUsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZXJDaXR5TmFtZTogY2l0eS5sYWJlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggISFjb3VudHkgKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVyQ291bnR5Q29kZTogY291bnR5LnZhbHVlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVyQ291bnR5TmFtZTogY291bnR5LmxhYmVsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IFxuXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgIGlzRGVmYXVsdDogcmVzdWx0LmlzRGVmYXVsdCA/ICcxJyA6ICcwJ1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrCAqL1xuICAgIHdhdGNoQXBwKCApIHtcbiAgICAgICAgYXBwLndhdGNoJCgnQ29tbW9uLmlzSVBob25lWCcsIHYgPT4ge1xuICAgICAgICAgICAgIC8vIOWFvOWuuWlwb25lWFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXNJUGhvbmVYOiB2XG4gICAgICAgICAgICB9KSBcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uTG9hZCggb3B0aW9ucyApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gKG9wdGlvbnMgYXMgYW55KTtcblxuICAgICAgICB0aGlzLndhdGNoQXBwKCApO1xuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICB0aGlzLmZldGNoRGV0YWlsKCBpZCApO1xuXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgaWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgLy8g6KGo5Y2V5LyY5YyWXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpbml0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDAgKTtcbiAgICB9LFxuXG4gICAgb25TaG93KCApIHtcblxuICAgIH1cbn0pXG4iXX0=