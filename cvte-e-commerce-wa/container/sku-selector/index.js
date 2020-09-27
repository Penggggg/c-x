"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
Component({
    properties: {
        skus: {
            type: Array,
            value: [],
            observer: 'initSelectedSku'
        }
    },
    data: {
        isIPhoneX: false,
        selectedSku: null,
        open: false,
        animationSku: null,
        animationSkuBg: null,
        isUserAuth: false,
        selectdSkuCount: 1
    },
    methods: {
        checkAuth: function () {
            var this_ = this;
            app.watch$('Auth.isUserAuth', function (val) {
                if (val === undefined) {
                    return;
                }
                this_.setData({
                    isUserAuth: val
                });
            });
        },
        getUserAuth: function () {
            var this_ = this;
            app.store
                .Auth.getUserAuth()
                .then(function () {
                this_.confirmSelect();
            });
        },
        getPhoneAuth: function (e) {
            app.store.Auth.getUserPhoneAndRegister(e)
                .then(function (data) { return console.log('...', data); });
        },
        initSelectedSku: function () {
            var this_ = this;
            var skus = this_.data.skus;
            console.log('我的sku', skus);
            if (!skus || skus.length === 0) {
                return;
            }
            var defaultSkuIndex = skus.findIndex(function (x) { return !!x.canSelect; });
            if (defaultSkuIndex !== -1) {
                var defaultSku = skus[defaultSkuIndex];
                this_.setData({
                    selectedSku: defaultSku
                });
                console.log('我的skussssss', this_.data.selectedSku);
                if (defaultSku.count) {
                    this_.setData({
                        selectdSkuCount: defaultSku.count
                    });
                }
                this_.triggerEvent('change', defaultSku);
            }
        },
        close: function () {
            var this_ = this;
            this_.triggerEvent('toggle', false);
            this_.setData({
                open: false
            });
            this.setAnimate();
        },
        open: function () {
            var this_ = this;
            var open = this_.data.open;
            this_.setData({
                open: true
            });
            this.setAnimate();
        },
        setAnimate: function () {
            var this_ = this;
            var _a = this_.data, open = _a.open, isIPhoneX = _a.isIPhoneX;
            var animationSkuMeta = wx.createAnimation({
                duration: 250,
                timingFunction: 'ease-out',
                transformOrigin: '50% 50%',
            });
            var animationSkuBgMeta = wx.createAnimation({
                duration: 250,
                timingFunction: 'ease-out',
                transformOrigin: '50% 50%',
            });
            if (open) {
                var height = isIPhoneX ? '-72vh' : '-70vh';
                animationSkuMeta.opacity(0.3).translateY(height).opacity(1).step();
                animationSkuBgMeta.opacity(1).step();
            }
            else {
                animationSkuMeta.opacity(0.5).translateY('70vh').opacity(0).step();
                animationSkuBgMeta.opacity(0).step();
            }
            this_.setData({
                animationSku: animationSkuMeta.export(),
                animationSkuBg: animationSkuBgMeta.export()
            });
        },
        preventTouchMove: function () {
        },
        previewImg: function (_a) {
            var currentTarget = _a.currentTarget;
            var img = currentTarget.dataset.img;
            wx.previewImage({
                current: img,
                urls: [img]
            });
        },
        onSelectSku: function (_a) {
            var currentTarget = _a.currentTarget;
            var this_ = this;
            var tappingSku = currentTarget.dataset.standard;
            if (!tappingSku.canSelect) {
                return;
            }
            this_.setData({
                selectdSkuCount: 1,
                selectedSku: tappingSku
            });
            this_.triggerEvent('change', tappingSku);
        },
        onSkuCount: function (_a) {
            var detail = _a.detail;
            var this_ = this;
            this_.setData({
                selectdSkuCount: detail.number
            });
        },
        confirmSelect: function (e) {
            var this_ = this;
            var _a = this_.data, selectedSku = _a.selectedSku, selectdSkuCount = _a.selectdSkuCount;
            this_.triggerEvent('confirm', {
                sku: __assign({}, selectedSku, { count$: selectdSkuCount }),
            });
            this_.close();
        },
        watchApp: function () {
            var _this = this;
            app.watch$('Common.isIPhoneX', function (v) {
                _this.setData({
                    isIPhoneX: v
                });
            });
        },
    },
    attached: function () {
        this.watchApp();
        this.checkAuth();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBTUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFXLENBQUM7QUFNOUIsU0FBUyxDQUFDO0lBS04sVUFBVSxFQUFFO1FBaUJSLElBQUksRUFBRTtZQUNGLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEVBQUc7WUFDVixRQUFRLEVBQUUsaUJBQWlCO1NBQzlCO0tBQ0o7SUFLRCxJQUFJLEVBQUU7UUFFRixTQUFTLEVBQUUsS0FBSztRQUdoQixXQUFXLEVBQUUsSUFBSTtRQUdqQixJQUFJLEVBQUUsS0FBSztRQUdYLFlBQVksRUFBRSxJQUFJO1FBR2xCLGNBQWMsRUFBRSxJQUFJO1FBR3BCLFVBQVUsRUFBRSxLQUFLO1FBR2pCLGVBQWUsRUFBRSxDQUFDO0tBRXJCO0lBS0QsT0FBTyxFQUFFO1FBR0wsU0FBUztZQUNMLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLFVBQUEsR0FBRztnQkFDN0IsSUFBSyxHQUFHLEtBQUssU0FBUyxFQUFHO29CQUFFLE9BQU87aUJBQUU7Z0JBQ3BDLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQ1YsVUFBVSxFQUFFLEdBQUc7aUJBQ2xCLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUdELFdBQVc7WUFDUCxJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDeEIsR0FBRyxDQUFDLEtBQUs7aUJBQ0osSUFBSSxDQUFDLFdBQVcsRUFBRztpQkFDbkIsSUFBSSxDQUFDO2dCQUNGLEtBQUssQ0FBQyxhQUFhLEVBQUcsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFHRCxZQUFZLFlBQUUsQ0FBQztZQUNYLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1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VixlQUFlLEVBQUUsTUFBTSxDQUFDLE1BQU07YUFDakMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUdELGFBQWEsWUFBRSxDQUFNO1lBQ2pCLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNsQixJQUFBLGVBQTZDLEVBQTNDLDRCQUFXLEVBQUUsb0NBQThCLENBQUM7WUFDcEQsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7Z0JBQzFCLEdBQUcsZUFDSSxXQUFXLElBQ2QsTUFBTSxFQUFFLGVBQWUsR0FDMUI7YUFDSixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsS0FBSyxFQUFHLENBQUM7UUFDbkIsQ0FBQztRQUdELFFBQVE7WUFBUixpQkFPQztZQU5HLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsVUFBQSxDQUFDO2dCQUUzQixLQUFZLENBQUMsT0FBUSxDQUFDO29CQUNuQixTQUFTLEVBQUUsQ0FBQztpQkFDZixDQUFDLENBQUE7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FFSjtJQUVELFFBQVEsRUFBRTtRQUNOLElBQUksQ0FBQyxRQUFRLEVBQUcsQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxFQUFHLENBQUE7SUFDckIsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHAgfSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCI7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlLmpzJztcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwLmpzJztcbmltcG9ydCB7IGNsb3VkSHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2Nsb3VkSHR0cCc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog6I+c5ZOB5qCH562+6YCJ5oup5YiX6KGoXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBza3XlsZXnpLrpmJ/liJcgXG4gICAgICAgICAqIHtcbiAgICAgICAgICogICAgICBpZCxcbiAgICAgICAgICogICAgICBjYW5TZWxlY3TmmK/lkKbog73pgInjgIFcbiAgICAgICAgICogICAgICB0aXRsZeWQjeensFxuICAgICAgICAgKiAgICAgIHByaWNl5Lu35qC8XG4gICAgICAgICAqICAgICAgZmFkZVByaWNl5LiL5YiS57q/5Lu35qC8XG4gICAgICAgICAqICAgICAgc3RvY2vlupPlrZggICBcbiAgICAgICAgICogICAgICBwaWTkuqflk4FpZFxuICAgICAgICAgKiAgICAgIHNpZOWei+WPt2lkXG4gICAgICAgICAqICAgICAgaW1n5Zu+54mHXG4gICAgICAgICAqICAgICAgbGltaXTpmZDotK3mlbDph49cbiAgICAgICAgICogICAgICBjb3VudOW3sumAieaVsOmHj1xuICAgICAgICAgKiB9XG4gICAgICAgICAqL1xuICAgICAgICBza3VzOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgIHZhbHVlOiBbIF0sXG4gICAgICAgICAgICBvYnNlcnZlcjogJ2luaXRTZWxlY3RlZFNrdScgXG4gICAgICAgIH1cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgaXNJUGhvbmVYOiBmYWxzZSxcblxuICAgICAgICAvKiog6YCJ5Lit55qEc2t1ICovXG4gICAgICAgIHNlbGVjdGVkU2t1OiBudWxsLFxuXG4gICAgICAgIC8qKiDmmK/lkKblsZXlvIAgKi9cbiAgICAgICAgb3BlbjogZmFsc2UsXG5cbiAgICAgICAgLyoqIOWKqOeUuzEgKi9cbiAgICAgICAgYW5pbWF0aW9uU2t1OiBudWxsLFxuXG4gICAgICAgIC8qKiDliqjnlLsyICovXG4gICAgICAgIGFuaW1hdGlvblNrdUJnOiBudWxsLFxuXG4gICAgICAgIC8qKiDmjojmnYPnirbmgIEgKi9cbiAgICAgICAgaXNVc2VyQXV0aDogZmFsc2UsXG5cbiAgICAgICAgLyoqIOaVsOe7hCAqL1xuICAgICAgICBzZWxlY3RkU2t1Q291bnQ6IDFcblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOaWueazleWIl+ihqFxuICAgICAqL1xuICAgIG1ldGhvZHM6IHtcblxuICAgICAgICAvKiog55uR5ZCs55So5oi35o6I5p2D5oOF5Ya1ICovXG4gICAgICAgIGNoZWNrQXV0aCggKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGFwcC53YXRjaCQoJ0F1dGguaXNVc2VyQXV0aCcsIHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgICAgIGlzVXNlckF1dGg6IHZhbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOiOt+WPlueUqOaIt+aOiOadgyAqL1xuICAgICAgICBnZXRVc2VyQXV0aCggKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGFwcC5zdG9yZVxuICAgICAgICAgICAgICAgIC5BdXRoLmdldFVzZXJBdXRoKCApXG4gICAgICAgICAgICAgICAgLnRoZW4oKCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc18uY29uZmlybVNlbGVjdCggKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog6I635Y+W55S16K+d5o6I5p2DICovXG4gICAgICAgIGdldFBob25lQXV0aCggZSApIHtcbiAgICAgICAgICAgIGFwcC5zdG9yZS5BdXRoLmdldFVzZXJQaG9uZUFuZFJlZ2lzdGVyKCBlIClcbiAgICAgICAgICAgICAgICAudGhlbiggZGF0YSA9PiBjb25zb2xlLmxvZyggJy4uLicsIGRhdGEgKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOWIneWni+WMlnNrde+8jOaOkuesrOS4gOS9jeeahOS8muiiq+m7mOiupOmAieS4rSAqL1xuICAgICAgICBpbml0U2VsZWN0ZWRTa3UoICkge1xuXG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IHsgc2t1cyB9ID0gdGhpc18uZGF0YTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmiJHnmoRza3UnLCBza3VzKTtcbiAgICAgICAgICAgIGlmICggIXNrdXMgfHwgc2t1cy5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAvLyDmib7liLDlvZPliY3lj6/pgInnmoRza3Xlubbpu5jorqTpgInmi6lcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRTa3VJbmRleCA9IHNrdXMuZmluZEluZGV4KCB4ID0+ICEheC5jYW5TZWxlY3QgKTtcblxuICAgICAgICAgICAgaWYgKCBkZWZhdWx0U2t1SW5kZXggIT09IC0xICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRTa3UgPSBza3VzWyBkZWZhdWx0U2t1SW5kZXggXTtcblxuICAgICAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFNrdTogZGVmYXVsdFNrdVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aIkeeahHNrdXNzc3NzcycsIHRoaXNfLmRhdGEuc2VsZWN0ZWRTa3UpO1xuICAgICAgICAgICAgICAgIGlmICggZGVmYXVsdFNrdS5jb3VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RkU2t1Q291bnQ6IGRlZmF1bHRTa3UuY291bnRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXNfLnRyaWdnZXJFdmVudCgnY2hhbmdlJywgZGVmYXVsdFNrdSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5YWz6Zet5by556qXICovXG4gICAgICAgIGNsb3NlKCApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfID0gKHRoaXMgYXMgYW55KTtcbiAgICAgICAgICAgIHRoaXNfLnRyaWdnZXJFdmVudCgndG9nZ2xlJywgZmFsc2UgKTtcbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRlKCApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDlpJbpg6josIPnlKjvvJrlsZXlvIAgKi9cbiAgICAgICAgb3BlbiggKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXyA9ICh0aGlzIGFzIGFueSk7XG4gICAgICAgICAgICBjb25zdCB7IG9wZW4gfSA9IHRoaXNfLmRhdGE7XG5cbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIG9wZW46IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNldEFuaW1hdGUoICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOWKqOeUuyAqL1xuICAgICAgICBzZXRBbmltYXRlKCApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfID0gKHRoaXMgYXMgYW55KTtcbiAgICAgICAgICAgIGNvbnN0IHsgb3BlbiwgaXNJUGhvbmVYIH0gPSB0aGlzXy5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb25Ta3VNZXRhOiBhbnkgPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwLCBcbiAgICAgICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2Utb3V0JywgXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uU2t1QmdNZXRhOiBhbnkgPSB3eC5jcmVhdGVBbmltYXRpb24oeyBcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwLCBcbiAgICAgICAgICAgICAgICB0aW1pbmdGdW5jdGlvbjogJ2Vhc2Utb3V0JywgXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJScsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCBvcGVuICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IGlzSVBob25lWCA/ICctNzJ2aCcgOiAnLTcwdmgnO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvblNrdU1ldGEub3BhY2l0eSggMC4zICkudHJhbnNsYXRlWSggaGVpZ2h0ICkub3BhY2l0eSggMSApLnN0ZXAoICk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uU2t1QmdNZXRhLm9wYWNpdHkoIDEgKS5zdGVwKCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25Ta3VNZXRhLm9wYWNpdHkoIDAuNSApLnRyYW5zbGF0ZVkoICc3MHZoJyApLm9wYWNpdHkoIDAgKS5zdGVwKCApO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvblNrdUJnTWV0YS5vcGFjaXR5KCAwICkuc3RlcCggKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uU2t1OiBhbmltYXRpb25Ta3VNZXRhLmV4cG9ydCggKSxcbiAgICAgICAgICAgICAgICBhbmltYXRpb25Ta3VCZzogYW5pbWF0aW9uU2t1QmdNZXRhLmV4cG9ydCggKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDnpoHmraLmu5HliqggKi9cbiAgICAgICAgcHJldmVudFRvdWNoTW92ZSggKSB7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKiog6aKE6KeI5Zu+54mHICovXG4gICAgICAgIHByZXZpZXdJbWcoeyBjdXJyZW50VGFyZ2V0IH06IGFueSkge1xuICAgICAgICAgICAgY29uc3QgaW1nID0gY3VycmVudFRhcmdldC5kYXRhc2V0LmltZztcbiAgICAgICAgICAgIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICAgICAgY3VycmVudDogaW1nLFxuICAgICAgICAgICAgICAgIHVybHM6IFsgaW1nIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDpgInmi6kgc2t1ICovXG4gICAgICAgIG9uU2VsZWN0U2t1KHsgY3VycmVudFRhcmdldCB9OiBhbnkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgdGFwcGluZ1NrdSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5zdGFuZGFyZDtcbiAgICAgICAgICAgIGlmICggIXRhcHBpbmdTa3UuY2FuU2VsZWN0ICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHNlbGVjdGRTa3VDb3VudDogMSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNrdTogdGFwcGluZ1NrdVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzXy50cmlnZ2VyRXZlbnQoJ2NoYW5nZScsIHRhcHBpbmdTa3UgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiogc2t1IOaVsOmHjyAqL1xuICAgICAgICBvblNrdUNvdW50KHsgZGV0YWlsIH06IGFueSkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RkU2t1Q291bnQ6IGRldGFpbC5udW1iZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDnoa7orqQgKi9cbiAgICAgICAgY29uZmlybVNlbGVjdCggZTogYW55ICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IHNlbGVjdGVkU2t1LCBzZWxlY3RkU2t1Q291bnQgfSA9IHRoaXNfLmRhdGE7XG4gICAgICAgICAgICB0aGlzXy50cmlnZ2VyRXZlbnQoJ2NvbmZpcm0nLCB7XG4gICAgICAgICAgICAgICAgc2t1OiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnNlbGVjdGVkU2t1LFxuICAgICAgICAgICAgICAgICAgICBjb3VudCQ6IHNlbGVjdGRTa3VDb3VudFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXNfLmNsb3NlKCApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDnm5HlkKwgKi9cbiAgICAgICAgd2F0Y2hBcHAoICkge1xuICAgICAgICAgICAgYXBwLndhdGNoJCgnQ29tbW9uLmlzSVBob25lWCcsIHYgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWFvOWuuWlwb25lWFxuICAgICAgICAgICAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBpc0lQaG9uZVg6IHZcbiAgICAgICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICB9LFxuXG4gICAgYXR0YWNoZWQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgdGhpcy53YXRjaEFwcCggKTtcbiAgICAgICAgdGhpcy5jaGVja0F1dGgoIClcbiAgICB9XG59KVxuICAiXX0=