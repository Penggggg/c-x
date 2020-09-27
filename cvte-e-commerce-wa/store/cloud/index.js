"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watch_1 = require("../../utils/watch");
var Cloud = (function () {
    function Cloud() {
        this.cloudEnv = undefined;
    }
    Cloud.prototype.initCloud = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            wx.cloud.init({
                traceUser: true,
                env: _this.cloudEnv
            });
            resolve();
        });
    };
    return Cloud;
}());
exports.default = watch_1.watch('Cloud', new Cloud());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJDQUEwQztBQVExQztJQUFBO1FBRVksYUFBUSxHQUFHLFNBQVMsQ0FBQztJQVlqQyxDQUFDO0lBVlUseUJBQVMsR0FBaEI7UUFBQSxpQkFRQztRQVBHLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBRSxPQUFPLEVBQUUsTUFBTTtZQUNoQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixHQUFHLEVBQUUsS0FBSSxDQUFDLFFBQVE7YUFDckIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxFQUFHLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTCxZQUFDO0FBQUQsQ0FBQyxBQWRELElBY0M7QUFFRCxrQkFBZSxhQUFLLENBQVMsT0FBTyxFQUFFLElBQUksS0FBSyxFQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwJztcbmltcG9ydCB7IHdhdGNoIH0gZnJvbSAnLi4vLi4vdXRpbHMvd2F0Y2gnO1xuaW1wb3J0IHsgY2xvdWRIdHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2xvdWRIdHRwJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICog5LqR5pyN5YqhXG4gKiBcbiAqL1xuY2xhc3MgQ2xvdWQge1xuXG4gICAgcHJpdmF0ZSBjbG91ZEVudiA9IHVuZGVmaW5lZDtcblxuICAgIHB1YmxpYyBpbml0Q2xvdWQoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICB3eC5jbG91ZC5pbml0KHtcbiAgICAgICAgICAgICAgICB0cmFjZVVzZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgZW52OiB0aGlzLmNsb3VkRW52XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB3YXRjaDxDbG91ZD4oICdDbG91ZCcsIG5ldyBDbG91ZCggKSk7XG4gIl19