"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    properties: {
        imgs: {
            type: Array,
            value: [],
            observer: 'init'
        },
        interval: {
            type: Number,
            value: 5000
        }
    },
    data: {
        current: 0
    },
    methods: {
        previewImg: function (_a) {
            var currentTarget = _a.currentTarget;
            var imgs = this.data.imgs;
            var img = currentTarget.dataset.img;
            wx.previewImage({
                current: img,
                urls: imgs
            });
        },
        onSwipper: function (_a) {
            var detail = _a.detail;
            var current = detail.current;
            this.setData({
                current: current
            });
        },
        init: function () {
            this.setData({
                current: 0
            });
        }
    },
    attached: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQU9SLElBQUksRUFBRTtZQUNGLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEVBQUc7WUFDVixRQUFRLEVBQUUsTUFBTTtTQUNuQjtRQUtELFFBQVEsRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLElBQUk7U0FDZDtLQUNKO0lBS0QsSUFBSSxFQUFFO1FBR0YsT0FBTyxFQUFFLENBQUM7S0FFYjtJQUtELE9BQU8sRUFBRTtRQUdMLFVBQVUsWUFBQyxFQUFzQjtnQkFBcEIsZ0NBQWE7WUFDZCxJQUFBLHFCQUFJLENBQXdCO1lBQzVCLElBQUEsK0JBQUcsQ0FBMkI7WUFDdEMsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDWixPQUFPLEVBQUUsR0FBRztnQkFDWixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUMsQ0FBQztRQUNQLENBQUM7UUFHRCxTQUFTLFlBQUMsRUFBZTtnQkFBYixrQkFBTTtZQUNOLElBQUEsd0JBQU8sQ0FBWTtZQUUxQixJQUFZLENBQUMsT0FBTyxDQUFDO2dCQUNsQixPQUFPLFNBQUE7YUFDVixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsSUFBSTtZQUNDLElBQVksQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRSxDQUFDO2FBQ2IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUVKO0lBRUQsUUFBUSxFQUFFO0lBRVYsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUuanMnO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAuanMnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog6I+c5ZOB5qCH562+6YCJ5oup5YiX6KGoXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKiDlm77niYfliJfooahcbiAgICAgICAgICogc3RyaW5nIHwge1xuICAgICAgICAgKiAgICB1cmwg5Zu+54mH6Lev5b6EXG4gICAgICAgICAqICAgIHBhdGgg6Lez6L2s6Lev5b6EXG4gICAgICAgICAqIH1bIF1cbiAgICAgICAgICovXG4gICAgICAgIGltZ3M6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgdmFsdWU6IFsgXSxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnaW5pdCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6Ze06ZqUXG4gICAgICAgICAqL1xuICAgICAgICBpbnRlcnZhbDoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDUwMDBcbiAgICAgICAgfVxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOWIneWni+aVsOaNrlxuICAgICAqL1xuICAgIGRhdGE6IHtcblxuICAgICAgICAvLyDkuIvmoIdcbiAgICAgICAgY3VycmVudDogMFxuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog57uE5Lu255qE5pa55rOV5YiX6KGoXG4gICAgICovXG4gICAgbWV0aG9kczoge1xuICAgICAgICBcbiAgICAgICAgLyoqIOmihOiniOWbvueJhyAqL1xuICAgICAgICBwcmV2aWV3SW1nKHsgY3VycmVudFRhcmdldCB9OiBhbnkgKSB7XG4gICAgICAgICAgICBjb25zdCB7IGltZ3MgfSA9ICh0aGlzIGFzIGFueSkuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHsgaW1nIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgICAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IGltZyxcbiAgICAgICAgICAgICAgICB1cmxzOiBpbWdzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5ruR5Yqo5LqL5Lu2ICovXG4gICAgICAgIG9uU3dpcHBlcih7IGRldGFpbCB9OiBhbnkgKSB7XG4gICAgICAgICAgICBjb25zdCB7IGN1cnJlbnQgfSA9IGRldGFpbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBjdXJyZW50XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0KCApIHtcbiAgICAgICAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY3VycmVudDogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBhdHRhY2hlZDogZnVuY3Rpb24oICkge1xuXG4gICAgfVxufSlcbiAgIl19