"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.aiMinio = exports.preSign = exports.post = void 0;
var Minio = __importStar(require("minio"));
/** Node直传 */
exports.post = function (conf) {
    return function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket_1, endPoint_1, port_1, client_1, exists, files_1, reult, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    bucket_1 = conf.bucket, endPoint_1 = conf.endPoint, port_1 = conf.port;
                    client_1 = new Minio.Client(conf);
                    return [4 /*yield*/, client_1.bucketExists(bucket_1)];
                case 1:
                    exists = _a.sent();
                    files_1 = ctx.request.files || (ctx.request.body || {}).files;
                    if (!!exists) return [3 /*break*/, 3];
                    return [4 /*yield*/, client_1.makeBucket(bucket_1, 'us-east-1')];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, Promise.all(Object.keys(files_1)
                        .map(function (fileKey) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, name, path;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = files_1[fileKey], name = _a.name, path = _a.path;
                                    return [4 /*yield*/, client_1.fPutObject(bucket_1, name, path, {})];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, endPoint_1 + ":" + port_1 + "/" + bucket_1 + "/" + name];
                            }
                        });
                    }); }))];
                case 4:
                    reult = _a.sent();
                    return [2 /*return*/, ctx.body = {
                            status: 200,
                            data: reult.length === 1 ? reult[0] : reult
                        }];
                case 5:
                    e_1 = _a.sent();
                    return [2 /*return*/, ctx.body = {
                            status: 500,
                            message: e_1
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); };
};
/** 获取签名，客户端直传 */
exports.preSign = function (conf, files) { return __awaiter(void 0, void 0, void 0, function () {
    var bucket_2, client_2, exists, reult, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                bucket_2 = conf.bucket;
                client_2 = new Minio.Client(conf);
                return [4 /*yield*/, client_2.bucketExists(bucket_2)];
            case 1:
                exists = _a.sent();
                if (!!exists) return [3 /*break*/, 3];
                return [4 /*yield*/, client_2.makeBucket(bucket_2, 'us-east-1')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, Promise.all(Object.keys(files)
                    .map(function (fileKey) { return __awaiter(void 0, void 0, void 0, function () {
                    var name;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                name = files[fileKey].name;
                                return [4 /*yield*/, client_2.presignedPutObject(bucket_2, name, 24 * 60 * 60)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }))];
            case 4:
                reult = _a.sent();
                return [2 /*return*/, reult.length === 1 ? reult[0] : reult];
            case 5:
                e_2 = _a.sent();
                return [2 /*return*/, e_2];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.aiMinio = {
    post: exports.post,
    preSign: exports.preSign
};
