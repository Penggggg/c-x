"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    properties: {
        tabs: {
            type: Array,
            value: []
        },
        active: {
            type: Number,
            value: 0,
            observer: 'initActive'
        }
    },
    data: {
        current: 0
    },
    methods: {
        initActive: function (v) {
            var this_ = this;
            if (v !== undefined && v !== null) {
                this_.setData({
                    current: v
                });
            }
        },
        onTab: function (_a) {
            var currentTarget = _a.currentTarget;
            var this_ = this;
            var current = this_.data.current;
            var _b = currentTarget.dataset, active = _b.active, key = _b.key;
            if (current === active) {
                return;
            }
            this_.setData({
                current: active
            });
            this_.triggerEvent('change', key || active);
        }
    },
    attached: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQVFSLElBQUksRUFBRTtZQUNGLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEVBQUc7U0FDYjtRQUdELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7WUFDUixRQUFRLEVBQUUsWUFBWTtTQUN6QjtLQUNKO0lBS0QsSUFBSSxFQUFFO1FBR0YsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUtELE9BQU8sRUFBRTtRQUdMLFVBQVUsWUFBRSxDQUFDO1lBQ1QsSUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO1lBQ3hCLElBQUssQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFHO2dCQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUNWLE9BQU8sRUFBRSxDQUFDO2lCQUNiLENBQUMsQ0FBQzthQUNOO1FBQ0wsQ0FBQztRQUdELEtBQUssWUFBQyxFQUFpQjtnQkFBZixnQ0FBYTtZQUNqQixJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDaEIsSUFBQSw0QkFBTyxDQUFnQjtZQUN6QixJQUFBLDBCQUF1QyxFQUFyQyxrQkFBTSxFQUFFLFlBQTZCLENBQUM7WUFFOUMsSUFBSyxPQUFPLEtBQUssTUFBTSxFQUFHO2dCQUFFLE9BQU87YUFBRTtZQUVyQyxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUNWLE9BQU8sRUFBRSxNQUFNO2FBQ2xCLENBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUUsQ0FBQTtRQUNoRCxDQUFDO0tBRUo7SUFFRCxRQUFRLEVBQUU7SUFFVixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiB0YWLmoI9cbiAqL1xuQ29tcG9uZW50KHtcblxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOWxnuaAp+WIl+ihqFxuICAgICAqL1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICB0YWJcbiAgICAgICAgICoge1xuICAgICAgICAgKiAgICBrZXk6IG51bWJlcixcbiAgICAgICAgICogICAgbGFiZWw6IHN0cmluZ1xuICAgICAgICAgKiB9WyBdXG4gICAgICAgICAqL1xuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgIHZhbHVlOiBbIF1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDmtLvliqjkuIvmoIdcbiAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnaW5pdEFjdGl2ZSdcbiAgICAgICAgfVxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDlvZPliY3kuIvmoIdcbiAgICAgICAgY3VycmVudDogMFxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOaWueazleWIl+ihqFxuICAgICAqL1xuICAgIG1ldGhvZHM6IHtcblxuICAgICAgICAvLyDliJ3lp4vljJbkuIvmoIdcbiAgICAgICAgaW5pdEFjdGl2ZSggdiApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCB2ICE9PSB1bmRlZmluZWQgJiYgdiAhPT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudDogdlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOeCueWHu1xuICAgICAgICBvblRhYih7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IGN1cnJlbnQgfSA9IHRoaXNfLmRhdGE7XG4gICAgICAgICAgICBjb25zdCB7IGFjdGl2ZSwga2V5IH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG5cbiAgICAgICAgICAgIGlmICggY3VycmVudCA9PT0gYWN0aXZlICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudDogYWN0aXZlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXNfLnRyaWdnZXJFdmVudCgnY2hhbmdlJywga2V5IHx8IGFjdGl2ZSApXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBhdHRhY2hlZDogZnVuY3Rpb24oICkge1xuXG4gICAgfVxufSlcbiAgIl19