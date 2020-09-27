"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNacos = void 0;
var nacos = require('nacos');
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
/**
 *
 * @param dataId nacos Data Id
 * @param group nacos Group
 * @param filePath 文件生成的路径、名称，如：__dirname + './config/nacos.json'
 * @param serverAddr nacos服务IP（含端口）不填默认为：10.22.21.38:8848，查看地址 http://nacos.research.cvte.cn/
 */
exports.getNacos = function (dataId, group, filePath, serverAddr) {
    if (filePath === void 0) { filePath = ''; }
    return new Promise(function (res) {
        if (!dataId || !group) {
            console.error("\n                ============== Nacos Error ================\n            ");
            console.error("\n                \u8BF7\u4F20\u5165dataId\u3001group\u3001filePath\n            ");
            return res({
                data: {},
                ok: false
            });
        }
        var client = new nacos.NacosConfigClient({
            serverAddr: serverAddr || '10.22.21.38:8848',
        });
        client.subscribe({
            dataId: dataId,
            group: group,
        }, function (c) {
            var config = {};
            try {
                config = JSON.parse(c);
            }
            catch (e) {
                config = c;
            }
            return res({
                ok: true,
                data: config,
                createdFile: creatJSON(filePath, config)
            });
        });
    });
};
/**
 *
 * @param filePath 文件路径
 * @param data 文件信息
 */
function creatJSON(filePath, data) {
    if (!filePath) {
        return false;
    }
    if (!!filePath && !filePath.endsWith('.json')) {
        console.error("\n            ============== Nacos Error ================\n        ");
        console.error("\n            filePath\u8981\u4EE5 .json\u7ED3\u5C3E\n        ");
        return false;
    }
    ;
    var filePathArr = filePath.split('/');
    var fileName = filePathArr[filePathArr.length - 1];
    // 创建目录
    mkDirSync(path_1.default.dirname(filePath));
    // 创建文件
    fs_1.default.writeFileSync(filePath, typeof data === 'object' ? JSON.stringify(data) : data);
    return true;
}
/**
 *
 * @param dirname 递归创建目录
 */
function mkDirSync(dirname) {
    if (fs_1.default.existsSync(dirname)) {
        return true;
    }
    else {
        // 如果上级存在
        if (mkDirSync(path_1.default.dirname(dirname))) {
            // 创建本级
            fs_1.default.mkdirSync(dirname);
            return true;
        }
    }
}
