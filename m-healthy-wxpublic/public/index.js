"use strict";
/** 配置 */
window.initConsole = function (opt) {
    if (opt === void 0) { opt = {
        url: '/api/common/client-error',
        csrf: 'csrfToken',
        lsName: ''
    }; }
    var originErrorLog = window.console.error;
    window.console.error = function (msg) {
        // 获取csrf-token
        var csrf = getCookie(opt.csrf);
        // 获取ls数据
        var OtherMessage = '';
        opt.lsName.split(',').map(function (lsName) {
            OtherMessage += lsName + ": " + getLs(lsName) + ";";
        });
        // 组织上报错误
        var allMessage = "Origin Message: " + msg + "; Other Message: " + OtherMessage;
        // 上传
        var xhr = new XMLHttpRequest();
        xhr.open('POST', opt.url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        ;
        if (opt.csrfName) {
            xhr.setRequestHeader(opt.csrfName, csrf);
        }
        xhr.send(JSON.stringify("msg=" + allMessage));
        originErrorLog(msg);
    };
};
/** 获取ls的值 */
function getLs(name) {
    return localStorage.getItem(name);
}
/** 获取csrf-token */
function getCookie(name) {
    name = name + '=';
    var start = document.cookie.indexOf(name);
    var value = '';
    if (start > -1) {
        var end = document.cookie.indexOf(';', start);
        if (end === -1) {
            end = document.cookie.length;
        }
        value = document.cookie.substring(start + name.length, end);
    }
    return value;
}
//# sourceMappingURL=index.js.map