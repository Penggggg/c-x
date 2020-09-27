"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_js_1 = require("./config.js");
var index_1 = require("../../lib/vuefy/index");
var app = getApp();
Page({
    data: {
        agreement: '',
        imageStyle: ''
    },
    runComputed: function () {
        index_1.computed(this, {});
    },
    onTabChange: function (_a) {
        var detail = _a.detail;
        this.setData({
            current: detail
        });
    },
    onLoad: function (q) {
        this.setData({
            agreement: config_js_1.default[q.p].text
        });
    },
    onShow: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlDQUFpQztBQUdqQywrQ0FBaUQ7QUFHakQsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFXLENBQUM7QUFFOUIsSUFBSSxDQUFDO0lBTUQsSUFBSSxFQUFFO1FBQ0YsU0FBUyxFQUFFLEVBQUU7UUFDYixVQUFVLEVBQUUsRUFBRTtLQUNqQjtJQUVELFdBQVc7UUFDUCxnQkFBUSxDQUFFLElBQUksRUFBRSxFQUVmLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLFlBQUMsRUFBVTtZQUFSLGtCQUFNO1FBQ2hCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixPQUFPLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsTUFBTSxZQUFFLENBQU07UUFDVixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsU0FBUyxFQUFFLG1CQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDOUIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELE1BQU07SUFFTixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IGFnckNvZiBmcm9tICcuL2NvbmZpZy5qcyc7XG5pbXBvcnQgeyBJQXBwIH0gZnJvbSBcIi4uLy4uL2dsb2JhbFwiO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXgnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZSc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuXG5QYWdlKHtcbiAgICAvLyDmi7/liLDlr4zmlofmnKzmraXpqqRcbiAgICAvLyAxLiDmiZPlvIB1ZWVkaXRvcuWcqOe6v2RlbW/lnLDlnYDvvIwgIGh0dHBzOi8vdWVkaXRvci5iYWlkdS5jb20vd2Vic2l0ZS9vbmxpbmVkZW1vLmh0bWxcbiAgICAvLyAyLiDlsIZ3b3Jk5paH5Lu25aSN5Yi25Yiw5a+M5paH5pys5qGG5LitXG4gICAgLy8gMy4g5Zyo5byA5Y+R6ICF6aG16Z2i5Lit6L6T5YWlY29uc29sZS5sb2coVUUuZ2V0RWRpdG9yKCdlZGl0b3InKS5nZXRDb250ZW50KCkpOyDlubbmiafooYzvvIzljbPlj6/lvpfliLDlr4zmlofmnKxcbiAgICAvLyA0LiDlsIblvpfliLDnmoTmlbDmja5jb3B55Yiw5q2k5paH5Lu25LitXG4gICAgZGF0YToge1xuICAgICAgICBhZ3JlZW1lbnQ6ICcnLFxuICAgICAgICBpbWFnZVN0eWxlOiAnJ1xuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG5cbiAgICAgICAgfSk7IFxuICAgIH0sXG5cbiAgICBvblRhYkNoYW5nZSh7IGRldGFpbCB9KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgY3VycmVudDogZGV0YWlsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkxvYWQoIHE6IGFueSApIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBhZ3JlZW1lbnQ6IGFnckNvZltxLnBdLnRleHRcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgb25TaG93KCApIHtcblxuICAgIH1cbn0pXG4iXX0=