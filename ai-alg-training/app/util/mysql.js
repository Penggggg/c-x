"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aiUtil = __importStar(require("@cvte/ai-node-util"));
var sqlInstance;
exports.sqlHelper = {
    init: function (conf) {
        sqlInstance = new aiUtil.Sql(conf);
    },
    get: function () {
        return sqlInstance;
    }
};
