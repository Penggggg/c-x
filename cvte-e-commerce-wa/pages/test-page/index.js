"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../config/index");
var index_2 = require("../../lib/vuefy/index");
var app = getApp();
Page({
    data: {
        skuList: [
            {
                num: 3,
                skuId: '2c9111926d15c64a016d15e67e140004'
            }
        ],
        skuItem: {
            num: 3,
            skuCode: '2c9ecb9a6d5cd7b8016d5db409790074'
        },
        refresh: '',
        searchUrl: index_1.default.host.default + "/apis/common/company-check"
    },
    runComputed: function () {
        index_2.computed(this, {});
    },
    onCouponChange: function (_a) {
        var detail = _a.detail;
        console.log(detail);
    },
    open: function () {
        var this_ = this;
        var pop = this_.selectComponent('#coupon');
        pop.open();
    },
    onLoad: function () {
    },
    onShow: function () {
        this.setData({
            refresh: (Math.random() * 9999).toFixed(0)
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUF3QztBQUd4QywrQ0FBaUQ7QUFHakQsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFXLENBQUM7QUFFOUIsSUFBSSxDQUFDO0lBRUQsSUFBSSxFQUFFO1FBRUYsT0FBTyxFQUFFO1lBQ0w7Z0JBQ0ksR0FBRyxFQUFFLENBQUM7Z0JBQ04sS0FBSyxFQUFFLGtDQUFrQzthQUM1QztTQUNKO1FBRUQsT0FBTyxFQUFFO1lBQ0wsR0FBRyxFQUFFLENBQUM7WUFDTixPQUFPLEVBQUUsa0NBQWtDO1NBQzlDO1FBRUQsT0FBTyxFQUFFLEVBQUU7UUFFWCxTQUFTLEVBQUssZUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLCtCQUE0QjtLQUVoRTtJQUVELFdBQVc7UUFDUCxnQkFBUSxDQUFFLElBQUksRUFBRSxFQUdmLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxjQUFjLFlBQUMsRUFBVTtZQUFSLGtCQUFNO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDMUIsQ0FBQztJQUdELElBQUk7UUFDQSxJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7UUFDeEIsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QyxHQUFHLENBQUMsSUFBSSxFQUFHLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07SUFFTixDQUFDO0lBRUQsTUFBTTtRQUNGLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixPQUFPLEVBQUUsQ0FBRSxJQUFJLENBQUMsTUFBTSxFQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBRTtTQUNqRCxDQUFDLENBQUE7SUFDTixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IHsgSUFwcCB9IGZyb20gXCIuLi8uLi9nbG9iYWxcIjtcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4JztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8IElBcHAgPiggKTtcblxuUGFnZSh7XG5cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgc2t1TGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG51bTogMyxcbiAgICAgICAgICAgICAgICBza3VJZDogJzJjOTExMTkyNmQxNWM2NGEwMTZkMTVlNjdlMTQwMDA0J1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuXG4gICAgICAgIHNrdUl0ZW06IHtcbiAgICAgICAgICAgIG51bTogMyxcbiAgICAgICAgICAgIHNrdUNvZGU6ICcyYzllY2I5YTZkNWNkN2I4MDE2ZDVkYjQwOTc5MDA3NCdcbiAgICAgICAgfSxcblxuICAgICAgICByZWZyZXNoOiAnJyxcblxuICAgICAgICBzZWFyY2hVcmw6IGAke2NvbmZpZy5ob3N0LmRlZmF1bHR9L2FwaXMvY29tbW9uL2NvbXBhbnktY2hlY2tgXG5cbiAgICB9LFxuXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG5cbiAgICAgICAgfSk7IFxuICAgIH0sXG5cbiAgICBvbkNvdXBvbkNoYW5nZSh7IGRldGFpbCB9KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCBkZXRhaWwgKTtcbiAgICB9LFxuXG4gICAgLyoqIOaJk+W8gCAqL1xuICAgIG9wZW4oICkge1xuICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgY29uc3QgcG9wID0gdGhpc18uc2VsZWN0Q29tcG9uZW50KCcjY291cG9uJyk7XG4gICAgICAgIHBvcC5vcGVuKCApO1xuICAgIH0sXG5cbiAgICBvbkxvYWQoICkge1xuXG4gICAgfSxcblxuICAgIG9uU2hvdyggKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgcmVmcmVzaDogKCBNYXRoLnJhbmRvbSggKSAqIDk5OTkpLnRvRml4ZWQoIDAgKVxuICAgICAgICB9KVxuICAgIH1cbn0pXG4iXX0=