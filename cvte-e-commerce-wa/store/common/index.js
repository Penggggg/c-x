"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watch_1 = require("../../utils/watch");
var Common = (function () {
    function Common() {
        this.isIPhoneX = false;
        this.customerService = '4009316825';
    }
    Common.prototype.judgeIPhoneX = function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.isIPhoneX = res.model.indexOf('iPhone X') > -1;
            }
        });
    };
    return Common;
}());
exports.default = watch_1.watch('Common', new Common());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJDQUEwQztBQVcxQztJQUFBO1FBR1csY0FBUyxHQUFHLEtBQUssQ0FBQztRQUdsQixvQkFBZSxHQUFHLFlBQVksQ0FBQztJQVcxQyxDQUFDO0lBUlUsNkJBQVksR0FBbkI7UUFBQSxpQkFNQztRQUxHLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDYixPQUFPLEVBQUUsVUFBQyxHQUFHO2dCQUNULEtBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNSLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0FBQyxBQWpCRCxJQWlCQztBQUVELGtCQUFlLGFBQUssQ0FBVSxRQUFRLEVBQUUsSUFBSSxNQUFNLEVBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAnO1xuaW1wb3J0IHsgd2F0Y2ggfSBmcm9tICcuLi8uLi91dGlscy93YXRjaCc7XG5pbXBvcnQgeyBjbG91ZEh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9jbG91ZEh0dHAnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IHsgU3RvcmFnZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbnN0YW50JztcblxuXG4vKipcbiAqIEBkZXByZWNhdGVkXG4gKiDpgJrnlKhcbiAqIFxuICovXG5jbGFzcyBDb21tb24ge1xuXG4gICAgLyoqIOaYr+WQpuS4umlwaG9uZXggKi9cbiAgICBwdWJsaWMgaXNJUGhvbmVYID0gZmFsc2U7XG5cbiAgICAvKiog5a6i5pyN55S16K+dICovXG4gICAgcHVibGljIGN1c3RvbWVyU2VydmljZSA9ICc0MDA5MzE2ODI1JztcblxuICAgIC8qKiDojrflj5bnlKjmiLforr7lpIfkv6Hmga8gKi8gXG4gICAgcHVibGljIGp1ZGdlSVBob25lWCggKXtcbiAgICAgICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0lQaG9uZVggPSByZXMubW9kZWwuaW5kZXhPZignaVBob25lIFgnKSA+IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdhdGNoPENvbW1vbj4oICdDb21tb24nLCBuZXcgQ29tbW9uKCApKTtcbiAiXX0=