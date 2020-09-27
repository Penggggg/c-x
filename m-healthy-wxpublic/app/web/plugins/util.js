var utilFunc = {
    // 判断是否为ios
    isIOS: function () {
        var isIphone = navigator.userAgent.includes('iPhone');
        var isIpad = navigator.userAgent.includes('iPad');
        return isIphone || isIpad;
    },
    // 获取url参数
    getQueryString: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
};
export var UtilPlugin = {
    install: function (vue, opts) {
        vue.prototype.$util = utilFunc;
    },
};
//# sourceMappingURL=util.js.map