"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../store/index");
var index_2 = require("../config/index");
exports.default = (function (data) {
    var platform = index_1.store$.Auth.wxUserDeviceInfo.platform;
    var _a = index_1.store$.Auth.wxUserInfo || {}, _b = _a.country, country = _b === void 0 ? '' : _b, _c = _a.province, province = _c === void 0 ? '' : _c, _d = _a.city, city = _d === void 0 ? '' : _d;
    wx.request({
        data: {
            $cp: {
                platform: platform,
                channelType: '小程序',
                $tid: index_1.store$.Auth.sysUserInfo.id ? index_1.store$.Auth.sysUserInfo.id : index_1.store$.Auth.sysUserInfo.templateId,
                userAddress: "" + country + province + city
            },
            $sp: data
        },
        header: {
            'X-Friday-Appid': index_2.default.fridayId,
            'X-Friday-Time': new Date().getTime(),
            'X-Friday-Ver': 'V1'
        },
        method: 'POST',
        url: 'https://myou.cvte.com/friday/agent/api/app/v2/report',
        success: function (res) {
            var _a = res.data, code = _a.code, message = _a.message;
            var hasError = Number(code) !== 0;
            if (hasError) {
                console.info("\u3010\u4E0A\u4F20\u57CB\u70B9\u4FE1\u606F ---- Error\u3011", message);
            }
            else {
                console.log('【上传埋点信息】', res.data, '【fridayId】:', index_2.default.fridayId);
            }
        },
        fail: function (e) {
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YUJ1cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYXRhQnVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF3QztBQUN4Qyx5Q0FBcUM7QUFPckMsbUJBQWUsVUFBQyxJQUFzRDtJQUMxRCxJQUFBLHdEQUFRLENBQWtDO0lBRTVDLElBQUEseUNBQW1FLEVBQWxFLGVBQVUsRUFBVixpQ0FBVSxFQUFHLGdCQUFXLEVBQVgsa0NBQVcsRUFBRyxZQUFPLEVBQVAsOEJBQXVDLENBQUM7SUFFekUsRUFBVSxDQUFDLE9BQU8sQ0FBQztRQUNoQixJQUFJLEVBQUM7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsUUFBUSxVQUFBO2dCQUNSLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixJQUFJLEVBQUUsY0FBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUEsQ0FBQyxDQUFDLGNBQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVU7Z0JBQ2pHLFdBQVcsRUFBRSxLQUFHLE9BQU8sR0FBRyxRQUFRLEdBQUcsSUFBTTthQUM5QztZQUNELEdBQUcsRUFBRSxJQUFJO1NBQ1o7UUFDRCxNQUFNLEVBQUU7WUFDTCxnQkFBZ0IsRUFBRSxlQUFNLENBQUMsUUFBUTtZQUNqQyxlQUFlLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDckMsY0FBYyxFQUFFLElBQUk7U0FDdEI7UUFDRCxNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxzREFBc0Q7UUFDM0QsT0FBTyxFQUFFLFVBQUMsR0FBUTtZQUNSLElBQUEsYUFBNEIsRUFBMUIsY0FBSSxFQUFFLG9CQUFvQixDQUFDO1lBRW5DLElBQU0sUUFBUSxHQUFJLE1BQU0sQ0FBRSxJQUFJLENBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkMsSUFBSyxRQUFRLEVBQUc7Z0JBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyw2REFBcUIsRUFBRSxPQUFPLENBQUUsQ0FBQTthQUNoRDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxlQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDcEU7UUFDTCxDQUFDO1FBQ0QsSUFBSSxFQUFFLFVBQUUsQ0FBQztRQU1ULENBQUM7S0FDSixDQUFDLENBQUM7QUFDUCxDQUFDLEVBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzdG9yZSQgfSBmcm9tICcuLi9zdG9yZS9pbmRleCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZy9pbmRleCc7XG5cbmludGVyZmFjZSB0eXBle1xuICAgICRjb2RlOiBzdHJpbmcsXG4gICAgJHRzOiBudW1iZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgKGRhdGE6IEFycmF5PHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH0gJiB0eXBlPikgPT4ge1xuICAgIGNvbnN0IHsgcGxhdGZvcm0gfSA9IHN0b3JlJC5BdXRoLnd4VXNlckRldmljZUluZm87XG4gICAgLy8g5b2T5YmN5YiG5Lqr5Lq655qE5Zyw5Z2A5Yy65Z+f5L+h5oGvXG4gICAgY29uc3Qge2NvdW50cnk9JycgLCBwcm92aW5jZT0nJyAsIGNpdHk9Jyd9ID0gc3RvcmUkLkF1dGgud3hVc2VySW5mbyB8fCB7fTtcbiAgICAvLyBjb25zb2xlLmxvZyh0eXBlKTtcbiAgICAod3ggYXMgYW55KS5yZXF1ZXN0KHtcbiAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAkY3A6IHtcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybSxcbiAgICAgICAgICAgICAgICBjaGFubmVsVHlwZTogJ+Wwj+eoi+W6jycsXG4gICAgICAgICAgICAgICAgJHRpZDogc3RvcmUkLkF1dGguc3lzVXNlckluZm8uaWQgPyBzdG9yZSQuQXV0aC5zeXNVc2VySW5mby5pZDogc3RvcmUkLkF1dGguc3lzVXNlckluZm8udGVtcGxhdGVJZCxcbiAgICAgICAgICAgICAgICB1c2VyQWRkcmVzczogYCR7Y291bnRyeX0ke3Byb3ZpbmNlfSR7Y2l0eX1gXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHNwOiBkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAnWC1GcmlkYXktQXBwaWQnOiBjb25maWcuZnJpZGF5SWQsXG4gICAgICAgICAgICdYLUZyaWRheS1UaW1lJzogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICdYLUZyaWRheS1WZXInOiAnVjEnXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6ICdodHRwczovL215b3UuY3Z0ZS5jb20vZnJpZGF5L2FnZW50L2FwaS9hcHAvdjIvcmVwb3J0JyxcbiAgICAgICAgc3VjY2VzczogKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGNvZGUsIG1lc3NhZ2UgfSA9IHJlcy5kYXRhO1xuXG4gICAgICAgICAgICBjb25zdCBoYXNFcnJvciA9ICBOdW1iZXIoIGNvZGUgKSAhPT0gMDtcbiAgICAgICAgICAgIGlmICggaGFzRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGDjgJDkuIrkvKDln4vngrnkv6Hmga8gLS0tLSBFcnJvcuOAkWAsIG1lc3NhZ2UgKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn44CQ5LiK5Lyg5Z+L54K55L+h5oGv44CRJyxyZXMuZGF0YSwgJ+OAkGZyaWRheUlk44CROicsIGNvbmZpZy5mcmlkYXlJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6ICggZSApID0+IHtcbiAgICAgICAgICAgIC8vIGdldEVycm9yKCAn572R57uc6ZSZ6K+vJyApO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ+WHuumUmeS6hicsIGUpO1xuICAgICAgICAgICAgLy8gcmVzb2x2ZSh7XG4gICAgICAgICAgICAvLyAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59Il19