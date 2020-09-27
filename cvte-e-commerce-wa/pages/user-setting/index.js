"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../lib/vuefy/index");
var route_1 = require("../../utils/route");
var app = getApp();
Page({
    data: {
        settingList: [
            {
                label: '用户协议',
                path: '/pages/agreement/index?p=userReg'
            },
            {
                label: '会员&积分',
                path: '/pages/agreement/index?p=member'
            },
            {
                label: '售后服务',
                path: '/pages/agreement/index?p=afterSale'
            },
            {
                label: '隐私政策',
                path: '/pages/agreement/index?p=privacy'
            },
            {
                label: '优惠券说明',
                path: '/pages/agreement/index?p=coupon'
            },
        ]
    },
    runComputed: function () {
        index_1.computed(this, {});
    },
    go: function (_a) {
        var currentTarget = _a.currentTarget;
        var data = currentTarget.dataset.data;
        route_1.navTo(data.path);
    },
    onLoad: function () {
    },
    onShow: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtDQUFpRDtBQUNqRCwyQ0FBMEM7QUFFMUMsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFXLENBQUM7QUFFOUIsSUFBSSxDQUFDO0lBRUQsSUFBSSxFQUFFO1FBRUYsV0FBVyxFQUFFO1lBQ1Q7Z0JBQ0ksS0FBSyxFQUFFLE1BQU07Z0JBQ2IsSUFBSSxFQUFFLGtDQUFrQzthQUMzQztZQUNEO2dCQUNJLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxpQ0FBaUM7YUFDMUM7WUFDRDtnQkFDSSxLQUFLLEVBQUUsTUFBTTtnQkFDYixJQUFJLEVBQUUsb0NBQW9DO2FBQzdDO1lBQ0Q7Z0JBQ0ksS0FBSyxFQUFFLE1BQU07Z0JBQ2IsSUFBSSxFQUFFLGtDQUFrQzthQUMzQztZQUNEO2dCQUNJLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxpQ0FBaUM7YUFDMUM7U0FDSjtLQUVKO0lBRUQsV0FBVztRQUNQLGdCQUFRLENBQUUsSUFBSSxFQUFFLEVBR2YsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEVBQUUsWUFBQyxFQUFpQjtZQUFmLGdDQUFhO1FBQ04sSUFBQSxpQ0FBSSxDQUEyQjtRQUN2QyxhQUFLLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNO0lBRU4sQ0FBQztJQUVELE1BQU07SUFFTixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IHsgSUFwcCB9IGZyb20gXCIuLi8uLi9nbG9iYWxcIjtcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4JztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8IElBcHAgPiggKTtcblxuUGFnZSh7XG5cbiAgICBkYXRhOiB7XG4gICAgICAgIFxuICAgICAgICBzZXR0aW5nTGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn55So5oi35Y2P6K6uJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnL3BhZ2VzL2FncmVlbWVudC9pbmRleD9wPXVzZXJSZWcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5Lya5ZGYJuenr+WIhicsXG4gICAgICAgICAgICAgICAgcGF0aDogJy9wYWdlcy9hZ3JlZW1lbnQvaW5kZXg/cD1tZW1iZXInXG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+WUruWQjuacjeWKoScsXG4gICAgICAgICAgICAgICAgcGF0aDogJy9wYWdlcy9hZ3JlZW1lbnQvaW5kZXg/cD1hZnRlclNhbGUnXG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+makOengeaUv+etlicsXG4gICAgICAgICAgICAgICAgcGF0aDogJy9wYWdlcy9hZ3JlZW1lbnQvaW5kZXg/cD1wcml2YWN5J1xuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfkvJjmg6DliLjor7TmmI4nLFxuICAgICAgICAgICAgICAgIHBhdGg6ICcvcGFnZXMvYWdyZWVtZW50L2luZGV4P3A9Y291cG9uJ1xuICAgICAgICAgICAgfSwgXG4gICAgICAgIF1cblxuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cblxuICAgICAgICB9KTsgXG4gICAgfSxcblxuICAgIGdvKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gY3VycmVudFRhcmdldC5kYXRhc2V0O1xuICAgICAgICBuYXZUbyggZGF0YS5wYXRoICk7XG4gICAgfSxcblxuICAgIG9uTG9hZCggKSB7XG5cbiAgICB9LFxuXG4gICAgb25TaG93KCApIHtcblxuICAgIH1cbn0pXG4iXX0=