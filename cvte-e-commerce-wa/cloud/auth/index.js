"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var cloud = require("wx-server-sdk");
var TcbRouter = require("tcb-router");
var axios = require("axios");
var config_1 = require("./config");
var WXBizDataCrypt = require("./RdWXBizDataCrypt");
cloud.init({
    env: process.env.cloud
});
var login = function (event) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, {
                status: 200,
                data: event.userInfo.openId
            }];
    });
}); };
var code2session = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var code, opt, req$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                code = event.data.code;
                opt = {
                    js_code: code,
                    appid: config_1.appConf.appid,
                    secret: config_1.appConf.appSecret,
                    grant_type: 'authorization_code'
                };
                return [4, axios({
                        method: 'get',
                        params: opt,
                        url: 'https://api.weixin.qq.com/sns/jscode2session'
                    })];
            case 1:
                req$ = _a.sent();
                if (!!req$.errcode) {
                    return [2, {
                            status: req$.errcode,
                            message: req$.errmsg
                        }];
                }
                else {
                    return [2, {
                            status: 200,
                            data: req$.data.session_key
                        }];
                }
                return [3, 3];
            case 2:
                e_1 = _a.sent();
                return [2, { status: 500 }];
            case 3: return [2];
        }
    });
}); };
var decrypPhone = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var _a, encryptedData, iv, sessionKey, pc, data;
    return __generator(this, function (_b) {
        try {
            _a = event.data, encryptedData = _a.encryptedData, iv = _a.iv, sessionKey = _a.sessionKey;
            pc = new WXBizDataCrypt(config_1.appConf.appid, sessionKey);
            data = pc.decryptData(encryptedData, iv);
            return [2, {
                    data: data,
                    status: 200
                }];
        }
        catch (e) {
            console.log('解密电话号码失败', typeof e === 'string' ? e : JSON.stringify(e));
            return [2, { status: 500, message: '获取电话失败，请重试' }];
        }
        return [2];
    });
}); };
var createRQCode = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var _a, page, scene, result, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = event.data, page = _a.page, scene = _a.scene;
                return [4, cloud.openapi.wxacode.getUnlimited({
                        page: page,
                        scene: scene || 'none'
                    })];
            case 1:
                result = _b.sent();
                if (result.errCode !== 0) {
                    throw result.errMsg;
                }
                return [2, {
                        status: 200,
                        data: result.buffer
                    }];
            case 2:
                e_2 = _b.sent();
                return [2, {
                        status: 500,
                        message: typeof e_2 === 'string' ? e_2 : JSON.stringify(e_2)
                    }];
            case 3: return [2];
        }
    });
}); };
exports.main = function (event, ctx) { return __awaiter(_this, void 0, void 0, function () {
    var app, $url;
    return __generator(this, function (_a) {
        app = new TcbRouter({ event: event });
        $url = event.$url;
        console.log('======= request ====== ', $url);
        switch ($url) {
            case 'login': {
                return [2, login(event)];
            }
            case 'jslogin': {
                return [2, code2session(event)];
            }
            case 'decrypPhone': {
                return [2, decrypPhone(event)];
            }
            case 'qrCode': {
                return [2, createRQCode(event)];
            }
            default: {
                return [2, {
                        status: 500,
                        message: 'not exsited'
                    }];
            }
        }
        return [2];
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE2SEE7O0FBN0hBLHFDQUF1QztBQUN2QyxzQ0FBd0M7QUFDeEMsNkJBQStCO0FBQy9CLG1DQUFtQztBQUNuQyxtREFBcUQ7QUFFckQsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Q0FDekIsQ0FBQyxDQUFDO0FBSUgsSUFBTSxLQUFLLEdBQUcsVUFBTSxLQUFLOztRQUNyQixXQUFPO2dCQUNILE1BQU0sRUFBRSxHQUFHO2dCQUNYLElBQUksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU07YUFDOUIsRUFBQzs7S0FDTCxDQUFDO0FBR0YsSUFBTSxZQUFZLEdBQUcsVUFBTSxLQUFLOzs7Ozs7Z0JBRWhCLElBQUksR0FBSyxLQUFLLENBQUMsSUFBSSxLQUFmLENBQWdCO2dCQUV0QixHQUFHLEdBQUc7b0JBQ1IsT0FBTyxFQUFFLElBQUk7b0JBQ2IsS0FBSyxFQUFFLGdCQUFPLENBQUMsS0FBSztvQkFDcEIsTUFBTSxFQUFFLGdCQUFPLENBQUMsU0FBUztvQkFDekIsVUFBVSxFQUFFLG9CQUFvQjtpQkFDbkMsQ0FBQztnQkFFVyxXQUFPLEtBQWEsQ0FBQzt3QkFDOUIsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsR0FBRyxFQUFFLDhDQUE4QztxQkFDdEQsQ0FBQyxFQUFBOztnQkFKSSxJQUFJLEdBQUcsU0FJWDtnQkFFRixJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFHO29CQUNsQixXQUFPOzRCQUNILE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTzs0QkFDcEIsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNO3lCQUN2QixFQUFBO2lCQUNKO3FCQUFNO29C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cUJBQ3pCLEVBQUM7YUFDTDtTQUNKOzs7S0FFSixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWQgZnJvbSAnd3gtc2VydmVyLXNkayc7XG5pbXBvcnQgKiBhcyBUY2JSb3V0ZXIgZnJvbSAndGNiLXJvdXRlcic7XG5pbXBvcnQgKiBhcyBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgeyBhcHBDb25mIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0ICogYXMgV1hCaXpEYXRhQ3J5cHQgZnJvbSAnLi9SZFdYQml6RGF0YUNyeXB0JztcblxuY2xvdWQuaW5pdCh7XG4gICAgZW52OiBwcm9jZXNzLmVudi5jbG91ZFxufSk7XG5cblxuLyoqIOeZu+mZhuiOt+WPlm9wZW5pZCAqL1xuY29uc3QgbG9naW4gPSBhc3luYyBldmVudCA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgIGRhdGE6IGV2ZW50LnVzZXJJbmZvLm9wZW5JZFxuICAgIH07XG59O1xuXG4vKiogY29kZSAyIHNlZXNpb24gKi9cbmNvbnN0IGNvZGUyc2Vzc2lvbiA9IGFzeW5jIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvZGUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcHQgPSB7XG4gICAgICAgICAgICBqc19jb2RlOiBjb2RlLFxuICAgICAgICAgICAgYXBwaWQ6IGFwcENvbmYuYXBwaWQsXG4gICAgICAgICAgICBzZWNyZXQ6IGFwcENvbmYuYXBwU2VjcmV0LFxuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ2F1dGhvcml6YXRpb25fY29kZSdcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZXEkID0gYXdhaXQgKGF4aW9zIGFzIGFueSkoe1xuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgIHBhcmFtczogb3B0LFxuICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9zbnMvanNjb2RlMnNlc3Npb24nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICggISFyZXEkLmVycmNvZGUgKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogcmVxJC5lcnJjb2RlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcSQuZXJybXNnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJlcSQuZGF0YS5zZXNzaW9uX2tleVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwIH07XG4gICAgfVxufTtcblxuLyoqIOino+WvhueUteivneWPt+eggSAqL1xuY29uc3QgZGVjcnlwUGhvbmUgPSBhc3luYyBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBlbmNyeXB0ZWREYXRhLCBpdiwgc2Vzc2lvbktleSB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgY29uc3QgcGMgPSBuZXcgV1hCaXpEYXRhQ3J5cHQoIGFwcENvbmYuYXBwaWQsIHNlc3Npb25LZXkgKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHBjLmRlY3J5cHREYXRhKCBlbmNyeXB0ZWREYXRhLCBpdiApO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogMjAwXG4gICAgICAgIH1cblxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBjb25zb2xlLmxvZygn6Kej5a+G55S16K+d5Y+356CB5aSx6LSlJywgdHlwZW9mIGUgPT09ICdzdHJpbmcnID8gZSA6IEpTT04uc3RyaW5naWZ5KCBlICkpXG4gICAgICAgIHJldHVybiB7IHN0YXR1czogNTAwLCBtZXNzYWdlOiAn6I635Y+W55S16K+d5aSx6LSl77yM6K+36YeN6K+VJyB9O1xuICAgIH1cbn1cblxuLyoqIOeUn+aIkOWwj+eoi+W6j+S6jOe7tOeggSAqL1xuY29uc3QgY3JlYXRlUlFDb2RlID0gYXN5bmMgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgcGFnZSwgc2NlbmUgfSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsb3VkLm9wZW5hcGkud3hhY29kZS5nZXRVbmxpbWl0ZWQoe1xuICAgICAgICAgICAgcGFnZSxcbiAgICAgICAgICAgIHNjZW5lOiBzY2VuZSB8fCAnbm9uZScgLy8gc2NlbmXkuLrlv4XloatcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCByZXN1bHQuZXJyQ29kZSAhPT0gMCApIHtcbiAgICAgICAgICAgIHRocm93IHJlc3VsdC5lcnJNc2dcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHJlc3VsdC5idWZmZXJcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgICBtZXNzYWdlOiB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogSlNPTi5zdHJpbmdpZnkoIGUgKVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IG1haW4gPSBhc3luYyAoIGV2ZW50LCBjdHggKSA9PiB7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgVGNiUm91dGVyKHsgZXZlbnQgfSk7XG4gICAgY29uc3QgJHVybCA9IGV2ZW50LiR1cmw7XG5cbiAgICBjb25zb2xlLmxvZygnPT09PT09PSByZXF1ZXN0ID09PT09PSAnLCAkdXJsICk7XG5cbiAgICBzd2l0Y2ggKCAkdXJsICkge1xuICAgICAgICBjYXNlICdsb2dpbic6IHtcbiAgICAgICAgICAgIHJldHVybiBsb2dpbiggZXZlbnQgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdqc2xvZ2luJzoge1xuICAgICAgICAgICAgcmV0dXJuIGNvZGUyc2Vzc2lvbiggZXZlbnQgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdkZWNyeXBQaG9uZSc6IHtcbiAgICAgICAgICAgIHJldHVybiBkZWNyeXBQaG9uZSggZXZlbnQgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdxckNvZGUnOiB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUlFDb2RlKCBldmVudCApO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHJldHVybiB7IFxuICAgICAgICAgICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdub3QgZXhzaXRlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuIl19