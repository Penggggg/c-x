"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    properties: {
        title: {
            type: String,
            value: ''
        }
    },
    data: {
        tipsArr: []
    },
    methods: {
        init: function (init) {
            var this_ = this;
            var tips = this_.data.tips;
            this_.setData({
                tipsArr: tips.split(',')
            });
        }
    },
    attached: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQUdSLEtBQUssRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLEVBQUU7U0FDWjtLQUNKO0lBS0QsSUFBSSxFQUFFO1FBQ0YsT0FBTyxFQUFFLEVBQUc7S0FDZjtJQUtELE9BQU8sRUFBRTtRQUNMLElBQUksWUFBRSxJQUFJO1lBQ04sSUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO1lBQ2hCLElBQUEsc0JBQUksQ0FBZ0I7WUFFNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDM0IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUNKO0lBRUQsUUFBUSxFQUFFO0lBRVYsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUuanMnO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog6I+c5ZOB5qCH562+6YCJ5oup5YiX6KGoXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy8g5YiG5q6155qE6K+dIOiLseaWh+mAl+WPt+malOW8gFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcnXG4gICAgICAgIH1cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG4gICAgICAgIHRpcHNBcnI6IFsgXVxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOaWueazleWIl+ihqFxuICAgICAqL1xuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgaW5pdCggaW5pdCApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyB0aXBzIH0gPSB0aGlzXy5kYXRhO1xuXG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICB0aXBzQXJyOiB0aXBzLnNwbGl0KCcsJylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbiggKSB7XG5cbiAgICB9XG59KVxuICAiXX0=