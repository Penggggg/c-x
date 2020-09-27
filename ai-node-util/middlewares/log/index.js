"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiLog = void 0;
/**
 * 日志 - 中间件
 */
exports.aiLog = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var start, path, method, query, header, body, referer, summary0, summary00, summary1, summary2, summary3, summary4, end, summary5, summary6, end0, end1, end2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = new Date();
                path = ctx.path, method = ctx.method, query = ctx.query, header = ctx.header;
                body = ctx.request.body;
                referer = ctx.req.headers.referer;
                summary0 = "\n        ================= " + start.toLocaleString() + " =================\n    ";
                summary00 = "\n        referer: " + referer + "\n    ";
                summary1 = "\n        " + method.toLocaleUpperCase() + ": " + path + "\n    ";
                summary2 = "\n        Query: " + JSON.stringify(query || {}) + "\n    ";
                summary3 = "\n        Body: " + JSON.stringify(body || {}) + "\n    ";
                summary4 = "\n        Header: " + JSON.stringify(header || {}) + "\n    ";
                return [4 /*yield*/, next()];
            case 1:
                _a.sent();
                end = new Date();
                summary5 = "\n        Time: " + start.getTime() + "  " + end.getTime() + " \n    ";
                summary6 = "\n        Used: " + (end.getTime() - start.getTime()) + "ms\n    ";
                end0 = "\n        Status: " + ctx.status + "\n    ";
                end1 = "\n        Result: " + (typeof ctx.body === 'object' ? JSON.stringify(ctx.body) : ctx.body) + "\n    ";
                end2 = "\n        ================= End =================\n    ";
                // 修改log颜色
                console.log('\x1b[35m\x1b[1m');
                console.log(summary0);
                // 修改log颜色
                console.log('\x1b[32m\x1b[1m');
                console.log(summary00);
                console.log(summary1);
                console.log(summary2);
                console.log(summary3);
                console.log(summary4);
                console.log(summary5);
                console.log(summary6);
                // 修改log颜色
                console.log('\x1b[33m\x1b[1m');
                console.log(end0);
                // 修改log颜色
                console.log('\x1b[32m\x1b[1m');
                console.log(end1);
                // 修改log颜色
                console.log('\x1b[35m\x1b[1m');
                console.log(end2);
                return [2 /*return*/];
        }
    });
}); };
