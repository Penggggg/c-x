import axios from 'axios';
var Loading = require('muse-ui-loading').default;
var MuseUIToast = require('muse-ui-toast').default;
var errorWhiteList = [];
/**
 * @param options axios选项
 * @param tips { loadMsg: '加载中文字', errMsg: '失败文字', successMsg: '成功文字' }
 */
export var http = function (options, tips) {
    MuseUIToast.config({
        position: 'top',
    });
    var load = tips ?
        tips.loadMsg ?
            Loading({
                size: 30,
                color: '#fff',
                text: tips.loadMsg,
                className: 'decorate-loading',
                overlayColor: 'rgba( 0, 0, 0, 0.6)',
            }) :
            null :
        null;
    options.header = options.header || {};
    options.headers = Object.assign({}, options.header, {
        'x-csrf-token': getCookie('csrfToken'),
    });
    return axios(options)
        .then(function (req) {
        var _a = req.data, status = _a.status, message = _a.message, data = _a.data;
        if (load) {
            load.close();
        }
        if (Number(status) !== 200 && Number(status) !== 0) {
            MuseUIToast.error(tips ?
                tips.errMsg || message :
                message);
        }
        if ((Number(status) === 200 || Number(status) === 0) && !!tips && !!tips.successMsg) {
            MuseUIToast.success(tips.successMsg);
        }
        return req.data;
    }).catch(function (e) {
        if (load) {
            load.close();
        }
        MuseUIToast.error('网络错误, 请稍后重试');
        console.error('出错啦：', e);
    });
};
// 获取cookie
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
//# sourceMappingURL=http.js.map