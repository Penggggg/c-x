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
var index_1 = require("../config/index");
var all_1 = require("../config/all");
var constant_1 = require("../utils/constant");
var httpParam = {
    env: '',
    method: 'GET',
    header: {},
    path: '',
    url: index_1.default.host.default,
    data: {},
    loadingMsg: '加载中....',
    errMsg: '加载错误，请重试',
    allUrl: ''
};
exports.http = function (params$) {
    return new Promise(function (resolve) {
        var params = __assign({}, httpParam, params$);
        var loadingMsg = params.loadingMsg, errMsg = params.errMsg, path = params.path, env = params.env;
        var url = env && all_1.default[env] ?
            all_1.default[env].host.default :
            params.url;
        var data = params.data;
        loadingMsg !== 'none' && wx.showLoading({
            title: loadingMsg,
            mask: true
        });
        var getError = function (msg) {
            wx.showToast({
                icon: 'none',
                title: msg,
                duration: 2000
            });
        };
        var meta = wx.getStorageSync(constant_1.StorageKey.SYSTEM_USER_INFO);
        var sysUser = meta ? JSON.parse(meta) : null;
        var header = Object.assign({}, params$.header);
        if (!!sysUser && sysUser.templateId) {
            header = {
                'wa-jwt': sysUser.jwt || '',
            };
        }
        console.log('-------- 发送请求 --------');
        console.log("" + (params$.allUrl ? params$.allUrl : url + path));
        wx.request({
            data: data,
            header: header,
            method: params$.method ? params$.method.toUpperCase() : 'GET',
            url: params$.allUrl || "" + url + path,
            success: function (res) {
                var _a = res.data, status = _a.status, msg = _a.msg, message = _a.message;
                var hasError = Number(status) !== 200 && Number(status) !== 0;
                if (hasError) {
                    errMsg !== 'none' && getError(message || msg || errMsg);
                    console.error("Http Error\uFF1A" + url + path + " " + JSON.stringify(res.data));
                }
                else {
                    loadingMsg !== 'none' && wx.hideLoading({});
                }
                console.log('-------- 返回结果 --------');
                console.log("" + JSON.stringify(res.data));
                resolve({
                    msg: msg,
                    status: hasError ? 500 : 200,
                    data: res.data.data
                });
            },
            fail: function (e) {
                getError('网络错误');
                console.log('出错了', e);
                resolve({
                    status: 500
                });
            }
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFxQztBQUNyQyxxQ0FBeUM7QUFDekMsOENBQStDO0FBRy9DLElBQU0sU0FBUyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEVBQUU7SUFDUCxNQUFNLEVBQUUsS0FBSztJQUNiLE1BQU0sRUFBRSxFQUFHO0lBQ1gsSUFBSSxFQUFFLEVBQUU7SUFDUixHQUFHLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPO0lBQ3hCLElBQUksRUFBRSxFQUFHO0lBQ1QsVUFBVSxFQUFFLFNBQVM7SUFDckIsTUFBTSxFQUFFLFVBQVU7SUFDbEIsTUFBTSxFQUFFLEVBQUU7Q0FDYixDQUFDO0FBRVcsUUFBQSxJQUFJLEdBQTRGLFVBQUEsT0FBTztJQUVoSCxPQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTztRQUV2QixJQUFNLE1BQU0sZ0JBQ0wsU0FBUyxFQUNULE9BQU8sQ0FDYixDQUFBO1FBQ08sSUFBQSw4QkFBVSxFQUFFLHNCQUFNLEVBQUUsa0JBQUksRUFBRSxnQkFBRyxDQUFZO1FBQ2pELElBQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxhQUFZLENBQUUsR0FBRyxDQUFFLENBQUMsQ0FBQztZQUNwQyxhQUFZLENBQUUsR0FBRyxDQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFBO1FBRXRCLFVBQVUsS0FBSyxNQUFNLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNwQyxLQUFLLEVBQUUsVUFBVTtZQUNqQixJQUFJLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQztRQUVILElBQU0sUUFBUSxHQUFHLFVBQUUsR0FBVztZQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNULElBQUksRUFB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cnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy9pbmRleCc7XG5pbXBvcnQgYWxsRW52Q29uZmlnIGZyb20gJy4uL2NvbmZpZy9hbGwnO1xuaW1wb3J0IHsgU3RvcmFnZUtleSB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50JztcblxuLyoqIOivt+axguWPguaVsCAqL1xuY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIGVudjogJycsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBoZWFkZXI6IHsgfSxcbiAgICBwYXRoOiAnJyxcbiAgICB1cmw6IGNvbmZpZy5ob3N0LmRlZmF1bHQsXG4gICAgZGF0YTogeyB9LFxuICAgIGxvYWRpbmdNc2c6ICfliqDovb3kuK0uLi4uJyxcbiAgICBlcnJNc2c6ICfliqDovb3plJnor6/vvIzor7fph43or5UnLFxuICAgIGFsbFVybDogJydcbn07XG5cbmV4cG9ydCBjb25zdCBodHRwOiAoIHA6IFBhcnRpYWw8IHR5cGVvZiBodHRwUGFyYW0gPikgPT4gUHJvbWlzZTx7IHN0YXR1czogbnVtYmVyLCBkYXRhPzogYW55LCBtc2c/OiBhbnkgfT4gPSBwYXJhbXMkID0+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICAuLi5odHRwUGFyYW0sXG4gICAgICAgICAgICAuLi5wYXJhbXMkXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBsb2FkaW5nTXNnLCBlcnJNc2csIHBhdGgsIGVudiB9ID0gcGFyYW1zO1xuICAgICAgICBjb25zdCB1cmwgPSBlbnYgJiYgYWxsRW52Q29uZmlnWyBlbnYgXSA/IFxuICAgICAgICAgICAgYWxsRW52Q29uZmlnWyBlbnYgXS5ob3N0LmRlZmF1bHQgOlxuICAgICAgICAgICAgcGFyYW1zLnVybDtcbiAgICAgICAgbGV0IGRhdGEgPSBwYXJhbXMuZGF0YVxuICAgIFxuICAgICAgICBsb2FkaW5nTXNnICE9PSAnbm9uZScgJiYgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgdGl0bGU6IGxvYWRpbmdNc2csXG4gICAgICAgICAgICBtYXNrOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIFxuICAgICAgICBjb25zdCBnZXRFcnJvciA9ICggbXNnOiBzdHJpbmcgKSA9PiB7XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogbXNnLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1ldGEgPSAgd3guZ2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuU1lTVEVNX1VTRVJfSU5GTyApO1xuICAgICAgICBjb25zdCBzeXNVc2VyID0gbWV0YSA/IEpTT04ucGFyc2UoIG1ldGEgKSA6IG51bGxcblxuICAgICAgICBsZXQgaGVhZGVyID0gT2JqZWN0LmFzc2lnbih7IH0sIHBhcmFtcyQuaGVhZGVyICk7XG4gICAgICAgIGlmICggISFzeXNVc2VyICYmIHN5c1VzZXIudGVtcGxhdGVJZCApIHtcbiAgICAgICAgICAgIGhlYWRlciA9IHtcbiAgICAgICAgICAgICAgICAnd2Etand0Jzogc3lzVXNlci5qd3QgfHwgJycsXG4gICAgICAgICAgICAgICAgLy8gJ3dhLXVpZCc6IHN5c1VzZXIuaWQsXG4gICAgICAgICAgICAgICAgLy8gJ3dhLXRlbXBpZCc6IHN5c1VzZXIudGVtcGxhdGVJZCxcbiAgICAgICAgICAgICAgICAvLyAnd2EtbmFtZSc6IHN5c1VzZXIubmFtZSA/IFxuICAgICAgICAgICAgICAgIC8vICAgICBlbmNvZGVVUklDb21wb25lbnQoIHN5c1VzZXIubmFtZSApIDogXG4gICAgICAgICAgICAgICAgLy8gICAgIHN5c1VzZXIuaWQgPyBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudCgn5Lya5ZGYJykgOiBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudCgn6K6/5a6iJyksXG4gICAgICAgICAgICAgICAgLy8gVE9ETzog6L+Z6YeM5piv5rWL6K+V5LyY5oOg5Yi455qE77yM6KaB5Yig6ZmkXG4gICAgICAgICAgICAgICAgLy8gJ3dhLWp3dCc6ICdleUpoYkdjaU9pSlNVekkxTmlKOS5leUp6ZFdJaU9pSm1NbU13WWpRMU5DMWhNakJrTFRSaFlXRXRPVFJtWmkwek0yUmtOVFZrWW1WaU9XRWlMQ0poZFdRaU9pSTRNMkkxTVRoalppMDNOelEyTFRRNE9EZ3RZbU5oTlMweVpUSXhaR1l5WkdWbVptVWlMQ0pwYzNNaU9pSTVZekJpTm1NNE15MHpZMlppTFRReFl6RXRZV1k0TXkxbVlXWTFPV0ZoWkdKbE1HVWlMQ0psZUhBaU9qRTFOamszTXpNek1UZ3NJbWxoZENJNk1UVTJPVFkwTmpreE9EazJOeXdpYldGd0lqcDdJbWxrSWpvaVpqSmpNR0kwTlRRdFlUSXdaQzAwWVdGaExUazBabVl0TXpOa1pEVTFaR0psWWpsaElpd2lkR1Z0Y0d4aGRHVkpaQ0k2SW1KbFl6WTFabVkxWkdVNVpqUXlNalk1Tnprd01qa3hOVGN4T0RrNU9XSmtJaXdpYm1GdFpTSTZJa05XT1RVM01pSjlMQ0pxZEdraU9pSTFNalE0WmpBMVpHWTROR1UwWVRZeVlUWTJNbVJrTTJNeU5HTXlOR1E0WkNKOS5aU1g1OG05LXAzdWJpMEZGeFdhbWxyQ0hiWU1SczEwcUYxM1ZhVWtDdUNLZzYzMF9PSHI5S2pWU1RZUTEwaFQ2MDZ3NWd1SnQ5dzVwNGtVMm1ISnlQY3BKN0luUkxrQ29GcV9pNmx2QUU5aFBlbVR3bU5lUG1kTE16RDJmV2lfLUlUMVlONmNWcGptSGpTOEhDN3dJZzdTdjFTQXZfcTlRa1pnUHFBdWo2QkUnLFxuICAgICAgICAgICAgICAgIC8vICd3YS1qd3QnOiAnZXlKaGJHY2lPaUpTVXpJMU5pSjkuZXlKemRXSWlPaUl5TWpJeUlpd2lZWFZrSWpvaVptWmlOekpoWmpZdFpqUTNNQzAwTW1FMkxXRXlZek10T0RWak9ERXpOakl6WmpobElpd2lhWE56SWpvaU9XTXdZalpqT0RNdE0yTm1ZaTAwTVdNeExXRm1PRE10Wm1GbU5UbGhZV1JpWlRCbElpd2laWGh3SWpveE9USTROVE01T0RrM0xDSnBZWFFpT2pFMU5qZzFNems0T1Rjek5URXNJbTFoY0NJNmV5SnBaQ0k2SWpJeU1qSWlMQ0p1WVcxbElqb2lNakl5TWlKOUxDSnFkR2tpT2lJd05UazNaV1l3WlRjNU1XRTBPV0ZtWVdFd1lXTmtORGxqTldSaVlUUmhNaUo5Lk5oYUlnNVY4U0lCcUdNZ29zQ214MGl1S3lKU1dJNkFfZm9hNnc4djloZXFHWWlHTnZsSDJzdmtOUkxvaDcxbTRTdkRfa1lOemc5VGt2UC1EYmxKMWNkTmFqUlRDUW1wYkowNkgxMzFBbHRQcDlGX2pTODlEdlNVUXh4bVZjSFYtQkphaXlMbXN4Y1hwSXh1c01PbUs1RHFRbnVHa01yTG1KVGdJRTRHeVJ2OCcsXG4gICAgICAgICAgICAgICAgLy8gJ3dhLWp3dCc6ICdleUpoYkdjaU9pSlNVekkxTmlKOS5leUp6ZFdJaU9pSm9jRzl5ZEdGc1gyaDFZVzFsYm1kNGFXNW5JaXdpWVhWa0lqb2labVppTnpKaFpqWXRaalEzTUMwME1tRTJMV0V5WXpNdE9EVmpPREV6TmpJelpqaGxJaXdpYVhOeklqb2lPV013WWpaak9ETXRNMk5tWWkwME1XTXhMV0ZtT0RNdFptRm1OVGxoWVdSaVpUQmxJaXdpWlhod0lqb3hPREk1T0RreE9ERXlMQ0pwWVhRaU9qRTFOamd4T0RJMU1Ea3dOREFzSW0xaGNDSTZleUpwWkNJNklqQXhNMk0yTWpOaU16VmlNalJqWm1OaFpXRmxaVEEyTWpJNFlXVmxOREU0SWl3aWJtRnRaU0k2SXVpdXVPV3VxdWFJa0NJc0ltVnRZV2xzSWpvaWVIVmhhWGhoYm1Ob1pXNW5RR04yZEdVdVkyOXRJaXdpYUc5emRDSTZJakV5Tnk0d0xqQXVNU0o5TENKcWRHa2lPaUl4WmpJek1XSXdZMk5pTldZME5HSm1ZbUl5WkdNMU1Ea3hOREF4TjJVNE5DSjkudTQ1QVBId2JseFRYRFhHOVJ4MlRSYWZSX2J0WHBfRkNCbzJaakcwbXJhWUdFZUZCWHIyMzljRlZfaF9TbnVUZXVFc25zSTRFM2VIdUtOczVZa2Z4R3FfMG9SN2FLT2h1ZnNnQXlaOHAtWnJ4U1hRYUthV3oxU1pKTEJ2UUNCRUI0M1RPV3ZGWGZ1UjdhcE1IejRkalJNSTFkbU91ZzRsY0JrNDN2Z1lOQzBnJ1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0g5Y+R6YCB6K+35rGCIC0tLS0tLS0tJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCBgJHtwYXJhbXMkLmFsbFVybCA/IHBhcmFtcyQuYWxsVXJsIDogdXJsICsgcGF0aCB9YCApO1xuXG4gICAgICAgICh3eCBhcyBhbnkpLnJlcXVlc3Qoe1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGhlYWRlcixcbiAgICAgICAgICAgIG1ldGhvZDogcGFyYW1zJC5tZXRob2QgPyBwYXJhbXMkLm1ldGhvZC50b1VwcGVyQ2FzZSggKSA6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiBwYXJhbXMkLmFsbFVybCB8fCBgJHt1cmx9JHtwYXRofWAsXG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgbXNnLCBtZXNzYWdlIH0gPSByZXMuZGF0YTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGhhc0Vycm9yID0gIE51bWJlciggc3RhdHVzICkgIT09IDIwMCAmJiBOdW1iZXIoIHN0YXR1cyApICE9PSAwO1xuICAgICAgICAgICAgICAgIGlmICggaGFzRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuaW5mbyhg44CQLS0tLSBFcnJvciA6ICR7cGF0aH3jgJFgLCByZXMuZGF0YSApXG4gICAgICAgICAgICAgICAgICAgIGVyck1zZyAhPT0gJ25vbmUnICYmIGdldEVycm9yKCBtZXNzYWdlIHx8IG1zZyB8fCBlcnJNc2cgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgSHR0cCBFcnJvcu+8miR7dXJsfSR7cGF0aH0gJHtKU09OLnN0cmluZ2lmeSggcmVzLmRhdGEgKX1gKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdNc2cgIT09ICdub25lJyAmJiB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhg44CQLS0tLSBSZXF1ZXN0IFN1Y2Nlc3MgOiR7cGF0aH3jgJFgLCBkYXRhLCByZXMuZGF0YS5kYXRhICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tIOi/lOWbnue7k+aenCAtLS0tLS0tLScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke0pTT04uc3RyaW5naWZ5KCByZXMuZGF0YSApfWAgKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgbXNnLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IGhhc0Vycm9yID8gNTAwIDogMjAwLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXMuZGF0YS5kYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiAoIGUgKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2V0RXJyb3IoICfnvZHnu5zplJnor68nICk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+WHuumUmeS6hicsIGUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0iXX0=