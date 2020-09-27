"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    properties: {
        detail: {
            type: Object,
            value: {
                image: '',
                name: '',
                desc: '',
                price: '',
                count: '',
                unit: ''
            }
        },
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
            var active = currentTarget.dataset.active;
            if (current === active) {
                return;
            }
            this_.setData({
                current: active
            });
            this_.triggerEvent('change', active);
        }
    },
    attached: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQVFSLE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFO2dCQUNILEtBQUssRUFBRSxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxFQUFFO2dCQUNSLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFO2FBQ1g7U0FDSjtLQUNKO0lBS0QsSUFBSSxFQUFFO1FBR0YsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUtELE9BQU8sRUFBRTtRQUdMLFVBQVUsWUFBRSxDQUFDO1lBQ1QsSUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO1lBQ3hCLElBQUssQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFHO2dCQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUNWLE9BQU8sRUFBRSxDQUFDO2lCQUNiLENBQUMsQ0FBQzthQUNOO1FBQ0wsQ0FBQztRQUdELEtBQUssWUFBQyxFQUFpQjtnQkFBZixnQ0FBYTtZQUNqQixJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDaEIsSUFBQSw0QkFBTyxDQUFnQjtZQUN2QixJQUFBLHFDQUFNLENBQTJCO1lBRXpDLElBQUssT0FBTyxLQUFLLE1BQU0sRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFFckMsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDVixPQUFPLEVBQUUsTUFBTTthQUNsQixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUUsQ0FBQTtRQUN6QyxDQUFDO0tBRUo7SUFFRCxRQUFRLEVBQUU7SUFFVixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiB0YWLmoI9cbiAqL1xuQ29tcG9uZW50KHtcblxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOWxnuaAp+WIl+ihqFxuICAgICAqL1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICB0YWJcbiAgICAgICAgICoge1xuICAgICAgICAgKiAgICBrZXk6IG51bWJlcixcbiAgICAgICAgICogICAgbGFiZWw6IHN0cmluZ1xuICAgICAgICAgKiB9WyBdXG4gICAgICAgICAqL1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgaW1hZ2U6ICcnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgICAgIGRlc2M6ICcnLFxuICAgICAgICAgICAgICAgIHByaWNlOiAnJyxcbiAgICAgICAgICAgICAgICBjb3VudDogJycsXG4gICAgICAgICAgICAgICAgdW5pdDogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgLy8g5b2T5YmN5LiL5qCHXG4gICAgICAgIGN1cnJlbnQ6IDBcbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTmlrnms5XliJfooahcbiAgICAgKi9cbiAgICBtZXRob2RzOiB7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW5LiL5qCHXG4gICAgICAgIGluaXRBY3RpdmUoIHYgKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGlmICggdiAhPT0gdW5kZWZpbmVkICYmIHYgIT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IHZcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDngrnlh7tcbiAgICAgICAgb25UYWIoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyBjdXJyZW50IH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgY29uc3QgeyBhY3RpdmUgfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcblxuICAgICAgICAgICAgaWYgKCBjdXJyZW50ID09PSBhY3RpdmUgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBjdXJyZW50OiBhY3RpdmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpc18udHJpZ2dlckV2ZW50KCdjaGFuZ2UnLCBhY3RpdmUgKVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgYXR0YWNoZWQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgIFxuICAgIH1cbn0pXG4gICJdfQ==