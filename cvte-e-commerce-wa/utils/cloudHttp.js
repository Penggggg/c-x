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
var httpParam = {
    url: '',
    data: {},
    success: function (res) { },
    loadingMsg: '加载中....',
    errMsg: '加载错误，请重试',
    complete: function () { },
    error: function () { }
};
var cloudHttp = function (params$) {
    return new Promise(function (r, j) {
        var params = Object.assign({}, httpParam, __assign({}, params$));
        params.loadingMsg !== 'none' && wx.showLoading({
            title: params.loadingMsg
        });
        var getError = function (msg, err) {
            if (msg === void 0) { msg = params.errMsg; }
            err && console.log("Error: ", err || msg);
            wx.showToast({
                icon: 'none',
                title: msg,
                duration: 2000
            });
        };
        var name = params.url.split('_')[0];
        var $url = params.url.split('_')[1];
        wx.cloud.callFunction({
            data: {
                $url: $url,
                data: params.data
            },
            name: name,
            success: function (res) {
                var result = res.result;
                if (!result) {
                    return getError();
                }
                console.log("\u3010---- Cloud Request Success : " + params$.url + "\u3011", params$.data, res.result);
                var status = result.status, data = result.data, message = result.message;
                if (status !== 200) {
                    getError(message && message !== {} ? message : params.errMsg);
                }
                else {
                    wx.hideLoading({});
                }
                !!params.success && params.success(res.result);
                r(res.result);
            },
            fail: function (err) {
                getError('网络错误', err);
                params.error && params.error();
                console.log("\u3010---- Cloud Request ERROR : " + params$.url + "\u3011", params$.data);
                j(err);
            },
            complete: function () {
                params.complete && params.complete();
            }
        });
    });
};
exports.cloudHttp = cloudHttp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRIdHRwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvdWRIdHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFNBQVMsR0FBRztJQUNkLEdBQUcsRUFBRSxFQUFFO0lBQ1AsSUFBSSxFQUFFLEVBQUc7SUFDVCxPQUFPLEVBQUUsVUFBRSxHQUFRLElBQVEsQ0FBQztJQUM1QixVQUFVLEVBQUUsU0FBUztJQUNyQixNQUFNLEVBQUUsVUFBVTtJQUNsQixRQUFRLEVBQUUsY0FBUyxDQUFDO0lBQ3BCLEtBQUssRUFBRSxjQUFTLENBQUM7Q0FDcEIsQ0FBQztBQUlGLElBQU0sU0FBUyxHQUFHLFVBQUUsT0FBa0I7SUFDbEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3JCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRyxFQUFFLFNBQVMsZUFBTyxPQUFPLEVBQUcsQ0FBQztRQUU3RCxNQUFNLENBQUMsVUFBVSxLQUFLLE1BQU0sSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQzNDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVTtTQUMzQixDQUFDLENBQUM7UUFFSCxJQUFNLFFBQVEsR0FBRyxVQUFFLEdBQW1CLEVBQUUsR0FBUztZQUE5QixvQkFBQSxFQUFBLE1BQU0sTUFBTSxDQUFDLE1BQU07WUFDbEMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUUsQ0FBQztZQUMzQyxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNULElBQUksRUFBRSxNQUFNO2dCQUNaLEtBQUssRUFBRSxHQUFHO2dCQUNWLFFBQVEsRUFBRSxJQUFJO2FBQ2pCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO1FBQ3hDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDO1FBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQ2xCLElBQUksRUFBRTtnQkFDRixJQUFJLE1BQUE7Z0JBQ0osSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2FBQ3BCO1lBQ0QsSUFBSSxNQUFBO1lBQ0osT0FBTyxFQUFFLFVBQUUsR0FBUTtnQkFDUCxJQUFBLG1CQUFNLENBQVM7Z0JBQ3ZCLElBQUssQ0FBQyxNQUFNLEVBQUc7b0JBQUUsT0FBTyxRQUFRLEVBQUcsQ0FBQztpQkFBQztnQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBaUMsT0FBTyxDQUFDLEdBQUcsV0FBRyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO2dCQUNoRixJQUFBLHNCQUFNLEVBQUUsa0JBQUksRUFBRSx3QkFBTyxDQUFZO2dCQUN6QyxJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQ2xCLFFBQVEsQ0FBRSxPQUFPLElBQUksT0FBTyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7aUJBRXBFO3FCQUFNO29CQUNILEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO2dCQUNqRCxDQUFDLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1lBQ3BCLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHO2dCQUNMLFFBQVEsQ0FBRSxNQUFNLEVBQUUsR0FBRyxDQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRyxDQUFDO2dCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUErQixPQUFPLENBQUMsR0FBRyxXQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFDO2dCQUMxRSxDQUFDLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDYixDQUFDO1lBQ0QsUUFBUSxFQUFFO2dCQUVOLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRyxDQUFBO1lBQ3pDLENBQUM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQTtBQUdHLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaHR0cFBhcmFtID0ge1xuICAgIHVybDogJycsXG4gICAgZGF0YTogeyB9LFxuICAgIHN1Y2Nlc3M6ICggcmVzOiBhbnkgKSA9PiB7IH0sXG4gICAgbG9hZGluZ01zZzogJ+WKoOi9veS4rS4uLi4nLFxuICAgIGVyck1zZzogJ+WKoOi9vemUmeivr++8jOivt+mHjeivlScsXG4gICAgY29tcGxldGU6ICggKSA9PiB7IH0sXG4gICAgZXJyb3I6ICggKSA9PiB7IH1cbn07XG5cbnR5cGUgaHR0cFBhcmFtID0gYW55O1xuXG5jb25zdCBjbG91ZEh0dHAgPSAoIHBhcmFtcyQ6IGh0dHBQYXJhbSApID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKCByLCBqICkgPT4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHsgfSwgaHR0cFBhcmFtLCB7IC4uLnBhcmFtcyQgfSk7XG5cbiAgICAgICAgcGFyYW1zLmxvYWRpbmdNc2cgIT09ICdub25lJyAmJiB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgICB0aXRsZTogcGFyYW1zLmxvYWRpbmdNc2dcbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIGNvbnN0IGdldEVycm9yID0gKCBtc2cgPSBwYXJhbXMuZXJyTXNnLCBlcnI/OiBhbnkgKSA9PiB7XG4gICAgICAgICAgICBlcnIgJiYgY29uc29sZS5sb2coYEVycm9yOiBgLCBlcnIgfHwgbXNnICk7XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogbXNnLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCBuYW1lID0gcGFyYW1zLnVybC5zcGxpdCgnXycpWyAwIF07XG4gICAgICAgIGNvbnN0ICR1cmwgPSBwYXJhbXMudXJsLnNwbGl0KCdfJylbIDEgXTtcbiAgICBcbiAgICAgICAgd3guY2xvdWQuY2FsbEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAkdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IHBhcmFtcy5kYXRhXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6ICggcmVzOiBhbnkgKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoICFyZXN1bHQgKSB7IHJldHVybiBnZXRFcnJvciggKTt9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOOAkC0tLS0gQ2xvdWQgUmVxdWVzdCBTdWNjZXNzIDogJHtwYXJhbXMkLnVybH3jgJFgLCBwYXJhbXMkLmRhdGEsIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSwgbWVzc2FnZSB9ID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldEVycm9yKCBtZXNzYWdlICYmIG1lc3NhZ2UgIT09IHsgfSA/IG1lc3NhZ2UgOiBwYXJhbXMuZXJyTXNnICk7XG4gICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoeyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgISFwYXJhbXMuc3VjY2VzcyAmJiBwYXJhbXMuc3VjY2VzcyggcmVzLnJlc3VsdCApO1xuICAgICAgICAgICAgICAgIHIoIHJlcy5yZXN1bHQgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGdldEVycm9yKCAn572R57uc6ZSZ6K+vJywgZXJyICk7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmVycm9yICYmIHBhcmFtcy5lcnJvciggKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg44CQLS0tLSBDbG91ZCBSZXF1ZXN0IEVSUk9SIDogJHtwYXJhbXMkLnVybH3jgJFgLCBwYXJhbXMkLmRhdGEgKTtcbiAgICAgICAgICAgICAgICBqKCBlcnIgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wbGV0ZTogKCApID0+IHtcbiAgICAgICAgICAgICAgICAvLyB3eC5oaWRlTG9hZGluZyh7IH0pO1xuICAgICAgICAgICAgICAgIHBhcmFtcy5jb21wbGV0ZSAmJiBwYXJhbXMuY29tcGxldGUoIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7XG4gICAgY2xvdWRIdHRwXG59OyJdfQ==