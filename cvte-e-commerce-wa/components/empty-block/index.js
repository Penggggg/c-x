"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
Component({
    properties: {
        tips: {
            type: String,
            value: '',
            observer: 'init'
        },
        boldText: {
            type: String,
            value: '咨询客服'
        },
        img: {
            type: String,
            value: 'cloud://dev-cz0o8.6465-dev-cz0o8/background/image_illustration@3x.png'
        }
    },
    data: {
        tipsArr: []
    },
    methods: {
        init: function (init) {
            var this_ = this;
            var _a = this_.data, tips = _a.tips, boldText = _a.boldText;
            var meta = tips
                .split(',')
                .map(function (text) {
                var index = text.indexOf(boldText);
                return [{
                        type: 'normal',
                        text: text.slice(0, index)
                    }, {
                        type: 'bold',
                        cb: 'onCall',
                        text: text.slice(index, boldText.length)
                    }, {
                        type: 'normal',
                        text: text.slice(index + boldText.length)
                    }];
            });
            this_.setData({
                tipsArr: meta
            });
        },
        onCall: function (phoneNumber) {
            if (phoneNumber === void 0) { phoneNumber = app.store.Common.customerService; }
            wx.makePhoneCall({
                phoneNumber: phoneNumber
            });
        },
        onTap: function (_a) {
            var currentTarget = _a.currentTarget;
            var cb = currentTarget.dataset.item.cb;
            if (!cb) {
                return;
            }
            try {
                this[cb]();
            }
            catch (e) { }
        }
    },
    attached: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVyxDQUFDO0FBTTlCLFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQUdSLElBQUksRUFBRTtZQUNGLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsTUFBTTtTQUNuQjtRQUdELFFBQVEsRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLE1BQU07U0FDaEI7UUFFRCxHQUFHLEVBQUU7WUFDRCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSx1RUFBdUU7U0FDakY7S0FDSjtJQUtELElBQUksRUFBRTtRQUNGLE9BQU8sRUFBRSxFQUFHO0tBQ2Y7SUFLRCxPQUFPLEVBQUU7UUFFTCxJQUFJLFlBQUUsSUFBSTtZQUNOLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNsQixJQUFBLGVBQStCLEVBQTdCLGNBQUksRUFBRSxzQkFBdUIsQ0FBQztZQUV0QyxJQUFNLElBQUksR0FBRyxJQUFJO2lCQUNaLEtBQUssQ0FBQyxHQUFHLENBQUM7aUJBQ1YsR0FBRyxDQUFFLFVBQUEsSUFBSTtnQkFDTixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFFLFFBQVEsQ0FBRSxDQUFDO2dCQUN2QyxPQUFPLENBQUM7d0JBQ0osSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBRTtxQkFDL0IsRUFBRTt3QkFDQyxJQUFJLEVBQUUsTUFBTTt3QkFDWixFQUFFLEVBQUUsUUFBUTt3QkFDWixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBRTtxQkFDN0MsRUFBRTt3QkFDQyxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBRTtxQkFDOUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFFUCxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUNWLE9BQU8sRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxNQUFNLFlBQUUsV0FBOEM7WUFBOUMsNEJBQUEsRUFBQSxjQUFjLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWU7WUFFbEQsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDYixXQUFXLGFBQUE7YUFDZCxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsS0FBSyxZQUFDLEVBQWlCO2dCQUFmLGdDQUFhO1lBQ1QsSUFBQSxrQ0FBRSxDQUFnQztZQUUxQyxJQUFLLENBQUMsRUFBRSxFQUFHO2dCQUFFLE9BQU87YUFBRTtZQUN0QixJQUFJO2dCQUNBLElBQUksQ0FBRSxFQUFFLENBQUUsRUFBRyxDQUFDO2FBQ2pCO1lBQUMsT0FBTyxDQUFDLEVBQUcsR0FBRztRQUNwQixDQUFDO0tBQ0o7SUFFRCxRQUFRLEVBQUU7SUFFVixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog6I+c5ZOB5qCH562+6YCJ5oup5YiX6KGoXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy8g5YiG5q6155qE6K+dIOiLseaWh+mAl+WPt+malOW8gFxuICAgICAgICB0aXBzOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBvYnNlcnZlcjogJ2luaXQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g6ZyA6KaB5Y+Y57KX5Y+Y6buR55qE5paH5a2XXG4gICAgICAgIGJvbGRUZXh0OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ+WSqOivouWuouacjSdcbiAgICAgICAgfSxcblxuICAgICAgICBpbWc6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnY2xvdWQ6Ly9kZXYtY3owbzguNjQ2NS1kZXYtY3owbzgvYmFja2dyb3VuZC9pbWFnZV9pbGx1c3RyYXRpb25AM3gucG5nJ1xuICAgICAgICB9XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog57uE5Lu255qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuICAgICAgICB0aXBzQXJyOiBbIF1cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTmlrnms5XliJfooahcbiAgICAgKi9cbiAgICBtZXRob2RzOiB7XG5cbiAgICAgICAgaW5pdCggaW5pdCApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyB0aXBzLCBib2xkVGV4dCB9ID0gdGhpc18uZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IHRpcHNcbiAgICAgICAgICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgIC5tYXAoIHRleHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRleHQuaW5kZXhPZiggYm9sZFRleHQgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbm9ybWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQuc2xpY2UoIDAsIGluZGV4IClcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2I6ICdvbkNhbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dC5zbGljZSggaW5kZXgsIGJvbGRUZXh0Lmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdub3JtYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dC5zbGljZSggaW5kZXggKyBib2xkVGV4dC5sZW5ndGggKVxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICB0aXBzQXJyOiBtZXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBvbkNhbGwoIHBob25lTnVtYmVyID0gYXBwLnN0b3JlLkNvbW1vbi5jdXN0b21lclNlcnZpY2UpIHtcbiAgICAgICAgICAgIC8vIOS4jeaJk+eUteivneS6hu+8jOiAjOaYr+ebtOaOpei/m+WFpeWuouacjVxuICAgICAgICAgICAgd3gubWFrZVBob25lQ2FsbCh7XG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uVGFwKHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgICAgICBjb25zdCB7IGNiIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuaXRlbTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCAhY2IgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgdHJ5IHsgXG4gICAgICAgICAgICAgICAgdGhpc1sgY2IgXSggKTtcbiAgICAgICAgICAgIH0gY2F0Y2goIGUgKSB7IH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhdHRhY2hlZDogZnVuY3Rpb24oICkge1xuXG4gICAgfVxufSlcbiAgIl19