"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../lib/vuefy/index");
var app = getApp();
Page({
    data: {
        phone: ''
    },
    watchApp: function () {
        var this_ = this;
        app.watch$('Common.customerService', function (phone) {
            !!phone && this_.setData({
                phone: phone
            });
        });
    },
    runComputed: function () {
        index_1.computed(this, {});
    },
    onLoad: function () {
        this.watchApp();
    },
    onShow: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtDQUFpRDtBQUdqRCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVcsQ0FBQztBQUU5QixJQUFJLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFDRixLQUFLLEVBQUUsRUFBRTtLQUNaO0lBR0QsUUFBUTtRQUNKLElBQU0sS0FBSyxHQUFPLElBQUksQ0FBQztRQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLFVBQUEsS0FBSztZQUN0QyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFRLENBQUM7Z0JBQ3RCLEtBQUssT0FBQTthQUNSLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVc7UUFDUCxnQkFBUSxDQUFFLElBQUksRUFBRSxFQUVmLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFFBQVEsRUFBRyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxNQUFNO0lBRU4sQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4JztcbmltcG9ydCB7IElBcHAgfSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCI7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleCc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPCBJQXBwID4oICk7XG5cblBhZ2Uoe1xuXG4gICAgZGF0YToge1xuICAgICAgICBwaG9uZTogJydcbiAgICB9LFxuXG4gICAgLyoqIOebkeWQrCAqL1xuICAgIHdhdGNoQXBwKCApIHtcbiAgICAgICAgY29uc3QgdGhpc186YW55ID0gdGhpcztcbiAgICAgICAgYXBwLndhdGNoJCgnQ29tbW9uLmN1c3RvbWVyU2VydmljZScsIHBob25lID0+IHtcbiAgICAgICAgICAgICEhcGhvbmUgJiYgdGhpc18uc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHBob25lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJ1bkNvbXB1dGVkKCApIHtcbiAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICB9KTsgXG4gICAgfSxcblxuICAgIG9uTG9hZCggKSB7XG4gICAgICAgIHRoaXMud2F0Y2hBcHAoICk7XG4gICAgfSxcblxuICAgIG9uU2hvdyggKSB7XG5cbiAgICB9XG59KVxuIl19