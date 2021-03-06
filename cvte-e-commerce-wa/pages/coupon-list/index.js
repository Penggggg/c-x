"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var index_1 = require("../../lib/vuefy/index");
var util_1 = require("../../utils/util");
var app = getApp();
Page({
    data: {
        current: '1',
        coupons: [],
        tabs: [
            {
                key: '1',
                label: '未使用',
            }, {
                key: '2',
                label: '已使用',
            }, {
                key: '4',
                label: '已过期',
            }
        ],
        queryCode: {
            '0': {
                code: '0',
                mean: '已发放'
            },
            '1': {
                code: '1',
                mean: '已领用'
            },
            '2': {
                code: '2',
                mean: '已使用'
            },
            '3': {
                code: '3',
                mean: '已退还'
            },
            '4': {
                code: '4',
                mean: '已过期'
            }
        }
    },
    runComputed: function () {
        index_1.computed(this, {});
    },
    fetchCoupons: function () {
        var _this = this;
        var _a = this.data, current = _a.current, queryCode = _a.queryCode;
        var code = queryCode[current].code;
        return http_1.http({
            path: "/apis/coupons/my-list?status=" + code
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            _this.setData({
                coupons: data ? data.map(util_1.couponToFront) : []
            });
        });
    },
    onTabChange: function (_a) {
        var detail = _a.detail;
        this.setData({
            current: detail
        });
        this.fetchCoupons();
    },
    onLoad: function () {
        this.fetchCoupons();
    },
    onShow: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlDQUF3QztBQUN4QywrQ0FBaUQ7QUFFakQseUNBQWlEO0FBRWpELElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVyxDQUFDO0FBRTlCLElBQUksQ0FBQztJQUVELElBQUksRUFBRTtRQUdGLE9BQU8sRUFBRSxHQUFHO1FBR1osT0FBTyxFQUFFLEVBY1I7UUFHRCxJQUFJLEVBQUU7WUFDRjtnQkFDSSxHQUFHLEVBQUUsR0FBRztnQkFDUixLQUFLLEVBQUUsS0FBSzthQUNmLEVBQUU7Z0JBQ0MsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsS0FBSyxFQUFFLEtBQUs7YUFDZixFQUFFO2dCQUNDLEdBQUcsRUFBRSxHQUFHO2dCQUNSLEtBQUssRUFBRSxLQUFLO2FBQ2Y7U0FDSjtRQUVELFNBQVMsRUFBRTtZQUNQLEdBQUcsRUFBRTtnQkFDRCxJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsS0FBSzthQUNkO1lBQ0QsR0FBRyxFQUFFO2dCQUNELElBQUksRUFBRSxHQUFHO2dCQUNULElBQUksRUFBRSxLQUFLO2FBQ2Q7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsSUFBSSxFQUFFLEtBQUs7YUFDZDtZQUNELEdBQUcsRUFBRTtnQkFDRCxJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsS0FBSzthQUNkO1lBQ0QsR0FBRyxFQUFFO2dCQUNELElBQUksRUFBRSxHQUFHO2dCQUNULElBQUksRUFBRSxLQUFLO2FBQ2Q7U0FDSjtLQUVKO0lBRUQsV0FBVztRQUNQLGdCQUFRLENBQUUsSUFBSSxFQUFFLEVBRWYsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFlBQVk7UUFBWixpQkFjQztRQWJTLElBQUEsY0FBa0MsRUFBaEMsb0JBQU8sRUFBRSx3QkFBdUIsQ0FBQztRQUNqQyxJQUFBLDhCQUFJLENBQTBCO1FBRXRDLE9BQU8sV0FBSSxDQUFDO1lBQ1IsSUFBSSxFQUFFLGtDQUFnQyxJQUFNO1NBQy9DLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQSxHQUFHO1lBQ0EsSUFBQSxtQkFBTSxFQUFFLGVBQUksQ0FBUztZQUM3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7Z0JBQUUsT0FBTzthQUFFO1lBRWpDLEtBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxvQkFBYSxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUc7YUFDbEQsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBR0QsV0FBVyxZQUFDLEVBQVU7WUFBUixrQkFBTTtRQUNoQixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsT0FBTyxFQUFFLE1BQU07U0FDbEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksRUFBRyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFlBQVksRUFBRyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNO0lBRU4sQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4JztcbmltcG9ydCB7IElBcHAgfSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCI7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleCc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlJztcbmltcG9ydCB7IGNvdXBvblRvRnJvbnQgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPCBJQXBwID4oICk7XG5cblBhZ2Uoe1xuXG4gICAgZGF0YToge1xuXG4gICAgICAgIC8vIOaMh+WumuS4gOS4qnRhYnPnmoRrZXlcbiAgICAgICAgY3VycmVudDogJzEnLFxuXG4gICAgICAgIC8vIOS8mOaDoOWIuFxuICAgICAgICBjb3Vwb25zOiBbXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgaWQ6ICcxMjMnLFxuICAgICAgICAgICAgLy8gICAgIHR5cGU6ICcnLFxuICAgICAgICAgICAgLy8gICAgIHR5cGVMYWJlbDogJ+S8muWRmOWIuCcsXG4gICAgICAgICAgICAvLyAgICAgZGlzY291bnRUeXBlOiAnJyxcbiAgICAgICAgICAgIC8vICAgICB2YWx1ZTogNTEyMyxcbiAgICAgICAgICAgIC8vICAgICB1c2VkOiBmYWxzZSxcbiAgICAgICAgICAgIC8vICAgICB0aXBzOiAn5ruhMzk55YWDLOWHjzUwMOWFgycsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6ICdDVlRPVUNIIOS8muiuruW5s+adv+aMh+WumuS8mOaDoOWIuCcsXG4gICAgICAgICAgICAvLyAgICAgc3RhcnQ6IDE1NjY5OTYxNDE4MTEsXG4gICAgICAgICAgICAvLyAgICAgZW5kOiAxNTY2OTk2MTQxODExLFxuICAgICAgICAgICAgLy8gICAgIHVzZVRpcHM6ICfkvb/nlKjor7TmmI7vvJrlsI/nqIvluo/kuJPkuqvvvIzkuIvljZXljbPlj6/kvb/nlKjjgIInXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gdGFiXG4gICAgICAgIHRhYnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6ICcxJyxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+acquS9v+eUqCcsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAga2V5OiAnMicsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICflt7Lkvb/nlKgnLFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGtleTogJzQnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAn5bey6L+H5pyfJyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcblxuICAgICAgICBxdWVyeUNvZGU6IHtcbiAgICAgICAgICAgICcwJzoge1xuICAgICAgICAgICAgICAgIGNvZGU6ICcwJyxcbiAgICAgICAgICAgICAgICBtZWFuOiAn5bey5Y+R5pS+J1xuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAnMSc6IHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnMScsXG4gICAgICAgICAgICAgICAgbWVhbjogJ+W3sumihueUqCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnMic6IHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnMicsXG4gICAgICAgICAgICAgICAgbWVhbjogJ+W3suS9v+eUqCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnMyc6IHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnMycsXG4gICAgICAgICAgICAgICAgbWVhbjogJ+W3sumAgOi/mCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnNCc6IHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnNCcsXG4gICAgICAgICAgICAgICAgbWVhbjogJ+W3sui/h+acnydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICB9KTsgXG4gICAgfSxcblxuICAgIC8qKiDojrflj5bkvJjmg6DliLjliJfooaggKi9cbiAgICBmZXRjaENvdXBvbnMoICkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnQsIHF1ZXJ5Q29kZSB9ID0gdGhpcy5kYXRhO1xuICAgICAgICBjb25zdCB7IGNvZGUgfSA9IHF1ZXJ5Q29kZVsgY3VycmVudCBdO1xuXG4gICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9jb3Vwb25zL215LWxpc3Q/c3RhdHVzPSR7Y29kZX1gXG4gICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGNvdXBvbnM6IGRhdGEgPyBkYXRhLm1hcCggY291cG9uVG9Gcm9udCApIDogWyBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDngrnlh7vliIfmjaIgKi9cbiAgICBvblRhYkNoYW5nZSh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgY3VycmVudDogZGV0YWlsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZldGNoQ291cG9ucyggKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkKCApIHtcbiAgICAgICAgdGhpcy5mZXRjaENvdXBvbnMoICk7XG4gICAgfSxcblxuICAgIG9uU2hvdyggKSB7XG5cbiAgICB9XG59KVxuIl19