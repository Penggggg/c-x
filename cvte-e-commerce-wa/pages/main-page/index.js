"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var index_1 = require("../../lib/vuefy/index");
var route_1 = require("../../utils/route");
var app = getApp();
Page({
    data: {
        mainGoods: [],
        deputyGoods: [{
                image: './WechatIMG265.png',
                name: '移动支架ST33',
                desc: '自由随意滑动'
            }, {
                image: './WechatIMG265.png',
                name: '移动支架ST33',
                desc: '自由随意滑动'
            }, {
                image: './WechatIMG265.png',
                name: '移动支架ST33',
                desc: '自由随意滑动'
            }, {
                image: './WechatIMG265.png',
                name: '移动支架ST33',
                desc: '自由随意滑动'
            }]
    },
    enterTime: 0,
    goTo: function (e) {
        route_1.navTo("/pages/good-detail/index?id=" + e.currentTarget.dataset.key);
    },
    onNavToPerson: function () {
        route_1.navTo("/pages/person/index");
    },
    runComputed: function () {
        index_1.computed(this, {});
    },
    onLoad: function (q) {
        var _this = this;
        var distributorId = q.distributorId, skuId = q.skuId;
        http_1.http({
            method: 'GET',
            path: "/apis/goods/goods-list"
        }).then(function (val) {
            console.log('我的结果', val);
            if (val.status !== 200) {
                return;
            }
            _this.setData({
                mainGoods: val.data.list
            });
        }).catch(function (e) {
            console.error('出错了1111:', e);
        });
    },
    onShow: function () {
        this.enterTime = new Date().getTime();
    },
    onHide: function () {
        app.dataBury$([{
                "$code": "visitMainPage",
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime()
            }]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlDQUF3QztBQUN4QywrQ0FBaUQ7QUFDakQsMkNBQTBDO0FBRTFDLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRTNCLElBQUksQ0FBQztJQUNELElBQUksRUFBRTtRQUNGLFNBQVMsRUFBRSxFQUFFO1FBQ2IsV0FBVyxFQUFFLENBQUM7Z0JBQ1YsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxRQUFRO2FBQ2pCLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxRQUFRO2FBQ2pCLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxRQUFRO2FBQ2pCLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxRQUFRO2FBQ2pCLENBQUM7S0FDTDtJQUVELFNBQVMsRUFBRSxDQUFDO0lBQ1osSUFBSSxZQUFDLENBQUM7UUFDRixhQUFLLENBQUMsaUNBQStCLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUssQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxhQUFhO1FBQ1QsYUFBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELFdBQVc7UUFDUCxnQkFBUSxDQUFDLElBQUksRUFBRSxFQUdkLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLFlBQUMsQ0FBTTtRQUFiLGlCQWdCQztRQWZXLElBQUEsK0JBQWEsRUFBRSxlQUFLLENBQU87UUFDbkMsV0FBSSxDQUFDO1lBQ0QsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsd0JBQXdCO1NBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDekIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtnQkFDcEIsT0FBTzthQUNWO1lBQ0QsS0FBSSxDQUFDLE9BQVEsQ0FBQztnQkFDVixTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO2FBQzNCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUM7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxNQUFNO1FBRUYsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sRUFBQyxlQUFlO2dCQUN2QixLQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQ3BCLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDM0IsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFO2FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4JztcbmltcG9ydCB7IElBcHAgfSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCI7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleCc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlJztcblxuY29uc3QgYXBwID0gZ2V0QXBwPElBcHA+KCk7XG5cblBhZ2Uoe1xuICAgIGRhdGE6IHtcbiAgICAgICAgbWFpbkdvb2RzOiBbXSxcbiAgICAgICAgZGVwdXR5R29vZHM6IFt7XG4gICAgICAgICAgICBpbWFnZTogJy4vV2VjaGF0SU1HMjY1LnBuZycsXG4gICAgICAgICAgICBuYW1lOiAn56e75Yqo5pSv5p62U1QzMycsXG4gICAgICAgICAgICBkZXNjOiAn6Ieq55Sx6ZqP5oSP5ruR5YqoJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBpbWFnZTogJy4vV2VjaGF0SU1HMjY1LnBuZycsXG4gICAgICAgICAgICBuYW1lOiAn56e75Yqo5pSv5p62U1QzMycsXG4gICAgICAgICAgICBkZXNjOiAn6Ieq55Sx6ZqP5oSP5ruR5YqoJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBpbWFnZTogJy4vV2VjaGF0SU1HMjY1LnBuZycsXG4gICAgICAgICAgICBuYW1lOiAn56e75Yqo5pSv5p62U1QzMycsXG4gICAgICAgICAgICBkZXNjOiAn6Ieq55Sx6ZqP5oSP5ruR5YqoJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBpbWFnZTogJy4vV2VjaGF0SU1HMjY1LnBuZycsXG4gICAgICAgICAgICBuYW1lOiAn56e75Yqo5pSv5p62U1QzMycsXG4gICAgICAgICAgICBkZXNjOiAn6Ieq55Sx6ZqP5oSP5ruR5YqoJ1xuICAgICAgICB9XVxuICAgIH0sXG4gICAgLy8g6L+b5YWl6aG16Z2i5pe26Ze0XG4gICAgZW50ZXJUaW1lOiAwLFxuICAgIGdvVG8oZSkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL2dvb2QtZGV0YWlsL2luZGV4P2lkPSR7ZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQua2V5fWApO1xuICAgIH0sXG5cbiAgICBvbk5hdlRvUGVyc29uKCkge1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL3BlcnNvbi9pbmRleGApO1xuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCgpIHtcbiAgICAgICAgY29tcHV0ZWQodGhpcywge1xuXG5cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uTG9hZChxOiBhbnkpIHtcbiAgICAgICAgY29uc3QgeyBkaXN0cmlidXRvcklkLCBza3VJZCB9ID0gcTtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL2dvb2RzL2dvb2RzLWxpc3RgXG4gICAgICAgIH0pLnRoZW4oKHZhbCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+aIkeeahOe7k+aenCcsIHZhbCk7XG4gICAgICAgICAgICBpZiAodmFsLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgbWFpbkdvb2RzOiB2YWwuZGF0YS5saXN0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCflh7rplJnkuoYxMTExOicsIGUpO1xuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBvblNob3coKSB7XG4gICAgICAgIHRoaXMuZW50ZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfSxcblxuICAgIG9uSGlkZSgpe1xuICAgICAgICAvLyDpppbpobVQVuWfi+eCuVxuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6XCJ2aXNpdE1haW5QYWdlXCIsXG4gICAgICAgICAgICBcIiR0c1wiOnRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJlbnRlclRpbWVcIjogdGhpcy5lbnRlclRpbWUsXG4gICAgICAgICAgICBcImxlYXZlVGltZVwiOiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9XSk7XG4gICAgfVxufSkiXX0=