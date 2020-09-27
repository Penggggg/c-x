"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKeysEmpty = void 0;
/**
 * 把一个对象里面
 * 返回其值为空的一些keys
 */
var checkKeys = function (keyArr, obj) {
    var failKeys = keyArr.filter(function (x) {
        return obj[x] === undefined || obj[x] === null;
    });
    return failKeys.join(',');
};
/**
 * 若指定的key为空，则返回客户端错误
 */
exports.isKeysEmpty = function (params) {
    if (params === void 0) { params = {}; }
    return function (target, name, descriptor) {
        var olaValue = descriptor.value;
        // 在原代码基础上，拓展一些功能
        descriptor.value = function (ctx) {
            if (!!exports.isKeysEmpty) {
                var bodyCheck = checkKeys((params.body || '').split(','), ctx.request.body || {});
                var queryCheck = checkKeys((params.query || '').split(','), ctx.query || {});
                if (!!bodyCheck || !!queryCheck) {
                    return ctx.body = {
                        status: 400,
                        message: "" + (queryCheck ? 'Query: ' + queryCheck + ' is Required' : '') + (bodyCheck ? ' Body: ' + bodyCheck + ' is Required' : '')
                    };
                }
            }
            return olaValue.apply(this, arguments);
        };
        return descriptor;
    };
};
