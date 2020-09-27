"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var aiUtil = __importStar(require("@cvte/ai-node-util"));
var isDev = !String(process.env.NODE_ENV).startsWith('prod');
var _dataID = isDev ?
    'ai-labeling-test' :
    'ai-labeling-prod';
var _group = isDev ?
    'ai-labeling-test' :
    'ai-labeling-prod';
exports.getConfig = function (dataId, group) {
    if (dataId === void 0) { dataId = _dataID; }
    if (group === void 0) { group = _group; }
    return aiUtil.getNacos(dataId, group, path_1.default.join(__dirname, '../../config/nacos.json')).then(function (res) {
        console.log("\n            ============ navos \u914D\u7F6E ==============\n        ");
        console.log(res.data);
        if (!res.ok) {
            console.error("\n                ============ \u83B7\u53D6navos\u9519\u8BEF ==============\n            ");
        }
        return res;
    });
};
