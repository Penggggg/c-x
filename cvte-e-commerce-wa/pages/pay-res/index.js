"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var index_1 = require("../../lib/vuefy/index");
var app = getApp();
Page({
    data: {
        page_state: 'WAIT_REMIT',
        bank_info: {
            name: '中国工商银行股份有限公司广州科学城支行',
            number: '3602 0907 0920 0131 619',
            company: '广州视臻信息科技有限公司'
        },
        dic: {
            WAIT_REMIT: 'WAIT_REMIT',
            WAIT_UPLOAD: 'WAIT_UPLOAD',
            WAIT_CHECK: 'WAIT_CHECK',
        },
        omsCode: ''
    },
    orderNo: '',
    pipePhotos: [],
    enterTime: 0,
    runComputed: function () {
        index_1.computed(this, {});
    },
    onCopyCard: function (e) {
        var bank_info = this.data.bank_info;
        wx.setClipboardData({
            data: "\u5F00\u6237\u884C: " + bank_info.name + "\n\u516C\u53F8\u540D\u79F0: " + bank_info.company + "\n\u8D26\u6237: " + bank_info.number.replace(/\s/g, ''),
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功'
                        });
                    }
                });
            }
        });
    },
    onGoHome: function (e) {
        wx.redirectTo({
            url: "/pages/main-page/index",
        });
    },
    onRemit: function (e) {
        wx.redirectTo({
            url: "/pages/pay-res/index?state=WAIT_UPLOAD&no=" + this.orderNo,
        });
    },
    onNavToOrderList: function (e) {
        wx.redirectTo({
            url: "/pages/order-detail/index?no=" + this.orderNo,
        });
    },
    onSubmit: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!this.pipePhotos.length) return [3, 2];
                        app.dataBury$([{
                                "$code": "submitOrder",
                                "$ts": new Date().getTime(),
                                "orderNo": this.orderNo
                            }]);
                        return [4, http_1.http({
                                method: 'put',
                                path: "/apis/order/upload_water_list/" + this.orderNo
                            })];
                    case 1:
                        _a.sent();
                        wx.redirectTo({
                            url: "/pages/pay-res/index?state=WAIT_CHECK&no=" + this.orderNo,
                        });
                        return [3, 3];
                    case 2:
                        wx.showToast({
                            icon: 'none',
                            mask: true,
                            title: '请上传图片',
                        });
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    },
    onImgChange: function (e) {
        console.log(e.detail);
        this.pipePhotos = e.detail;
    },
    onTabChange: function (_a) {
        var detail = _a.detail;
    },
    onLoad: function (q) {
        console.log('我的query', q.no);
        this.setData({
            page_state: q.state
        });
        this.orderNo = q.no;
        q.state === 'WAIT_UPLOAD' && this.getOmsNo();
    },
    getOmsNo: function () {
        var _this = this;
        http_1.http({
            method: 'post',
            path: "/apis/order/getOmsNo",
            data: [this.orderNo]
        }).then(function (val) {
            if (val.status !== 200) {
                console.error('获取单号出错,数据为', val.data);
                return;
            }
            _this.setData({
                omsCode: val.data[0].soCode
            });
        });
    },
    onHide: function () {
        this.data.page_state === 'WAIT_REMIT' && app.dataBury$([{
                "$code": "bankNo",
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime()
            }]);
        this.data.page_state === 'WAIT_UPLOAD' && app.dataBury$([{
                "$code": "pipeNo",
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime()
            }]);
        this.enterTime = 0;
    },
    onShow: function () {
        this.enterTime = new Date().getTime();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEseUNBQXdDO0FBQ3hDLCtDQUFpRDtBQUdqRCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUUzQixJQUFJLENBQUM7SUFDRCxJQUFJLEVBQUU7UUFDRixVQUFVLEVBQUUsWUFBWTtRQUN4QixTQUFTLEVBQUU7WUFDUCxJQUFJLEVBQUUscUJBQXFCO1lBQzNCLE1BQU0sRUFBRSx5QkFBeUI7WUFDakMsT0FBTyxFQUFFLGNBQWM7U0FDMUI7UUFFRCxHQUFHLEVBQUU7WUFDRCxVQUFVLEVBQUUsWUFBWTtZQUN4QixXQUFXLEVBQUUsYUFBYTtZQUMxQixVQUFVLEVBQUUsWUFBWTtTQUMzQjtRQUVELE9BQU8sRUFBRSxFQUFFO0tBQ2Q7SUFHRCxPQUFPLEVBQUUsRUFBRTtJQUdYLFVBQVUsRUFBRSxFQUFFO0lBRWQsU0FBUyxFQUFFLENBQUM7SUFFWixXQUFXO1FBQ1AsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsRUFHZCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsVUFBVSxZQUFDLENBQUM7UUFDQSxJQUFBLCtCQUFTLENBQWU7UUFDaEMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1lBQ2hCLElBQUksRUFBRSx5QkFBUSxTQUFTLENBQUMsSUFBSSxvQ0FBVyxTQUFTLENBQUMsT0FBTyx3QkFBUyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFHO1lBQ3RHLE9BQU8sRUFBRSxVQUFVLEdBQUc7Z0JBQ2xCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDaEIsT0FBTyxFQUFFLFVBQVUsR0FBRzt3QkFDbEIsRUFBRSxDQUFDLFNBQVMsQ0FBQzs0QkFDVCxLQUFLLEVBQUUsTUFBTTt5QkFDaEIsQ0FBQyxDQUFBO29CQUNOLENBQUM7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R0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNwRCxPQUFPLEVBQUUsUUFBUTtnQkFDakIsS0FBSyxFQUFDLElBQUksQ0FBQyxTQUFTO2dCQUNwQixXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQzNCLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTthQUNwQyxDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLGFBQWEsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JELE9BQU8sRUFBRSxRQUFRO2dCQUNqQixLQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQ3BCLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDM0IsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFO2FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUMsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4JztcbmltcG9ydCB7IElBcHAgfSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCI7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleCc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPElBcHA+KCk7XG5cblBhZ2Uoe1xuICAgIGRhdGE6IHtcbiAgICAgICAgcGFnZV9zdGF0ZTogJ1dBSVRfUkVNSVQnLFxuICAgICAgICBiYW5rX2luZm86IHtcbiAgICAgICAgICAgIG5hbWU6ICfkuK3lm73lt6XllYbpk7booYzogqHku73mnInpmZDlhazlj7jlub/lt57np5Hlrabln47mlK/ooYwnLFxuICAgICAgICAgICAgbnVtYmVyOiAnMzYwMiAwOTA3IDA5MjAgMDEzMSA2MTknLFxuICAgICAgICAgICAgY29tcGFueTogJ+W5v+W3nuinhuiHu+S/oeaBr+enkeaKgOaciemZkOWFrOWPuCdcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6aG16Z2i54q25oCBICwg5b6F6L2s6LSmICwg5b6F5LiK5LygICwg5b6F5a6h5qC4XG4gICAgICAgIGRpYzoge1xuICAgICAgICAgICAgV0FJVF9SRU1JVDogJ1dBSVRfUkVNSVQnLFxuICAgICAgICAgICAgV0FJVF9VUExPQUQ6ICdXQUlUX1VQTE9BRCcsXG4gICAgICAgICAgICBXQUlUX0NIRUNLOiAnV0FJVF9DSEVDSycsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIG9tc+iuouWNleWPt1xuICAgICAgICBvbXNDb2RlOiAnJ1xuICAgIH0sXG5cbiAgICAvLyDorqLljZXlj7dcbiAgICBvcmRlck5vOiAnJyxcblxuICAgIC8vIOemu+W8gOmhtemdouaXtumXtFxuICAgIHBpcGVQaG90b3M6IFtdLCAgICBcbiAgICAvLyDnprvlvIDpobXpnaLml7bpl7RcbiAgICBlbnRlclRpbWU6IDAsXG5cbiAgICBydW5Db21wdXRlZCgpIHtcbiAgICAgICAgY29tcHV0ZWQodGhpcywge1xuXG5cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOWkjeWItumTtuihjOWNoeeJh+S/oeaBr1xuICAgIG9uQ29weUNhcmQoZSkge1xuICAgICAgICBjb25zdCB7IGJhbmtfaW5mbyB9ID0gdGhpcy5kYXRhO1xuICAgICAgICB3eC5zZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgICAgICAgIGRhdGE6IGDlvIDmiLfooYw6ICR7YmFua19pbmZvLm5hbWV9XFxu5YWs5Y+45ZCN56ewOiAke2JhbmtfaW5mby5jb21wYW55fVxcbui0puaItzogJHtiYW5rX2luZm8ubnVtYmVyLnJlcGxhY2UoL1xccy9nLCAnJyl9YCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICB3eC5nZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+WkjeWItuaIkOWKnydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDot7PovazliLDmsYfmrL7ljZXloavlhplcbiAgICBvbkdvSG9tZShlKSB7XG4gICAgICAgIC8vIG5hdlRvKCcvcGFnZXMvbWFpbi1wYWdlL2luZGV4Jyk7XG4gICAgICAgIHd4LnJlZGlyZWN0VG8oe1xuICAgICAgICAgICAgdXJsOiBgL3BhZ2VzL21haW4tcGFnZS9pbmRleGAsXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyDot7PovazliLDmsYfmrL7ljZXloavlhplcbiAgICBvblJlbWl0KGUpIHtcbiAgICAgICAgLy8gbmF2VG8oYC9wYWdlcy9wYXktcmVzL2luZGV4P3N0YXRlPVdBSVRfVVBMT0FEJm5vPSR7dGhpcy5vcmRlck5vfWApO1xuICAgICAgICB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgIHVybDogYC9wYWdlcy9wYXktcmVzL2luZGV4P3N0YXRlPVdBSVRfVVBMT0FEJm5vPSR7dGhpcy5vcmRlck5vfWAsXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyDot7PovazliLDorqLljZXliJfooajpobXpnaJcbiAgICBvbk5hdlRvT3JkZXJMaXN0KGUpIHtcbiAgICAgICAgLy8gbmF2VG8oYC9wYWdlcy9vcmRlci1kZXRhaWwvaW5kZXg/bm89JHt0aGlzLm9yZGVyTm99YClcbiAgICAgICAgd3gucmVkaXJlY3RUbyh7XG4gICAgICAgICAgICB1cmw6IGAvcGFnZXMvb3JkZXItZGV0YWlsL2luZGV4P25vPSR7dGhpcy5vcmRlck5vfWAsXG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyDmj5DkuqTmlK/ku5jmsLTlj7fot7PovazliLDmoLjmn6VcbiAgICBhc3luYyBvblN1Ym1pdChlKSB7XG4gICAgICAgIGlmKCEhdGhpcy5waXBlUGhvdG9zLmxlbmd0aCkge1xuICAgICAgICAgICAgYXBwLmRhdGFCdXJ5JChbe1xuICAgICAgICAgICAgICAgIFwiJGNvZGVcIjpcInN1Ym1pdE9yZGVyXCIsXG4gICAgICAgICAgICAgICAgXCIkdHNcIjpuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICBcIm9yZGVyTm9cIjogdGhpcy5vcmRlck5vXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICBhd2FpdCBodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9vcmRlci91cGxvYWRfd2F0ZXJfbGlzdC8ke3RoaXMub3JkZXJOb31gXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgd3gucmVkaXJlY3RUbyh7XG4gICAgICAgICAgICAgICAgdXJsOiBgL3BhZ2VzL3BheS1yZXMvaW5kZXg/c3RhdGU9V0FJVF9DSEVDSyZubz0ke3RoaXMub3JkZXJOb31gLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICBtYXNrOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+35LiK5Lyg5Zu+54mHJyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIOS4iuS8oOWbvueJh+WQjueahOWbnuiwg1xuICAgIG9uSW1nQ2hhbmdlKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwpO1xuICAgICAgICB0aGlzLnBpcGVQaG90b3MgPSBlLmRldGFpbDtcbiAgICB9LFxuXG4gICAgb25UYWJDaGFuZ2UoeyBkZXRhaWwgfSkge1xuICAgIH0sXG5cbiAgICBvbkxvYWQocTogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfmiJHnmoRxdWVyeScsIHEubm8pO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHBhZ2Vfc3RhdGU6IHEuc3RhdGVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub3JkZXJObyA9IHEubm87XG5cbiAgICAgICAgcS5zdGF0ZSA9PT0gJ1dBSVRfVVBMT0FEJyAmJiB0aGlzLmdldE9tc05vKCk7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPlm9tc+iuouWNleWPt1xuICAgIGdldE9tc05vKCkge1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL29yZGVyL2dldE9tc05vYCxcbiAgICAgICAgICAgIGRhdGE6IFt0aGlzLm9yZGVyTm9dXG4gICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgIGlmKHZhbC5zdGF0dXMgIT09IDIwMCkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcign6I635Y+W5Y2V5Y+35Ye66ZSZLOaVsOaNruS4uicsIHZhbC5kYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgb21zQ29kZTogdmFsLmRhdGFbMF0uc29Db2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uSGlkZSgpe1xuICAgICAgICAvLyBQVuWfi+eCuVxuICAgICAgICB0aGlzLmRhdGEucGFnZV9zdGF0ZSA9PT0gJ1dBSVRfUkVNSVQnICYmIGFwcC5kYXRhQnVyeSQoW3tcbiAgICAgICAgICAgIFwiJGNvZGVcIjogXCJiYW5rTm9cIiAsXG4gICAgICAgICAgICBcIiR0c1wiOnRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJlbnRlclRpbWVcIjogdGhpcy5lbnRlclRpbWUsXG4gICAgICAgICAgICBcImxlYXZlVGltZVwiOiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9XSk7XG4gICAgICAgIHRoaXMuZGF0YS5wYWdlX3N0YXRlID09PSAnV0FJVF9VUExPQUQnICYmIGFwcC5kYXRhQnVyeSQoW3tcbiAgICAgICAgICAgIFwiJGNvZGVcIjogXCJwaXBlTm9cIiAsXG4gICAgICAgICAgICBcIiR0c1wiOnRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJlbnRlclRpbWVcIjogdGhpcy5lbnRlclRpbWUsXG4gICAgICAgICAgICBcImxlYXZlVGltZVwiOiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9XSk7XG4gICAgICAgIHRoaXMuZW50ZXJUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgb25TaG93KCkge1xuICAgICAgICB0aGlzLmVudGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH1cbn0pIl19