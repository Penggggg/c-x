"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../utils/http.js");
var cloudHttp_1 = require("../../utils/cloudHttp");
Component({
    properties: {
        page: {
            type: String,
            value: '',
            observer: 'onPageChange'
        },
        scene: {
            type: String,
            value: '',
            observer: 'onSceneChange'
        },
        timeout: {
            type: Number,
            value: 0
        },
        scale: {
            type: Number,
            value: 0.9
        },
        shadow: {
            type: Boolean,
            value: true
        }
    },
    data: {
        loading: true,
        canvasHeight: 0,
        canvasWidth: 0,
        countdown: 0,
        timer: null
    },
    methods: {
        onPageChange: function (v) {
            var this_ = this;
            var scene = this_.data.scene;
            this.createQrCode(v, scene);
        },
        onSceneChange: function (v) {
            var this_ = this;
            var page = this_.data.page;
            this.createQrCode(page, v);
            this.keepSk(v);
        },
        createQrCode: function (page, scene) {
            var _this = this;
            var this_ = this;
            var scale = this_.data.scale;
            if (!page) {
                return;
            }
            cloudHttp_1.cloudHttp({
                url: 'auth_qrCode',
                data: {
                    page: page,
                    scene: scene
                },
                success: function (res) {
                    var wx_ = wx;
                    var status = res.status, data = res.data;
                    var fsm = wx.getFileSystemManager();
                    var ctx = wx_.createCanvasContext('c1', _this);
                    var qrCode = wx_.env.USER_DATA_PATH + '/wa_qrcode_temp.png';
                    if (res.status !== 200) {
                        return;
                    }
                    try {
                        fsm.removeSavedFile({
                            filePath: qrCode
                        });
                    }
                    catch (e) { }
                    fsm.writeFileSync(qrCode, data, 'binary');
                    wx.getSystemInfo({
                        success: function (system) {
                            var windowWidth = system.windowWidth, windowHeight = system.windowHeight;
                            var canvasWidth = Number((windowWidth * scale).toFixed(0));
                            ctx.fillStyle = '#fff';
                            ctx.fillRect(0, 0, canvasWidth, canvasWidth);
                            this_.setData({
                                canvasWidth: canvasWidth,
                                canvasHeight: canvasWidth
                            });
                            console.log('重新绘了');
                            ctx.drawImage(qrCode, 0, 0, canvasWidth, canvasWidth);
                            ctx.draw(false, function () {
                                this_.setData({
                                    loading: false
                                });
                                _this.checkTimeout();
                                this_.triggerEvent('load', true);
                            });
                        }
                    });
                }
            });
        },
        checkTimeout: function () {
            var this_ = this;
            var now = Date.now();
            var timeout = this_.data.timeout;
            if (!timeout) {
                return;
            }
            var deal = Number(((Number(timeout) - now) / 1000).toFixed(0));
            this_.setData({
                countdown: deal
            });
        },
        keepSk: function (scene, timeout) {
            var _this = this;
            if (timeout === void 0) { timeout = 30 * 1000; }
            var this_ = this;
            var sceneArr = scene.split('&');
            var skTarget = sceneArr.find(function (x) { return x.indexOf('sk=') === 0; });
            if (!skTarget) {
                return;
            }
            var sk = skTarget.split('=')[1];
            this_.setData({
                timer: setInterval(function () {
                    _this.fetchKeepSk(sk);
                }, timeout)
            });
        },
        fetchKeepSk: function (sk) {
            if (!sk) {
                return;
            }
            http_js_1.http({
                errMsg: 'none',
                loadingMsg: 'none',
                path: "/apis/common/sk-renew?sk=" + sk
            });
        }
    },
    attached: function () {
    },
    detached: function () {
        var timer = this.data.timer;
        if (timer) {
            clearInterval(timer);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUEyQztBQUMzQyxtREFBa0Q7QUFPbEQsU0FBUyxDQUFDO0lBS04sVUFBVSxFQUFFO1FBR1IsSUFBSSxFQUFFO1lBQ0YsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxjQUFjO1NBQzNCO1FBR0QsS0FBSyxFQUFFO1lBQ0gsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxlQUFlO1NBQzVCO1FBR0QsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsQ0FBQztTQUNYO1FBR0QsS0FBSyxFQUFFO1lBQ0gsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsR0FBRztTQUNiO1FBR0QsTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUsSUFBSTtTQUNkO0tBRUo7SUFLRCxJQUFJLEVBQUU7UUFHRixPQUFPLEVBQUUsSUFBSTtRQUViLFlBQVksRUFBRSxDQUFDO1FBRWYsV0FBVyxFQUFFLENBQUM7UUFHZCxTQUFTLEVBQUUsQ0FBQztRQUdaLEtBQUssRUFBRSxJQUFJO0tBRWQ7SUFLRCxPQUFPLEVBQUU7UUFHTCxZQUFZLFlBQUUsQ0FBQztZQUNYLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNoQixJQUFBLHdCQUFLLENBQWdCO1lBQzdCLElBQUksQ0FBQyxZQUFZLENBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBRSxDQUFDO1FBQ2xDLENBQUM7UUFHRCxhQUFhLFlBQUUsQ0FBQztZQUNaLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNoQixJQUFBLHNCQUFJLENBQWdCO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUUsSUFBSSxFQUFFLENBQUMsQ0FBRSxDQUFDO1lBQzdCLElB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QUFhLENBQUUsS0FBSyxDQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjbG91ZEh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9jbG91ZEh0dHAnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXguanMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog5bCP56iL5bqP5LqM57u056CB55Sf5oiQ5ZmoXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy8g5LqM57u056CB6aG16Z2iXG4gICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnb25QYWdlQ2hhbmdlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOWPguaVsFxuICAgICAgICBzY2VuZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgb2JzZXJ2ZXI6ICdvblNjZW5lQ2hhbmdlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOi/h+acn+aXtumXtFxuICAgICAgICB0aW1lb3V0OiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOe8qeaUvuavlOS+i1xuICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDAuOVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOaYr+WQpuaciemYtOW9sVxuICAgICAgICBzaGFkb3c6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICB9XG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgLyoqIOaYr+WQpuWKoOi9veS4rSAqL1xuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuXG4gICAgICAgIGNhbnZhc0hlaWdodDogMCxcblxuICAgICAgICBjYW52YXNXaWR0aDogMCxcblxuICAgICAgICAvKiog5YCS6K6h5pe2ICovXG4gICAgICAgIGNvdW50ZG93bjogMCxcblxuICAgICAgICAvKiog5a6a5pe25ZmoICovXG4gICAgICAgIHRpbWVyOiBudWxsXG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTmlrnms5XliJfooahcbiAgICAgKi9cbiAgICBtZXRob2RzOiB7XG5cbiAgICAgICAgLy8gcGFnZeWPmOWMllxuICAgICAgICBvblBhZ2VDaGFuZ2UoIHYgKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IHsgc2NlbmUgfSA9IHRoaXNfLmRhdGE7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVFyQ29kZSggdiwgc2NlbmUgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBzY2VuZeWPmOWMllxuICAgICAgICBvblNjZW5lQ2hhbmdlKCB2ICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IHBhZ2UgfSA9IHRoaXNfLmRhdGE7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVFyQ29kZSggcGFnZSwgdiApO1xuICAgICAgICAgICAgdGhpcy5rZWVwU2soIHYgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDkuoznu7TnoIHnlJ/miJBcbiAgICAgICAgY3JlYXRlUXJDb2RlKCBwYWdlLCBzY2VuZSApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IHNjYWxlIH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgaWYgKCAhcGFnZSApIHsgcmV0dXJuIDsgfVxuICAgIFxuICAgICAgICAgICAgY2xvdWRIdHRwKHtcbiAgICAgICAgICAgICAgICB1cmw6ICdhdXRoX3FyQ29kZScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYWdlLFxuICAgICAgICAgICAgICAgICAgICBzY2VuZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3hfOiBhbnkgPSB3eDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnNtID0gd3guZ2V0RmlsZVN5c3RlbU1hbmFnZXIoICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN0eCA9IHd4Xy5jcmVhdGVDYW52YXNDb250ZXh0KCdjMScsIHRoaXMgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcXJDb2RlID0gd3hfLmVudi5VU0VSX0RBVEFfUEFUSCArICcvd2FfcXJjb2RlX3RlbXAucG5nJztcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKCByZXMuc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIOi/memHjOimgeWIoOmZpOS4tOaXtuaWh+S7tu+8ge+8ge+8gVxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnNtLnJlbW92ZVNhdmVkRmlsZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IHFyQ29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkgeyB9XG5cbiAgICAgICAgICAgICAgICAgICAgZnNtLndyaXRlRmlsZVN5bmMoIHFyQ29kZSwgZGF0YSwgJ2JpbmFyeScgKTtcbiAgICAgICAgICAgICAgICAgICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBzeXN0ZW0gPT4ge1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCB9ID0gc3lzdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhc1dpZHRoID0gTnVtYmVyKCggd2luZG93V2lkdGggKiBzY2FsZSApLnRvRml4ZWQoIDAgKSk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZmJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoIDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNXaWR0aCApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzSGVpZ2h0OiBjYW52YXNXaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfph43mlrDnu5jkuoYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXJDb2RlLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhc1dpZHRoLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3KCBmYWxzZSwgKCApID0+IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1RpbWVvdXQoICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfLnRyaWdnZXJFdmVudCgnbG9hZCcsIHRydWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g6K6+572u6L+H5pyf5pe26Ze0XG4gICAgICAgIGNoZWNrVGltZW91dCggKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCApO1xuICAgICAgICAgICAgY29uc3QgeyB0aW1lb3V0IH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoICF0aW1lb3V0ICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgY29uc3QgZGVhbCA9IE51bWJlcigoKCBOdW1iZXIoIHRpbWVvdXQgKSAtIG5vdyApIC8gMTAwMCApLnRvRml4ZWQoIDAgKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGNvdW50ZG93bjogZGVhbFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBza+e7reWRvVxuICAgICAgICBrZWVwU2soIHNjZW5lLCB0aW1lb3V0ID0gMzAgKiAxMDAwICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCBzY2VuZUFyciA9IHNjZW5lLnNwbGl0KCcmJyk7XG4gICAgICAgICAgICBjb25zdCBza1RhcmdldCA9IHNjZW5lQXJyLmZpbmQoIHggPT4geC5pbmRleE9mKCdzaz0nKSA9PT0gMCApO1xuICAgICAgICAgICAgaWYgKCAhc2tUYXJnZXQgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBjb25zdCBzayA9IHNrVGFyZ2V0LnNwbGl0KCc9JylbIDEgXTtcbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHRpbWVyOiBzZXRJbnRlcnZhbCgoICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZldGNoS2VlcFNrKCBzayApO1xuICAgICAgICAgICAgICAgIH0sIHRpbWVvdXQgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBza+e7reWRvVxuICAgICAgICBmZXRjaEtlZXBTayggc2sgKSB7XG4gICAgICAgICAgICBpZiAoICFzayApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBodHRwKHtcbiAgICAgICAgICAgICAgICBlcnJNc2c6ICdub25lJyxcbiAgICAgICAgICAgICAgICBsb2FkaW5nTXNnOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgcGF0aDogYC9hcGlzL2NvbW1vbi9zay1yZW5ldz9zaz0ke3NrfWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbiggKSB7XG5cbiAgICB9LFxuICAgIFxuICAgIGRldGFjaGVkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgIGNvbnN0IHsgdGltZXIgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKCB0aW1lciApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoIHRpbWVyICk7XG4gICAgICAgIH1cbiAgICB9XG59KVxuICAiXX0=